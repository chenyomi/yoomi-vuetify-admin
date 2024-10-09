import { baseRequest } from '@/utils/request'

export default {
  shipOrderListGetData(data) {
    return baseRequest(`/api/supapp/sup/shipOrderListGetData`, data, 'get')
  },
  shipOrderAllData(data) {
    return baseRequest(`/api/supapp/sup/shipOrderAllData`, data, 'get')
  },
  shipOrderSendPrint(data) {
    return baseRequest(`/api/supapp/sup/shipOrderSendPrint`, data, 'get')
  },
  shipOrderCodeSendPrint(data) {
    return baseRequest(`/api/supapp/sup/shipOrderCodeSendPrint`, data, 'get')
  },
}
