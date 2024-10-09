import { baseRequest } from '@/utils/request'

export default {
  getUnOrder(data) {
    return baseRequest(`/api/supapp/sup/vVenPolistsShowData`, data, 'get')
  },
  getUnOrderSum(data) {
    return baseRequest(`/api/supapp/sup/vVenPolistsUnorderSum`, data, 'get')
  },
  getHasOrder(data) {
    return baseRequest(`/api/supapp/sup/deOrderShowData`, data, 'get')
  },
  undeOrderGy(data) {
    return baseRequest(`/api/supapp/sup/undeOrderGy`, data, 'post')
  },
}
