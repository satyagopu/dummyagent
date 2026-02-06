import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Bot, BrainCircuit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AgentNode = ({ data, selected }: any) => {
    return (
        <Card className={`w-64 shadow-xl border-2 transition-all ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-purple-500/50'} bg-card/95 backdrop-blur-sm`}>
            <CardHeader className="p-3 flex flex-row items-center gap-2 space-y-0 bg-purple-500/10 border-b border-purple-500/20">
                <div className="p-2 rounded-full bg-purple-500/20">
                    <Bot className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                    <CardTitle className="text-sm font-bold text-purple-700">AI Agent</CardTitle>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <BrainCircuit className="h-3 w-3" />
                        {data.model || 'gemini-pro'}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
                <div className="text-xs text-muted-foreground line-clamp-2 italic">
                    {data.system_prompt || "I am an autonomous agent..."}
                </div>

                {data.tools && data.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {data.tools.map((tool: string) => (
                            <Badge key={tool} variant="secondary" className="text-[10px] px-1 py-0 h-4 bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200">
                                {tool}
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="mt-2 pt-2 border-t border-border/50 text-[10px] text-center text-muted-foreground">
                    ReAct Loop Enabled
                </div>
            </CardContent>

            <Handle
                type="target"
                position={Position.Left}
                className="!bg-purple-500 !w-3 !h-3 !border-4 !border-background"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="!bg-purple-500 !w-3 !h-3 !border-4 !border-background"
            />
        </Card>
    );
};

export default memo(AgentNode);
