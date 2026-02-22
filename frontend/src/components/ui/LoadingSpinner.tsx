import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
    text?: string;
}

export default function LoadingSpinner({ text = "Loading..." }: LoadingSpinnerProps) {
    return (
        <div className="flex min-h-[200px] items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">{text}</span>
        </div>
    );
}
