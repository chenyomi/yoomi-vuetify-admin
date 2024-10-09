import { baseRequest } from '@/utils/request'

export default {
  getList(data) {
    return baseRequest(`/api/supapp/sup/supPricelistShowData`, data, 'get')
  },
  getPic(data) {
    return baseRequest(`/api/supapp/sup/getDrawingUrl`, data, 'post')
  },
  get3D(data) {
    return baseRequest(`/api/supapp/sup/get3DUrl`, data, 'post')
  },
  getDetail(data) {
    return baseRequest(`/api/supapp/sup/detailed`, data, 'get')
  },
  getListUnpricelist(data) {
    return baseRequest(`/api/supapp/sup/unpricelistShowDataPage`, data, 'get')
  },
  getUnDetail(data) {
    return baseRequest(`/api/supapp/sup/unpricelistAllData`, data, 'get')
  },
  getHistoryList(data) {
    return baseRequest(`/api/supapp/sup/pricerecordShowData`, data, 'get')
  },
  getHistoryDetail(data) {
    return baseRequest(`/api/supapp/sup/pricerecordallData`, data, 'get')
  },
  insertData(data) {
    return baseRequest(`/api/supapp/sup/insertData`, data, 'post')
  },
  updateConfirmStatus(data) {
    return baseRequest(`/api/supapp/sup/updateConfirmStatus`, data, 'post')
  },
  updateConfirmStatus(data) {
    return baseRequest(`/api/supapp/sup/updateConfirmStatus`, data, 'post')
  },
  updateConfirmStatusWithMemos(data) {
    return baseRequest(`/api/supapp/sup/updateConfirmStatusWithMemos`, data, 'post')
  },
}
