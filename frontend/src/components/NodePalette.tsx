import { Terminal, MousePointerClick, Settings2, Bot } from "lucide-react";

export const NodePalette = () => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="absolute top-4 left-4 z-10 bg-card border rounded-lg shadow-lg p-2 flex flex-col gap-2">
            <div className="text-xs font-semibold text-muted-foreground px-2 pb-1 border-b mb-1">
                Add Nodes
            </div>

            <div
                className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-grab active:cursor-grabbing border border-transparent hover:border-border"
                onDragStart={(event) => onDragStart(event, 'input')}
                draggable
            >
                <MousePointerClick className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Input Node</span>
            </div>

            <div
                className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-grab active:cursor-grabbing border border-transparent hover:border-border"
                onDragStart={(event) => onDragStart(event, 'llm')}
                draggable
            >
                <div className="h-4 w-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-purple-600">AI</span>
                </div>
                <span className="text-sm">LLM Node</span>
            </div>

            <div
                className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-grab active:cursor-grabbing border border-transparent hover:border-border"
                onDragStart={(event) => onDragStart(event, 'output')}
                draggable
            >
                <Terminal className="h-4 w-4 text-green-500" />
                <span className="text-sm">Output Node</span>
            </div>

            <div
                className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-grab active:cursor-grabbing border border-transparent hover:border-border"
                onDragStart={(event) => onDragStart(event, 'tool')}
                draggable
            >
                <div className="h-4 w-4 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-orange-600">Fn</span>
                </div>
                <span className="text-sm">Tool Node</span>
            </div>

            <div
                className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-grab active:cursor-grabbing border border-transparent hover:border-border"
                onDragStart={(event) => onDragStart(event, 'end')}
                draggable
            >
                <div className="h-4 w-4 rounded-full bg-destructive/10 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-sm bg-destructive" />
                </div>
                <span className="text-sm text-destructive">End Node</span>
            </div>

            <div
                className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-grab active:cursor-grabbing border border-transparent hover:border-border"
                onDragStart={(event) => onDragStart(event, 'agent')}
                draggable
            >
                <div className="h-4 w-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Bot className="h-3 w-3 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-purple-700">AI Agent</span>
            </div>

            <div
                className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-grab active:cursor-grabbing border border-transparent hover:border-border"
                onDragStart={(event) => onDragStart(event, 'custom')}
                draggable
            >
                <Settings2 className="h-4 w-4 text-pink-500" />
                <span className="text-sm">Custom Node</span>
            </div>
        </div>
    );
};
