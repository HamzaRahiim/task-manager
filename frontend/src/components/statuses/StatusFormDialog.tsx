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
import { useCreateStatus, useUpdateStatus } from "@/hooks/useStatuses";

interface Status {
    _id?: string;  // MongoDB ID from API
    id?: string;   // Fallback ID
    name: string;
    color: string;
}

interface StatusFormDialogProps {
    open: boolean;
    onClose: () => void;
    status?: Status | null;
    initialName?: string;
    onSaved?: (name: string) => void;
}

export default function StatusFormDialog({
    open,
    onClose,
    status,
    initialName,
    onSaved,
}: StatusFormDialogProps) {
    const createMutation = useCreateStatus();
    const updateMutation = useUpdateStatus();
    const isEdit = Boolean(status);
    const isPending = createMutation.isPending || updateMutation.isPending;

    const [name, setName] = useState("");
    const [color, setColor] = useState("#6B7280");

    useEffect(() => {
        if (!open) return;
        setName(status?.name || initialName || "");
        setColor(status?.color || "#6B7280");
    }, [status, open, initialName]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!name.trim()) return;

        const payload = { name: name.trim(), color };
        const result = isEdit
            ? await updateMutation.mutateAsync({ id: status!._id || status!.id || "", data: payload })
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
                    <DialogTitle>{isEdit ? "Edit Status" : "New Status"}</DialogTitle>
                    <DialogDescription>
                        Define a label and color for task statuses.
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter status name"
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
