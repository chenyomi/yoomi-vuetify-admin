import { baseRequest } from '@/utils/request'

export default {
    getUnqualifiedGetData(data) {
        return baseRequest(`/api/supapp/sup/unqualifiedGetData`, data, 'get')
    },
    unqualifiedReturnReason(data) {
        return baseRequest(`/api/supapp/sup/unqualifiedReturnReason`, data, 'get')
    },
    unqualifiedUpdateData(data) {
        return baseRequest(`/api/supapp/sup/unqualifiedUpdateData`, data, 'post')
    },
    formoneyAllData(data) {
        return baseRequest(`/api/supapp/sup/formoneyAllData`, data, 'get')
    },
}
