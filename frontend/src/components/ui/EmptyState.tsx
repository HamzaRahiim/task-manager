import { Inbox } from "lucide-react";

interface EmptyStateProps {
    title: string;
    description?: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
    return (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <Inbox className="mb-3 h-8 w-8 text-muted-foreground" />
            <h3 className="text-base font-semibold">{title}</h3>
            {description ? (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
        </div>
    );
}
