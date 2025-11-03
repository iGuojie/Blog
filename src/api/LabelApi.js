import axiosInstance from '@/axiosconfig'

/**
 * 获取所有标签列表（不分页，前台用）
 */
export function getLabelList() {
    return axiosInstance({
        url: '/api/label/getLabel',
        method: 'get'
    })
}

/**
 * 获取标签列表（分页，后台管理用）
 * @param {Number} pageNo - 页码
 * @param {Number} pageSize - 每页数量
 */
export function getLabelListWithPage(pageNo, pageSize) {
    return axiosInstance({
        url: '/api/label/list',
        method: 'get',
        params: { pageNo, pageSize }
    })
}

/**
 * 添加标签
 * @param {Object} data - { name, descirption }
 */
export function addLabel(data) {
    return axiosInstance({
        url: '/api/label/add',
        method: 'post',
        data
    })
}

/**
 * 更新标签
 * @param {Object} data - { id, name, descirption }
 */
export function updateLabel(data) {
    return axiosInstance({
        url: '/api/label/update',
        method: 'post',
        data
    })
}

/**
 * 删除标签
 * @param {Number} id - 标签ID
 */
export function deleteLabel(id) {
    return axiosInstance({
        url: '/api/label/delete',
        method: 'post',
        data: { id }
    })
}
