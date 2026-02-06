import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import ReactFlow, {
    type Node,
    Controls,
    Background,
    MiniMap,
    addEdge,
    type Connection,
    useNodesState,
    useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Save, Play, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import LLMNode from '@/components/nodes/LLMNode';
import InputNode from '@/components/nodes/InputNode';
import { Sidebar } from '@/components/Sidebar';
import { useAuthStore } from '@/store/auth-store';

import OutputNode from '@/components/nodes/OutputNode';

const nodeTypes = {
    llm: LLMNode,
    input: InputNode,
    output: OutputNode,
};

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'input',
        data: { value: 'Hello, how are you?' },
        position: { x: 100, y: 100 },
    },
    {
        id: '2',
        type: 'llm',
        data: {
            model: 'gemini-pro',
            system_prompt: 'You are a helpful assistant. Reply concisely.',
            temperature: 0.7
        },
        position: { x: 500, y: 100 },
    }
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' }
];

export default function WorkflowEditorPage() {
    const { id } = useParams();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [isExecuting, setIsExecuting] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const onNodeClick = useCallback((_: any, node: Node) => {
        setSelectedNodeId(node.id);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null);
    }, []);

    const handleSave = () => {
        const workflowState = { nodes, edges };
        console.log('Saving workflow:', workflowState);
        toast.success('Workflow saved!');
        // TODO: Save to backend
    };

    const handleExecute = async () => {
        setIsExecuting(true);
        toast.info('Starting execution...');

        try {
            // For now, allow running without ID (using temp) or use existing ID from URL
            const workflowId = id || 'temp-id';

            // Execute the workflow via backend API
            // Send current nodes/edges to allow stateless execution (unsaved)
            const token = useAuthStore.getState().token;
            const response = await axios.post(`http://localhost:8000/api/workflows/${workflowId}/execute`, {
                initial_inputs: {},
                nodes: nodes,
                edges: edges
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Extract text from result for display
            const results = response.data.results;
            const logEntries = response.data.logs || [];

            let displayOutput = "Execution successful";

            const llmNodeId = Object.keys(results).find(key => results[key]?.generated_text);
            if (llmNodeId) {
                displayOutput = results[llmNodeId].generated_text;
            } else if (logEntries.length > 0) {
                const lastLog = logEntries[logEntries.length - 1];
                displayOutput = `Node ${lastLog.node_id}: ${JSON.stringify(lastLog.output)}`;
            }

            toast.success('Execution completed!', {
                description: displayOutput,
                duration: 5000,
            });

        } catch (error: any) {
            console.error('Execution failed:', error);
            const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
            toast.error(`Execution failed: ${errorMessage}`);
        } finally {
            setIsExecuting(false);
        }
    };

    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
            {/* Header */}
            <motion.div
                className="flex items-center justify-between p-4 border-b z-10 bg-card"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h1 className="text-2xl font-bold">Workflow Editor</h1>
                    <p className="text-sm text-muted-foreground">Build your AI workflow</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSave} className="gap-2">
                        <Save className="h-4 w-4" />
                        Save
                    </Button>
                    <Button className="gap-2" onClick={handleExecute} disabled={isExecuting}>
                        {isExecuting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
                        {isExecuting ? 'Running...' : 'Run Workflow'}
                    </Button>
                </div>
            </motion.div>

            <div className="flex flex-1 overflow-hidden">
                {/* Canvas */}
                <div className="flex-1 relative bg-muted/10">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <Controls />
                        <MiniMap />
                        <Background gap={12} size={1} />
                    </ReactFlow>
                </div>

                {/* Sidebar Property Panel */}
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: selectedNode ? 320 : 0, opacity: selectedNode ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-l bg-card overflow-hidden h-full shadow-xl"
                >
                    <Sidebar
                        selectedNode={selectedNode}
                        setNodes={setNodes}
                        nodes={nodes}
                        onClose={() => setSelectedNodeId(null)}
                    />
                </motion.div>
            </div>
        </div>
    );
}
