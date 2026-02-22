import api from "./axios";

interface StatusData {
  name: string;
  color: string;
}

export const statusesApi = {
  getAll: () => api.get("/statuses"),
  checkName: (name: string) => api.get("/statuses/check", { params: { name } }),
  create: (data: StatusData) => api.post("/statuses", data),
  update: (id: string, data: StatusData) => api.patch(`/statuses/${id}`, data),
  remove: (id: string) => api.delete(`/statuses/${id}`),
};
