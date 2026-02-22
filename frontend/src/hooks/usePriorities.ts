import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { prioritiesApi } from "../api/priorities.api";

interface PriorityData {
  name: string;
  color: string;
}

interface UpdatePriorityParams {
  id: string;
  data: PriorityData;
}

export const PRIORITIES_KEY = "priorities";

const normalizeList = (res: any): any[] => {
  let items: any[] = [];
  if (Array.isArray(res)) items = res;
  else if (Array.isArray(res?.data)) items = res.data;
  else return [];

  // Map MongoDB _id to id for frontend consistency
  return items.map((item: any) => ({
    ...item,
    id: item._id || item.id,
  }));
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
    mutationFn: (data: PriorityData) => prioritiesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PRIORITIES_KEY] });
      toast.success("Priority created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useUpdatePriority = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdatePriorityParams) =>
      prioritiesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PRIORITIES_KEY] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Priority updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useDeletePriority = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!id || id === "undefined") {
        throw new Error("Invalid priority ID");
      }
      return prioritiesApi.remove(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PRIORITIES_KEY] });
      toast.success("Priority deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};
