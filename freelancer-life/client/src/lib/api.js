import axios from "axios";
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "/api",
    headers: { "Content-Type": "application/json" },
});
// Attach token from localStorage automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("fl_token");
    if (token)
        config.headers.Authorization = `Bearer ${token}`;
    return config;
});
// On 401, clear session
api.interceptors.response.use((res) => res, (err) => {
    if (err.response?.status === 401) {
        localStorage.removeItem("fl_token");
        localStorage.removeItem("fl_role");
        window.location.href = "/";
    }
    return Promise.reject(err);
});
export default api;
