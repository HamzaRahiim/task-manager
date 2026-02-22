import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { prioritiesApi } from "../api/priorities.api";

export const PRIORITIES_KEY = "priorities";

const normalizeList = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    return [];
};

export const usePriorities = () =>
    useQuery({
        queryKey: [PRIORITIES_KEY],
        queryFn: prioritiesApi.getAll,
        staleTime: 60_000,
        select: normalizeList,
    });

export const useCreatePriority = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => prioritiesApi.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [PRIORITIES_KEY] });
            toast.success("Priority created");
        },
        onError: (err) => toast.error(err.message),
    });
};

export const useUpdatePriority = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => prioritiesApi.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [PRIORITIES_KEY] });
            qc.invalidateQueries({ queryKey: ["tasks"] });
            toast.success("Priority updated");
        },
        onError: (err) => toast.error(err.message),
    });
};

export const useDeletePriority = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => prioritiesApi.remove(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [PRIORITIES_KEY] });
            toast.success("Priority deleted");
        },
        onError: (err) => toast.error(err.message),
    });
};