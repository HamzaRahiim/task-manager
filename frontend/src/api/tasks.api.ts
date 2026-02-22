import api from "./axios";

interface TaskParams {
  [key: string]: any;
}

interface TaskData {
  [key: string]: any;
}

export const tasksApi = {
  getAll: (params?: TaskParams) => api.get("/tasks", { params }),
  getById: (id: string) => api.get(`/tasks/${id}`),
  create: (data: TaskData) => api.post("/tasks", data),
  update: (id: string, data: TaskData) => api.patch(`/tasks/${id}`, data),
  remove: (id: string) => api.delete(`/tasks/${id}`),
};
