import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.response?.data?.errors?.[0]?.message ||
            error.message ||
            "Something went wrong";
        return Promise.reject(new Error(message));
    },
);

export default api;