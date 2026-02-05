import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';

const InputNode = ({ data, isConnectable }: any) => {
    return (
        <Card className="w-64 shadow-md border-accent/40 bg-card/95 backdrop-blur-sm">
            <CardHeader className="p-3 border-b flex flex-row items-center gap-2 space-y-0 text-accent-foreground">
                <div className="p-1.5 rounded-md bg-accent/10">
                    <PlayCircle className="h-4 w-4 text-green-500" />
                </div>
                <CardTitle className="text-sm font-semibold">Start Input</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Initial Value</label>
                    <input
                        type="text"
                        className="w-full px-2 py-1 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Enter starting text..."
                        defaultValue={data.value || ''}
                        onChange={(e) => data.onChange?.('value', e.target.value)}
                    />
                </div>

                <Handle
                    type="source"
                    position={Position.Bottom}
                    isConnectable={isConnectable}
                    className="w-3 h-3 bg-green-500 border-2 border-background"
                />
            </CardContent>
        </Card>
    );
};

export default memo(InputNode);
