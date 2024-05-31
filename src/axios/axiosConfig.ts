import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm một interceptor để bắt các lỗi
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi mạng hoặc bất kỳ lỗi nào khác
    if (error.message === "Network Error") {
      console.error("Network error: please check your internet connection.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
