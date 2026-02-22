import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { tasksApi } from "../api/tasks.api";

interface TaskParams {
  [key: string]: any;
}

interface TaskData {
  [key: string]: any;
}

interface UpdateTaskParams {
  id: string;
  data: TaskData;
}

export const TASKS_KEY = "tasks";

const normalizeTasksList = (res: any): any[] => {
  let items: any[] = [];
  if (Array.isArray(res?.data)) items = res.data;
  else if (Array.isArray(res)) items = res;
  else return [];

  // Map MongoDB _id to id for frontend consistency
  return items.map((item: any) => ({
    ...item,
    id: item._id || item.id,
  }));
};

interface GetAllResponse {
  data: any[];
  pagination?: any;
}

const normalizeGetAllResponse = (res: GetAllResponse) => ({
  ...res,
  data: normalizeTasksList({ data: res.data }),
});

export const useTasks = (params?: TaskParams) =>
  useQuery({
    queryKey: [TASKS_KEY, params],
    queryFn: () => tasksApi.getAll(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
    select: normalizeGetAllResponse,
  });

export const useCreateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskData) => tasksApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TASKS_KEY] });
      toast.success("Task created successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateTaskParams) => tasksApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TASKS_KEY] });
      toast.success("Task updated successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};

export const useDeleteTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      if (!id || id === "undefined") {
        throw new Error("Invalid task ID");
      }
      return tasksApi.remove(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TASKS_KEY] });
      toast.success("Task deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};
