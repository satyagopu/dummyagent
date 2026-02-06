import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';

const InputNode = ({ data, selected }: any) => {
    return (
        <Card className={`w-48 shadow-md border-2 transition-all ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-accent/40'} bg-card/95 backdrop-blur-sm`}>
            <CardHeader className="p-3 flex flex-row items-center gap-2 space-y-0">
                <div className="p-1.5 rounded-md bg-accent/10">
                    <PlayCircle className="h-4 w-4 text-green-500" />
                </div>
                <div>
                    <CardTitle className="text-sm font-semibold">Start Input</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
                <div className="text-xs text-muted-foreground truncate">
                    {data.value ? `"${data.value}"` : "Click to configure"}
                </div>
            </CardContent>

            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-green-500 border-2 border-background"
            />
        </Card>
    );
};

export default memo(InputNode);
