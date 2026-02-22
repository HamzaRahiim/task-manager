import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ColorPicker from "@/components/ui/ColorPicker";
import { useCreatePriority, useUpdatePriority } from "@/hooks/usePriorities";

interface Priority {
    _id?: string;  // MongoDB ID from API
    id?: string;   // Fallback ID
    name: string;
    color: string;
}

interface PriorityFormDialogProps {
    open: boolean;
    onClose: () => void;
    priority?: Priority | null;
    initialName?: string;
    onSaved?: (name: string) => void;
}

export default function PriorityFormDialog({
    open,
    onClose,
    priority,
    initialName,
    onSaved,
}: PriorityFormDialogProps) {
    const createMutation = useCreatePriority();
    const updateMutation = useUpdatePriority();
    const isEdit = Boolean(priority);
    const isPending = createMutation.isPending || updateMutation.isPending;

    const [name, setName] = useState("");
    const [color, setColor] = useState("#6B7280");

    useEffect(() => {
        if (!open) return;
        setName(priority?.name || initialName || "");
        setColor(priority?.color || "#6B7280");
    }, [priority, open, initialName]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!name.trim()) return;

        const payload = { name: name.trim(), color };
        const result = isEdit
            ? await updateMutation.mutateAsync({ id: priority!._id || priority!.id || "", data: payload })
            : await createMutation.mutateAsync(payload);

        const entity = result?.data || result;
        if (!isEdit && entity?.name) {
            onSaved?.(entity?.name);
        }
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(state) => !state && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Priority" : "New Priority"}</DialogTitle>
                    <DialogDescription>
                        Define a label and color for task priorities.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter priority name"
                            maxLength={50}
                            disabled={isPending}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Color</label>
                        <ColorPicker
                            value={color}
                            onChange={setColor}
                            disabled={isPending}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending || !name.trim()}>
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            {isEdit ? "Save Changes" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
