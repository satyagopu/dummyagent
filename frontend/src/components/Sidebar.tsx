import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Trash2, X } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface SidebarProps {
    selectedNode: any;
    setNodes: (nodes: any[]) => void;
    nodes: any[];
    onClose: () => void;
}

export function Sidebar({ selectedNode, setNodes, nodes, onClose }: SidebarProps) {
    const [availableTools, setAvailableTools] = useState<any[]>([]);
    const { token } = useAuthStore();

    useEffect(() => {
        if (selectedNode?.type === 'agent') {
            const fetchTools = async () => {
                try {
                    const response = await axios.get('http://localhost:8000/api/workflows/tools', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setAvailableTools(response.data);
                } catch (error) {
                    console.error("Failed to fetch tools", error);
                }
            };
            fetchTools();
        }
    }, [selectedNode?.type, token]);

    if (!selectedNode) return null;

    const handleChange = (field: string, value: any) => {
        setNodes(nodes.map(node => {
            if (node.id === selectedNode.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        [field]: value
                    }
                };
            }
            return node;
        }));
    };

    return (
        <div className="w-80 h-full border-l bg-card p-4 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Properties</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <Separator />

            {selectedNode.type === 'input' && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Initial Value</Label>
                        <Input
                            value={selectedNode.data.value || ''}
                            onChange={(e) => handleChange('value', e.target.value)}
                            placeholder="Enter starting text..."
                        />
                    </div>
                </div>
            )}

            {selectedNode.type === 'llm' && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Model</Label>
                        <Select
                            value={selectedNode.data.model || 'gemini-pro'}
                            onValueChange={(value) => handleChange('model', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gemini-pro">Google Gemini Pro</SelectItem>
                                <SelectItem value="gpt-4">OpenAI GPT-4</SelectItem>
                                <SelectItem value="gpt-3.5-turbo">OpenAI GPT-3.5</SelectItem>
                                <SelectItem value="claude-3-sonnet">AWS Claude 3 Sonnet</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>System Prompt</Label>
                        <Textarea
                            className="h-32 resize-none"
                            value={selectedNode.data.system_prompt || ''}
                            onChange={(e) => handleChange('system_prompt', e.target.value)}
                            placeholder="You are a helpful AI assistant..."
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Temperature</Label>
                            <span className="text-xs text-muted-foreground">{selectedNode.data.temperature || 0.7}</span>
                        </div>
                        <Input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={selectedNode.data.temperature || 0.7}
                            onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                        />
                    </div>
                </div>
            )}

            {selectedNode.type === 'custom' && (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Label</Label>
                        <Input
                            value={selectedNode.data.label || 'Custom Node'}
                            onChange={(e) => handleChange('label', e.target.value)}
                            placeholder="Node Label"
                        />
                    </div>

                    {/* Inputs Management */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-semibold uppercase">Inputs</Label>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-[10px]"
                                onClick={() => {
                                    const inputs = selectedNode.data.inputs || [];
                                    handleChange('inputs', [...inputs, { name: `input_${inputs.length + 1}`, type: 'string' }]);
                                }}
                            >
                                + Add
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {(selectedNode.data.inputs || []).map((input: any, index: number) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <Input
                                        value={input.name}
                                        className="h-8 text-xs"
                                        onChange={(e) => {
                                            const newInputs = [...(selectedNode.data.inputs || [])];
                                            newInputs[index].name = e.target.value;
                                            handleChange('inputs', newInputs);
                                        }}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive"
                                        onClick={() => {
                                            const newInputs = [...(selectedNode.data.inputs || [])];
                                            newInputs.splice(index, 1);
                                            handleChange('inputs', newInputs);
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Outputs Management */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-semibold uppercase">Outputs</Label>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-6 text-[10px]"
                                onClick={() => {
                                    const outputs = selectedNode.data.outputs || [];
                                    handleChange('outputs', [...outputs, { name: `output_${outputs.length + 1}`, type: 'string' }]);
                                }}
                            >
                                + Add
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {(selectedNode.data.outputs || []).map((output: any, index: number) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <Input
                                        value={output.name}
                                        className="h-8 text-xs"
                                        onChange={(e) => {
                                            const newOutputs = [...(selectedNode.data.outputs || [])];
                                            newOutputs[index].name = e.target.value;
                                            handleChange('outputs', newOutputs);
                                        }}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive"
                                        onClick={() => {
                                            const newOutputs = [...(selectedNode.data.outputs || [])];
                                            newOutputs.splice(index, 1);
                                            handleChange('outputs', newOutputs);
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                            {(selectedNode.data.outputs || []).length === 0 && (
                                <p className="text-xs text-muted-foreground italic">No outputs defined.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {selectedNode.type === 'agent' && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Model</Label>
                        <Select
                            value={selectedNode.data.model || 'gemini-pro'}
                            onValueChange={(value) => handleChange('model', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                                <SelectItem value="gpt-4">GPT-4</SelectItem>
                                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>System Prompt</Label>
                        <Textarea
                            value={selectedNode.data.system_prompt || ''}
                            onChange={(e) => handleChange('system_prompt', e.target.value)}
                            placeholder="You are a helpful AI assistant..."
                            className="h-24 font-mono text-xs"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Enabled Tools</Label>
                        <div className="grid grid-cols-2 gap-2 bg-muted/20 p-2 rounded-md border">
                            {availableTools.map((tool) => {
                                const isSelected = (selectedNode.data.tools || []).includes(tool.name);
                                return (
                                    <div
                                        key={tool.name}
                                        className={`flex items-center gap-2 p-2 rounded cursor-pointer border text-xs transition-colors ${isSelected ? 'bg-primary/10 border-primary' : 'bg-card border-transparent hover:border-border'}`}
                                        onClick={() => {
                                            const currentTools = selectedNode.data.tools || [];
                                            const newTools = isSelected
                                                ? currentTools.filter((t: string) => t !== tool.name)
                                                : [...currentTools, tool.name];
                                            handleChange('tools', newTools);
                                        }}
                                    >
                                        <div className={`w-3 h-3 rounded-full border ${isSelected ? 'bg-primary border-primary' : 'border-muted-foreground'}`} />
                                        <span>{tool.name}</span>
                                    </div>
                                );
                            })}
                            {availableTools.length === 0 && (
                                <div className="col-span-2 text-center text-xs text-muted-foreground py-2">Loading tools...</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="text-xs text-muted-foreground mt-4">
                Node ID: {selectedNode.id}
            </div>

            <Button
                variant="destructive"
                className="w-full mt-4 gap-2"
                onClick={() => {
                    setNodes(nodes.filter(n => n.id !== selectedNode.id));
                    onClose();
                }}
            >
                <Trash2 className="h-4 w-4" />
                Delete Node
            </Button>
        </div >
    );
}
