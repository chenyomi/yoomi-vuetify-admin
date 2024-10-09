import { baseRequest } from '@/utils/request'

export default {
  getInvoiceGetDatar(data) {
    return baseRequest(`/api/supapp/sup/invoiceGetData`, data, 'get')
  },
  getUnInvoiceGetData(data) {
    return baseRequest(`/api/supapp/sup/uninvoiceGetData`, data, 'get')
  },
  getBalaqueryAllData(data) {
    return baseRequest(`/api/supapp/sup/balaqueryAllData`, data, 'get')
  },
  getBalaqueryShowDataVo(data) {
    return baseRequest(`/api/supapp/sup/balaqueryShowDataVo`, data, 'get')
  },
  shipOrderSendOrder(data) {
    return baseRequest(`/api/supapp/sup/shipOrderSendOrder`, data, 'get')
  },
  shipOrderGainMainData(data) {
    return baseRequest(`/api/supapp/sup/shipOrderGainMainData`, data, 'get')
  },
  shipOrderDelSendMainID(data) {
    return baseRequest(`/api/supapp/sup/shipOrderDelSendMainID`, data, 'get')
  },
  shipOrderPrintNumber(data) {
    return baseRequest(`/api/supapp/sup/shipOrderPrintNumber`, data, 'get')
  },
  shipOrderShowData(data) {
    return baseRequest(`/api/supapp/sup/shipOrderShowData`, data, 'get')
  },
  shipOrderSave(data) {
    return baseRequest(`/api/supapp/sup/shipOrderSave`, data, 'post')
  },
}
