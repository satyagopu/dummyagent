import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const LLMNode = ({ data, isConnectable }: any) => {
    return (
        <Card className="w-80 shadow-lg border-primary/20 bg-card/95 backdrop-blur-sm">
            <CardHeader className="p-3 border-b flex flex-row items-center gap-2 space-y-0">
                <div className="p-1.5 rounded-md bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-sm font-semibold">LLM Processor</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
                {/* Inputs Handle */}
                <Handle
                    type="target"
                    position={Position.Top}
                    isConnectable={isConnectable}
                    className="w-3 h-3 bg-primary border-2 border-background"
                />

                {/* Model Selection */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Model</label>
                    <select
                        className="w-full px-2 py-1 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                        defaultValue={data.model || 'gemini-pro'}
                        onChange={(e) => data.onChange?.('model', e.target.value)}
                    >
                        <option value="gemini-pro">Google Gemini Pro</option>
                        <option value="gpt-4">OpenAI GPT-4</option>
                        <option value="gpt-3.5-turbo">OpenAI GPT-3.5</option>
                        <option value="claude-3-sonnet">AWS Claude 3 Sonnet</option>
                    </select>
                </div>

                {/* System Prompt */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">System Prompt</label>
                    <textarea
                        className="w-full h-20 px-2 py-1 text-xs rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="You are a helpful AI assistant..."
                        defaultValue={data.system_prompt || ''}
                        onChange={(e) => data.onChange?.('system_prompt', e.target.value)}
                    />
                </div>

                {/* Temperature */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-medium text-muted-foreground">Temperature</label>
                        <span className="text-[10px] text-muted-foreground">{data.temperature || 0.7}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                        defaultValue={data.temperature || 0.7}
                        onChange={(e) => data.onChange?.('temperature', parseFloat(e.target.value))}
                    />
                </div>

                {/* Outputs Handle */}
                <Handle
                    type="source"
                    position={Position.Bottom}
                    isConnectable={isConnectable}
                    className="w-3 h-3 bg-primary border-2 border-background"
                />
            </CardContent>
        </Card>
    );
};

export default memo(LLMNode);
