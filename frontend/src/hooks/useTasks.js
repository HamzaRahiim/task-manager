import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tasksApi } from "../api/tasks.api";

export const TASKS_KEY = "tasks";

export const useTasks = (params) =>
    useQuery({
        queryKey: [TASKS_KEY, params],
        queryFn: () => tasksApi.getAll(params),
        staleTime: 30_000,
        placeholderData: keepPreviousData,
    });

export const useCreateTask = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => tasksApi.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [TASKS_KEY] });
            toast.success("Task created successfully");
        },
        onError: (err) => toast.error(err.message),
    });
};

export const useUpdateTask = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => tasksApi.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [TASKS_KEY] });
            toast.success("Task updated successfully");
        },
        onError: (err) => toast.error(err.message),
    });
};

export const useDeleteTask = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => tasksApi.remove(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [TASKS_KEY] });
            toast.success("Task deleted");
        },
        onError: (err) => toast.error(err.message),
    });
};