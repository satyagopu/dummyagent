import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CircleStop } from 'lucide-react';

const EndNode = ({ selected }: any) => {
    return (
        <Card className={`w-40 shadow-md border-2 transition-all ${selected ? 'border-destructive ring-2 ring-destructive/20' : 'border-destructive/40'} bg-card/95 backdrop-blur-sm`}>
            <CardHeader className="p-3 flex flex-row items-center justify-center gap-2 space-y-0">
                <div className="p-1.5 rounded-md bg-destructive/10">
                    <CircleStop className="h-4 w-4 text-destructive" />
                </div>
                <CardTitle className="text-sm font-medium leading-none text-destructive">
                    End
                </CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-0 text-center">
                <span className="text-[10px] text-muted-foreground">Workflow Finishes</span>
            </CardContent>

            <Handle
                type="target"
                position={Position.Left}
                className="!bg-destructive !w-3 !h-3 !border-4 !border-background"
            />
        </Card>
    );
};

export default memo(EndNode);
