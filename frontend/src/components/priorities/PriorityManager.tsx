import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { useDeletePriority, usePriorities } from "@/hooks/usePriorities";
import { getBadgeStyle } from "@/lib/utils";
import PriorityFormDialog from "./PriorityFormDialog";

interface Priority {
    _id?: string;  // MongoDB ID from API
    id?: string;   // Fallback ID
    name: string;
    color: string;
    createdAt?: string;
}

interface PriorityManagerProps {
    open: boolean;
    onClose: () => void;
    counts?: Record<string, number>;
    initialCreateName?: string;
    onCreated?: (name: string) => void;
}

export default function PriorityManager({
    open,
    onClose,
    counts = {},
    initialCreateName,
    onCreated,
}: PriorityManagerProps) {
    const { data: priorities = [], isLoading } = usePriorities();
    const deleteMutation = useDeletePriority();
    const [formOpen, setFormOpen] = useState(false);
    const [editingPriority, setEditingPriority] = useState<Priority | null>(null);

    const list = useMemo(() => {
        const items = [...priorities];
        return items.sort(
            (a, b) =>
                new Date(b.createdAt || 0).getTime() -
                new Date(a.createdAt || 0).getTime(),
        );
    }, [priorities]);

    const openCreate = () => {
        setEditingPriority(null);
        setFormOpen(true);
    };

    const openEdit = (priority: Priority) => {
        setEditingPriority(priority);
        setFormOpen(true);
    };

    const handleDelete = async (priorityId: string) => {
        try {
            if (!priorityId || priorityId === "undefined") {
                toast.error("Error: Priority ID is missing");
                return;
            }
            await deleteMutation.mutateAsync(priorityId);
        } catch (error) {
            toast.error((error as Error).message);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={(state) => !state && onClose()}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Manage Priorities</DialogTitle>
                        <DialogDescription>
                            Create and manage task priorities
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end">
                        <Button onClick={openCreate}>
                            <Plus className="h-4 w-4" />
                            Add Priority
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {isLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : null}

                        {!isLoading && list.length === 0 ? (
                            <EmptyState title="No priorities yet" />
                        ) : null}

                        {!isLoading
                            ? list.map((priority) => (
                                <div
                                    key={priority.id || priority.name}
                                    className="flex items-center gap-2 rounded-md border p-2"
                                >
                                    <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{ backgroundColor: priority.color }}
                                    />
                                    <span className="flex-1 text-sm font-medium">
                                        {priority.name}
                                    </span>
                                    <Badge
                                        variant="outline"
                                        style={getBadgeStyle(priority.color)}
                                    >
                                        {counts[priority.name] ?? 0}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openEdit(priority)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={deleteMutation.isPending}
                                        onClick={() => handleDelete(priority._id || priority.id || "")}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))
                            : null}
                    </div>
                </DialogContent>
            </Dialog>

            <PriorityFormDialog
                open={formOpen || Boolean(initialCreateName)}
                onClose={() => {
                    setFormOpen(false);
                    onClose?.();
                }}
                priority={editingPriority}
                initialName={!editingPriority ? initialCreateName : undefined}
                onSaved={onCreated}
            />
        </>
    );
}
