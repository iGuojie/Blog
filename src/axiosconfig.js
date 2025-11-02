// src/plugins/axios.js
import axios from 'axios';

// 环境判断：开发环境使用本地地址，生产环境使用service8305
// const isDevelopment = import.meta.env.MODE === 'development';
const isDevelopment = false;

// 创建一个 Axios 实例
const axiosInstance = axios.create({
    // 开发环境: http://127.0.0.1:8305
    // 生产环境: /service8305
    baseURL: isDevelopment ? 'http://127.0.0.1:8305' : '/service8305',
    timeout: 5000, // 设置请求超时时间
    // 其他配置项...
});

export default axiosInstance;
