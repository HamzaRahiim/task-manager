
import { format } from "date-fns";
import { AlertCircle, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import StatusBadge from "@/components/ui/StatusBadge";
import PriorityBadge from "@/components/ui/PriorityBadge";
import EmptyState from "@/components/ui/EmptyState";

interface Task {
    _id?: string;  // MongoDB ID from API
    id?: string;   // Fallback ID
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate?: string;
    createdAt?: string;
}

interface Status {
    name: string;
    color: string;
}

interface TaskTableProps {
    tasks: Task[];
    statuses: Status[];
    priorities: Status[];
    isLoading: boolean;
    isFetching: boolean;
    pagination: { page?: number; limit?: number; total?: number };
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    onPageChange: (page: number) => void;
    hasFilters: boolean;
    isMutating: boolean;
    rowsPerPage: number | "all";
    onRowsPerPageChange: (rows: number | "all") => void;
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

export default function TaskTable({
    tasks,
    statuses,
    priorities,
    isLoading,
    isFetching,
    pagination,
    onEdit,
    onDelete,
    onPageChange,
    hasFilters,
    isMutating,
    rowsPerPage,
    onRowsPerPageChange,
}: TaskTableProps) {
    const { page = 1, total = 0 } = pagination;
    const rowsPerPageNum = rowsPerPage === "all" ? total : rowsPerPage;
    const start = (page - 1) * rowsPerPageNum + 1;
    const end = Math.min(page * rowsPerPageNum, total);
    const totalPages = rowsPerPage === "all" ? 1 : Math.ceil(total / rowsPerPageNum);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="rounded-md border">
                    <div className="space-y-3 p-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <EmptyState
                title={hasFilters ? "No tasks match your search" : "No tasks yet"}
                description={hasFilters ? "Try adjusting your filters" : "Create your first task to get started"}
            />
        );
    }

    return (
        <div className="space-y-4">
            {isFetching && (
                <div className="h-0.5 w-full bg-gradient-to-r from-primary to-primary/0 animate-pulse" />
            )}

            <div className="rounded-md border overflow-x-auto w-full">
                <table className="w-full text-sm" style={{ minWidth: "100%" }}>
                    <thead className="bg-muted sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium w-12 whitespace-nowrap">S. No</th>
                            <th className="px-4 py-3 text-left font-medium">Title</th>
                            <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Status</th>
                            <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Priority</th>
                            <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Due Date</th>
                            <th className="px-4 py-3 text-right font-medium whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task, index) => {
                            const status = statuses.find((s) => s.name === task.status);
                            const priority = priorities.find((p) => p.name === task.priority);
                            const dueDate = task.dueDate ? new Date(task.dueDate) : null;
                            const isOverdue = dueDate ? dueDate < new Date() : false;
                            const serialNumber = start + index;

                            return (
                                <tr key={task.id} className="border-t hover:bg-muted/50">
                                    <td className="px-4 py-3 text-xs text-muted-foreground font-medium">{serialNumber}</td>
                                    <td className="px-4 py-3">
                                        <div className="max-w-xs">
                                            <p className="font-medium truncate">{task.title}</p>
                                            {task.description && (
                                                <p className="text-xs text-muted-foreground truncate">{task.description}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge name={task.status} color={status?.color} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <PriorityBadge name={task.priority} color={priority?.color} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div
                                            className={isOverdue ? "flex items-center gap-1 text-xs text-destructive" : "text-xs text-muted-foreground"}
                                        >
                                            {isOverdue ? <AlertCircle className="h-3 w-3" /> : null}
                                            {dueDate ? format(dueDate, "MMM d, yyyy") : "-"}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={isMutating}
                                            onClick={() => onEdit(task)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={isMutating}
                                            onClick={() => onDelete(task)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="border-t pt-4">
                <div className="space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Rows per page:</span>
                            <Select value={rowsPerPage === "all" ? "__all__" : String(rowsPerPage)} onValueChange={(value) => onRowsPerPageChange(value === "__all__" ? "all" : Number(value))}>
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROWS_PER_PAGE_OPTIONS.map((option) => (
                                        <SelectItem key={option} value={String(option)}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="__all__">All</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <span className="text-sm text-muted-foreground text-center md:text-right">
                        Showing {start}–{end} of {total} tasks
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 md:justify-end">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={page === 1 || isFetching}
                        onClick={() => onPageChange(page - 1)}
                        className="w-full sm:w-auto"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <span className="flex items-center justify-center px-2 text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={page >= totalPages || isFetching}
                        onClick={() => onPageChange(page + 1)}
                        className="w-full sm:w-auto"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
