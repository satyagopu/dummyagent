import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Terminal } from 'lucide-react';

const OutputNode = ({ data, selected }: any) => {
    return (
        <Card className={`w-64 shadow-md border-2 transition-all ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-accent/40'} bg-card/95 backdrop-blur-sm`}>
            <CardHeader className="p-3 flex flex-row items-center gap-2 space-y-0">
                <div className="p-1.5 rounded-md bg-green-500/10">
                    <Terminal className="h-4 w-4 text-green-500" />
                </div>
                <CardTitle className="text-sm font-medium leading-none">
                    Output
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
                <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md font-mono min-h-[40px]">
                    {data.output ? (
                        <span className="text-foreground">{data.output}</span>
                    ) : (
                        <span className="italic opacity-50">Waiting for result...</span>
                    )}
                </div>
            </CardContent>

            <Handle
                type="target"
                position={Position.Left}
                className="!bg-primary !w-3 !h-3 !border-4 !border-background"
            />
        </Card>
    );
};

export default memo(OutputNode);
