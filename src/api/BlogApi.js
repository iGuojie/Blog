// src/services/api.js
import axiosInstance from '@/axiosconfig';

export const GetBlogList = (params) => {
    return axiosInstance.get('/api/blogs/getBlogList', { params });
};
export const GetBlogDetail = (id) => {
    return axiosInstance.get('/api/blogs/detail?id='+id);
};
export const GetPanelData = () => {
    return axiosInstance.get('/api/blogs/panel');
};
export const GetCategoryList = () => {
    return axiosInstance.get('/api/category/getCategory');
};
export const GetLabelList = () => {
    return axiosInstance.get('/api/label/getLabel');
};

