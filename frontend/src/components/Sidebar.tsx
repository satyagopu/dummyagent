import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

interface SidebarProps {
    selectedNode: any;
    setNodes: (nodes: any[]) => void;
    nodes: any[];
    onClose: () => void;
}

export function Sidebar({ selectedNode, setNodes, nodes, onClose }: SidebarProps) {
    if (!selectedNode) return null;

    const handleChange = (key: string, value: any) => {
        setNodes(nodes.map(node => {
            if (node.id === selectedNode.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        [key]: value
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

            <div className="text-xs text-muted-foreground mt-8">
                Node ID: {selectedNode.id}
            </div>
        </div>
    );
}
