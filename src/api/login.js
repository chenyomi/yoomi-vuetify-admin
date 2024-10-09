import { baseRequest } from '@/utils/request'

export default {
  login(data) {
    return baseRequest(`/api/supapp/sup/supLogin`, data, 'get')
  },
  defaultinfoSp(data) {
    return baseRequest(`/api/supapp/sup/defaultinfoSp`, data, 'get')
  },
  indexPriceRecordGroupMonth(data) {
    return baseRequest(`/api/supapp/sup/indexPriceRecordGroupMonth`, data, 'get')
  },
  indexOrderGroupMonth(data) {
    return baseRequest(`/api/supapp/sup/indexOrderGroupMonth`, data, 'get')
  },
  indexQualityGroupMonth(data) {
    return baseRequest(`/api/supapp/sup/indexQualityGroupMonth`, data, 'get')
  },
  selectGetall(data) {
    return baseRequest(`/api/supapp/sup/selectGetall`, data, 'post')
  },
}
