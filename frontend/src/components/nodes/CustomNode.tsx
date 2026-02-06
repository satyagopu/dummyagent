import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Settings2 } from 'lucide-react';
const CustomNode = ({ data, selected }: any) => {
    const inputs = data.inputs || [];
    const outputs = data.outputs || [];

    return (
        <Card className={`w-64 shadow-md border-2 transition-all ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'} bg-card/95 backdrop-blur-sm`}>
            <CardHeader className="p-3 flex flex-row items-center gap-2 space-y-0 text-xs uppercase text-muted-foreground border-b bg-muted/20">
                <Settings2 className="h-3 w-3" />
                <CardTitle className="text-xs font-semibold">Custom Node</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="flex justify-between">
                    {/* Inputs Column */}
                    <div className="flex flex-col py-3 gap-3">
                        {inputs.map((input: any, index: number) => (
                            <div key={index} className="relative pl-3 pr-2 flex items-center h-4">
                                <span className="text-xs font-medium">{input.name}</span>
                                <Handle
                                    type="target"
                                    position={Position.Left}
                                    id={`in-${input.name}`}
                                    className="!bg-blue-500 !w-2.5 !h-2.5 !-ml-1.5"
                                    style={{ top: 'auto' }}
                                />
                            </div>
                        ))}
                        {inputs.length === 0 && <span className="text-[10px] text-muted-foreground px-3 italic">No inputs</span>}
                    </div>

                    {/* Outputs Column */}
                    <div className="flex flex-col py-3 gap-3 items-end">
                        {outputs.map((output: any, index: number) => (
                            <div key={index} className="relative pr-3 pl-2 flex items-center h-4 justify-end">
                                <span className="text-xs font-medium">{output.name}</span>
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={`out-${output.name}`}
                                    className="!bg-purple-500 !w-2.5 !h-2.5 !-mr-1.5"
                                    style={{ top: 'auto' }}
                                />
                            </div>
                        ))}
                        {outputs.length === 0 && <span className="text-[10px] text-muted-foreground px-3 italic">No outputs</span>}
                    </div>
                </div>

                {data.description && (
                    <div className="px-3 pb-3 pt-1 text-[10px] text-muted-foreground border-t bg-muted/10 mx-1">
                        {data.description}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default memo(CustomNode);
