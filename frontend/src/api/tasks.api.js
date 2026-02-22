import api from "./axios";

export const tasksApi = {
    getAll: (params) => api.get("/tasks", { params }),
    getById: (id) => api.get(`/tasks/${id}`),
    create: (data) => api.post("/tasks", data),
    update: (id, data) => api.patch(`/tasks/${id}`, data),
    remove: (id) => api.delete(`/tasks/${id}`),
};