import api from "./axios";

export const statusesApi = {
    getAll: () => api.get("/statuses"),
    checkName: (name) => api.get("/statuses/check", { params: { name } }),
    create: (data) => api.post("/statuses", data),
    update: (id, data) => api.patch(`/statuses/${id}`, data),
    remove: (id) => api.delete(`/statuses/${id}`),
};