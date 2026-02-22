import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ComboboxCreatable from "@/components/ui/ComboboxCreatable";
import DatePicker from "@/components/ui/DatePicker";
import StatusFormDialog from "@/components/statuses/StatusFormDialog";
import PriorityFormDialog from "@/components/priorities/PriorityFormDialog";
import { useCreateTask, useUpdateTask } from "@/hooks/useTasks";

interface Task {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate?: string;
}

interface Status {
    name: string;
    color: string;
}

interface TaskFormSheetProps {
    open: boolean;
    onClose: () => void;
    task?: Task | null;
    statuses: Status[];
    priorities: Status[];
    onCreatedStatus?: () => void;
    onCreatedPriority?: () => void;
}

export default function TaskFormSheet({
    open,
    onClose,
    task,
    statuses,
    priorities,
    onCreatedStatus,
    onCreatedPriority,
}: TaskFormSheetProps) {
    const createTaskMutation = useCreateTask();
    const updateTaskMutation = useUpdateTask();
    const isMutating = createTaskMutation.isPending || updateTaskMutation.isPending;
    const isEdit = Boolean(task);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedPriority, setSelectedPriority] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [statusFormOpen, setStatusFormOpen] = useState(false);
    const [priorityFormOpen, setPriorityFormOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        if (isEdit && task) {
            setTitle(task.title || "");
            setDescription(task.description || "");
            setSelectedStatus(task.status || "");
            setSelectedPriority(task.priority || "");
            setDueDate(task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "");
        } else {
            setTitle("");
            setDescription("");
            setSelectedStatus("");
            setSelectedPriority("");
            setDueDate("");
        }
    }, [task, open, isEdit]);

    const handleStatusCreate = (name: string) => {
        setStatusFormOpen(false);
        setSelectedStatus(name);
        onCreatedStatus?.();
    };

    const handlePriorityCreate = (name: string) => {
        setPriorityFormOpen(false);
        setSelectedPriority(name);
        onCreatedPriority?.();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!title.trim() || !selectedStatus || !selectedPriority) return;

        const payload = {
            title: title.trim(),
            description: description.trim(),
            status: selectedStatus,
            priority: selectedPriority,
            dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        };

        try {
            if (isEdit && task) {
                await updateTaskMutation.mutateAsync({ id: task.id, data: payload });
            } else {
                await createTaskMutation.mutateAsync(payload);
            }
            onClose();
        } catch (error) {
            // Error is handled by the hook's onError toast
        }
    };

    return (
        <>
            <Sheet open={open} onOpenChange={(state: boolean) => !state && onClose()}>
                <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>{isEdit ? "Edit Task" : "Create Task"}</SheetTitle>
                        <SheetDescription>
                            Add or update task details to keep your team aligned.
                        </SheetDescription>
                    </SheetHeader>

                    <form className="space-y-4 px-6 py-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">
                                Title *
                            </label>
                            <div className="flex items-center">
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Task title"
                                    maxLength={100}
                                    disabled={isMutating}
                                    required
                                    className="flex-1"
                                />
                                <span className="ml-2 text-xs text-muted-foreground whitespace-nowrap">
                                    {title.length}/100
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">
                                Description
                            </label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Task description"
                                rows={4}
                                disabled={isMutating}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status *</label>
                            <ComboboxCreatable
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                                options={statuses}
                                onCreateNew={() => {
                                    setStatusFormOpen(true);
                                }}
                                placeholder="Select status"
                                disabled={isMutating}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Priority *</label>
                            <ComboboxCreatable
                                value={selectedPriority}
                                onChange={setSelectedPriority}
                                options={priorities}
                                onCreateNew={() => {
                                    setPriorityFormOpen(true);
                                }}
                                placeholder="Select priority"
                                disabled={isMutating}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="dueDate" className="text-sm font-medium">
                                Due Date
                            </label>
                            <DatePicker
                                value={dueDate}
                                onChange={setDueDate}
                                disabled={isMutating}
                                placeholder="Pick a date"
                            />
                        </div>

                        <SheetFooter className="px-6 pt-6">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isMutating}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isMutating || !title.trim() || !selectedStatus || !selectedPriority}
                            >
                                {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                {isEdit ? "Save Changes" : "Create Task"}
                            </Button>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            <StatusFormDialog
                open={statusFormOpen}
                onClose={() => setStatusFormOpen(false)}
                onSaved={handleStatusCreate}
            />
            <PriorityFormDialog
                open={priorityFormOpen}
                onClose={() => setPriorityFormOpen(false)}
                onSaved={handlePriorityCreate}
            />
        </>
    );
}
