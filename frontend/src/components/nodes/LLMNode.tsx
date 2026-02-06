import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const LLMNode = ({ data, selected }: any) => {
    return (
        <Card className={`w-64 shadow-lg border-2 transition-all ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-primary/20'} bg-card/95 backdrop-blur-sm`}>
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 bg-primary border-2 border-background"
            />

            <CardHeader className="p-3 flex flex-row items-center gap-2 space-y-0">
                <div className="p-1.5 rounded-md bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <CardTitle className="text-sm font-semibold">LLM Processor</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-1">
                <div className="text-xs font-medium text-foreground">
                    {data.model || 'gemini-pro'}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                    Temp: {data.temperature || 0.7}
                </div>
            </CardContent>

            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-primary border-2 border-background"
            />
        </Card>
    );
};

export default memo(LLMNode);
