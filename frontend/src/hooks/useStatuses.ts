import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { statusesApi } from "../api/statuses.api";

interface StatusData {
  name: string;
  color: string;
}

interface UpdateStatusParams {
  id: string;
  data: StatusData;
}

export const STATUSES_KEY = "statuses";

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
    mutationFn: (data: StatusData) => statusesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [STATUSES_KEY] });
      toast.success("Status created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useUpdateStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateStatusParams) =>
      statusesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [STATUSES_KEY] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Status updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useDeleteStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!id || id === "undefined") {
        throw new Error("Invalid status ID");
      }
      return statusesApi.remove(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [STATUSES_KEY] });
      toast.success("Status deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};
