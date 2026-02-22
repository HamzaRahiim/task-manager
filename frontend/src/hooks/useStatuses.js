import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { statusesApi } from "../api/statuses.api";

export const STATUSES_KEY = "statuses";

const normalizeList = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    return [];
};

export const useStatuses = () =>
    useQuery({
        queryKey: [STATUSES_KEY],
        queryFn: statusesApi.getAll,
        staleTime: 60_000,
        select: normalizeList,
    });

export const useCreateStatus = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => statusesApi.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [STATUSES_KEY] });
            toast.success("Status created");
        },
        onError: (err) => toast.error(err.message),
    });
};

export const useUpdateStatus = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => statusesApi.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [STATUSES_KEY] });
            qc.invalidateQueries({ queryKey: ["tasks"] });
            toast.success("Status updated");
        },
        onError: (err) => toast.error(err.message),
    });
};

export const useDeleteStatus = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => statusesApi.remove(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: [STATUSES_KEY] });
            toast.success("Status deleted");
        },
        onError: (err) => toast.error(err.message),
    });
};