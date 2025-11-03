import axiosInstance from '@/axiosconfig'

/**
 * 获取所有分类列表（不分页，前台用）
 */
export function getCategoryList() {
    return axiosInstance({
        url: '/api/category/getCategory',
        method: 'get'
    })
}

/**
 * 获取分类列表（分页，后台管理用）
 * @param {Number} pageNo - 页码
 * @param {Number} pageSize - 每页数量
 */
export function getCategoryListWithPage(pageNo, pageSize) {
    return axiosInstance({
        url: '/api/category/list',
        method: 'get',
        params: { pageNo, pageSize }
    })
}

/**
 * 新增分类
 * @param {Object} data - { name: string, description: string }
 */
export function addCategory(data) {
    return axiosInstance({
        url: '/api/category/add',
        method: 'post',
        data
    })
}

/**
 * 更新分类
 * @param {Object} data - { id: number, name: string, description: string }
 */
export function updateCategory(data) {
    return axiosInstance({
        url: '/api/category/update',
        method: 'post',
        data
    })
}

/**
 * 删除分类
 * @param {Object} data - { id: number }
 */
export function deleteCategory(data) {
    return axiosInstance({
        url: '/api/category/delete',
        method: 'post',
        data
    })
}
