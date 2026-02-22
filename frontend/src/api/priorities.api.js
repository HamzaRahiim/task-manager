import api from "./axios";

export const prioritiesApi = {
    getAll: () => api.get("/priorities"),
    checkName: (name) => api.get("/priorities/check", { params: { name } }),
    create: (data) => api.post("/priorities", data),
    update: (id, data) => api.patch(`/priorities/${id}`, data),
    remove: (id) => api.delete(`/priorities/${id}`),
};