import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import TaskStats from "@/components/tasks/TaskStats";
import TaskFilters from "@/components/tasks/TaskFilters";
import TaskTable from "@/components/tasks/TaskTable";
import TaskFormSheet from "@/components/tasks/TaskFormSheet";
import TaskDeleteDialog from "@/components/tasks/TaskDeleteDialog";
import { useStatuses } from "@/hooks/useStatuses";
import { usePriorities } from "@/hooks/usePriorities";
import { useTasks, useDeleteTask } from "@/hooks/useTasks";

interface OutletCtx {
    selectedStatus: string | null;
    setSelectedStatus: (status: string | null) => void;
}

export default function Dashboard() {
    const { selectedStatus, setSelectedStatus } = useOutletContext<OutletCtx>();
    const { data: statuses = [] } = useStatuses();
    const { data: priorities = [] } = usePriorities();
    const deleteMutation = useDeleteTask();

    // Form & filter state
    const [search, setSearch] = useState("");
    const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState<number | "all">(5);
    const limit = rowsPerPage === "all" ? 1000 : rowsPerPage;

    // Sheet & dialog state
    const [formSheetOpen, setFormSheetOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<any>(null);
    const [deletingTask, setDeletingTask] = useState<any>(null);

    // Build query params
    const queryParams = useMemo(
        () => ({
            page,
            limit,
            search: search.trim(),
            status: selectedStatus,
            priority: selectedPriority,
            sortBy: "createdAt",
            sortOrder: "desc",
        }),
        [page, limit, search, selectedStatus, selectedPriority],
    );

    const { data: tasksResponse, isLoading, isFetching } = useTasks(queryParams);
    const tasks = (tasksResponse as any)?.data ?? [];
    const pagination = (tasksResponse as any)?.pagination ?? {};

    // Filters active check
    const hasActiveFilters = Boolean(search || selectedStatus || selectedPriority);

    // Handlers
    const handleFilterChange = () => {
        setPage(1); // Reset to page 1 on filter change
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        handleFilterChange();
    };

    const handleStatusChange = (status: string | null) => {
        setSelectedStatus(status);
        handleFilterChange();
    };

    const handlePriorityChange = (priority: string | null) => {
        setSelectedPriority(priority);
        handleFilterChange();
    };

    const handleClearFilters = () => {
        setSearch("");
        setSelectedStatus(null);
        setSelectedPriority(null);
        setPage(1);
    };

    const handleRowsPerPageChange = (rows: number | "all") => {
        setRowsPerPage(rows);
        setPage(1); // Reset to page 1 when rows per page changes
    };

    const handleEditTask = (task: any) => {
        setEditingTask(task);
        setFormSheetOpen(true);
    };

    const handleDeleteTask = (task: any) => {
        setDeletingTask(task);
    };

    const handleConfirmDelete = async () => {
        if (!deletingTask) return;
        try {
            // Use _id from MongoDB or id fallback
            const taskId = deletingTask._id || deletingTask.id;
            if (!taskId) {
                toast.error("Error: Task ID is missing");
                return;
            }
            await deleteMutation.mutateAsync(taskId);
        } finally {
            setDeletingTask(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                    <p className="text-muted-foreground">Manage and track your team's work</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingTask(null);
                        setFormSheetOpen(true);
                    }}
                    className="w-full sm:w-auto"
                >
                    <Plus className="h-4 w-4" />
                    New Task
                </Button>
            </div>

            {/* Stats */}
            <TaskStats statuses={statuses} onStatusClick={handleStatusChange} />

            {/* Filters */}
            <TaskFilters
                search={search}
                onSearchChange={handleSearch}
                selectedStatus={selectedStatus}
                onStatusChange={handleStatusChange}
                selectedPriority={selectedPriority}
                onPriorityChange={handlePriorityChange}
                statuses={statuses}
                priorities={priorities}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={handleClearFilters}
            />

            {/* Task Table */}
            <TaskTable
                tasks={tasks}
                statuses={statuses}
                priorities={priorities}
                isLoading={isLoading}
                isFetching={isFetching}
                pagination={pagination}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onPageChange={setPage}
                hasFilters={hasActiveFilters}
                isMutating={deleteMutation.isPending}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
            />

            {/* Modals */}
            <TaskFormSheet
                open={formSheetOpen}
                onClose={() => setFormSheetOpen(false)}
                task={editingTask}
                statuses={statuses}
                priorities={priorities}
            />

            <TaskDeleteDialog
                open={Boolean(deletingTask)}
                onClose={() => setDeletingTask(null)}
                title={deletingTask?.title}
                onConfirm={handleConfirmDelete}
                isPending={deleteMutation.isPending}
            />
        </div>
    );
}
