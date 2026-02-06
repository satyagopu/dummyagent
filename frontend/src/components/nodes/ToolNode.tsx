import { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Wrench } from 'lucide-react';

const ToolNode = ({ data, selected }: any) => {
    // Local state for immediate UI feedback, though real state is in data
    const [tool, setTool] = useState(data.tool || 'Calculator');

    // In a real app, we'd fetch this from /api/workflows/tools
    const tools = [
        { name: 'Calculator', description: 'Evaluate math expressions' },
        { name: 'Wikipedia', description: 'Search Wikipedia' },
    ];

    const handleChange = (key: string, value: any) => {
        setTool(value);
        // We mutate data directly here for ReactFlow to pick it up, 
        // or we'd ideally use a callback passed in proper ReactFlow usage.
        // But for this simple implementation:
        data[key] = value;
    };

    return (
        <Card className={`w-64 shadow-md border-2 transition-all ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-accent/40'} bg-card/95 backdrop-blur-sm`}>
            <CardHeader className="p-3 flex flex-row items-center gap-2 space-y-0">
                <div className="p-1.5 rounded-md bg-orange-500/10">
                    <Wrench className="h-4 w-4 text-orange-500" />
                </div>
                <CardTitle className="text-sm font-medium leading-none">
                    Tool Execution
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-3">
                <div className="space-y-2">
                    <Label className="text-xs">Select Tool</Label>
                    <Select
                        value={tool}
                        onValueChange={(value) => handleChange('tool', value)}
                    >
                        <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select tool" />
                        </SelectTrigger>
                        <SelectContent>
                            {tools.map((t) => (
                                <SelectItem key={t.name} value={t.name}>
                                    {t.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Visual indicator of what happened */}
                {data.output && (
                    <div className="text-xs bg-muted p-2 rounded text-muted-foreground">
                        Output: {data.output}
                    </div>
                )}
            </CardContent>

            <Handle
                type="target"
                position={Position.Left}
                className="!bg-primary !w-3 !h-3 !border-4 !border-background"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-primary !w-3 !h-3 !border-4 !border-background"
            />
        </Card>
    );
};

export default memo(ToolNode);
