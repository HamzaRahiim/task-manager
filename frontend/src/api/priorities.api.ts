import api from "./axios";

interface PriorityData {
  name: string;
  color: string;
}

export const prioritiesApi = {
  getAll: () => api.get("/priorities"),
  checkName: (name: string) =>
    api.get("/priorities/check", { params: { name } }),
  create: (data: PriorityData) => api.post("/priorities", data),
  update: (id: string, data: PriorityData) =>
    api.patch(`/priorities/${id}`, data),
  remove: (id: string) => api.delete(`/priorities/${id}`),
};
