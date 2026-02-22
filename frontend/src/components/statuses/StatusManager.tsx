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
import { useDeleteStatus, useStatuses } from "@/hooks/useStatuses";
import { getBadgeStyle } from "@/lib/utils";
import StatusFormDialog from "./StatusFormDialog";

interface Status {
    _id?: string;  // MongoDB ID from API
    id?: string;   // Fallback ID
    name: string;
    color: string;
    createdAt?: string;
}

interface StatusManagerProps {
    open: boolean;
    onClose: () => void;
    counts?: Record<string, number>;
    initialCreateName?: string;
    onCreated?: (name: string) => void;
}

export default function StatusManager({
    open,
    onClose,
    counts = {},
    initialCreateName,
    onCreated,
}: StatusManagerProps) {
    const { data: statuses = [], isLoading } = useStatuses();
    const deleteMutation = useDeleteStatus();
    const [formOpen, setFormOpen] = useState(false);
    const [editingStatus, setEditingStatus] = useState<Status | null>(null);

    const list = useMemo(() => {
        const items = [...statuses];
        return items.sort(
            (a, b) =>
                new Date(b.createdAt || 0).getTime() -
                new Date(a.createdAt || 0).getTime(),
        );
    }, [statuses]);

    const openCreate = () => {
        setEditingStatus(null);
        setFormOpen(true);
    };

    const openEdit = (status: Status) => {
        setEditingStatus(status);
        setFormOpen(true);
    };

    const handleDelete = async (statusId: string) => {
        try {
            if (!statusId || statusId === "undefined") {
                toast.error("Error: Status ID is missing");
                return;
            }
            await deleteMutation.mutateAsync(statusId);
        } catch (error) {
            toast.error((error as Error).message);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={(state) => !state && onClose()}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Manage Statuses</DialogTitle>
                        <DialogDescription>
                            Create and manage task statuses
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end">
                        <Button onClick={openCreate}>
                            <Plus className="h-4 w-4" />
                            Add Status
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
                            <EmptyState title="No statuses yet" />
                        ) : null}

                        {!isLoading
                            ? list.map((status) => (
                                <div
                                    key={status.id || status.name}
                                    className="flex items-center gap-2 rounded-md border p-2"
                                >
                                    <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{ backgroundColor: status.color }}
                                    />
                                    <span className="flex-1 text-sm font-medium">
                                        {status.name}
                                    </span>
                                    <Badge
                                        variant="outline"
                                        style={getBadgeStyle(status.color)}
                                    >
                                        {counts[status.name] ?? 0}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openEdit(status)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={deleteMutation.isPending}
                                        onClick={() => handleDelete(status._id || status.id || "")}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))
                            : null}
                    </div>
                </DialogContent>
            </Dialog>

            <StatusFormDialog
                open={formOpen || Boolean(initialCreateName)}
                onClose={() => {
                    setFormOpen(false);
                    onClose?.();
                }}
                status={editingStatus}
                initialName={!editingStatus ? initialCreateName : undefined}
                onSaved={onCreated}
            />
        </>
    );
}
