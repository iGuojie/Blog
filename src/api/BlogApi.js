// src/services/api.js
import axiosInstance from '@/axiosconfig';

// 前台API
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
export const GetBlogCount = () => {
    return axiosInstance.get('/api/blogs/count');
};

// 后台管理API
/**
 * 获取博客列表（管理后台，支持分页和筛选）
 * @param {Object} params - { keyword, categoryId, labelId, pageNum, pageSize }
 */
export function getBlogList(params) {
    return axiosInstance({
        url: '/api/blogs/getBlogList',
        method: 'get',
        params
    })
}

/**
 * 获取博客详情（管理后台）
 * @param {Number} id - 博客ID
 */
export function getBlogDetail(id) {
    return axiosInstance({
        url: '/api/blogs/detail',
        method: 'get',
        params: { id }
    })
}

/**
 * 新增博客
 * @param {Object} data - 博客数据
 */
export function addBlog(data) {
    return axiosInstance({
        url: '/api/blogs/add',
        method: 'post',
        data
    })
}

/**
 * 更新博客
 * @param {Object} data - 博客数据
 */
export function updateBlog(data) {
    return axiosInstance({
        url: '/api/blogs/update',
        method: 'post',
        data
    })
}

/**
 * 删除博客
 * @param {Number} id - 博客ID
 */
export function deleteBlog(id) {
    return axiosInstance({
        url: '/api/blogs/delete',
        method: 'post',
        data: { id }
    })
}

