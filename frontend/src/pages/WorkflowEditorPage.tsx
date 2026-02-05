import { useCallback } from 'react';
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
import { Save, Play } from 'lucide-react';
import { toast } from 'sonner';

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'input',
        data: { label: 'Start' },
        position: { x: 250, y: 5 },
    },
];

export default function WorkflowEditorPage() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const handleSave = () => {
        const workflowState = { nodes, edges };
        console.log('Saving workflow:', workflowState);
        toast.success('Workflow saved!');
        // TODO: Save to backend
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h1 className="text-3xl font-bold">Workflow Editor</h1>
                    <p className="text-muted-foreground">Build your AI workflow</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSave} className="gap-2">
                        <Save className="h-4 w-4" />
                        Save
                    </Button>
                    <Button className="gap-2">
                        <Play className="h-4 w-4" />
                        Test
                    </Button>
                </div>
            </motion.div>

            {/* Canvas */}
            <motion.div
                className="h-[calc(100vh-200px)] rounded-lg border bg-card shadow-accent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                >
                    <Controls />
                    <MiniMap />
                    <Background gap={12} size={1} />
                </ReactFlow>
            </motion.div>
        </div>
    );
}
