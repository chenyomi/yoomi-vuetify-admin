/**
 *  Copyright [2022] [https://www.xiaonuo.vip]
 *	Snowy采用APACHE LICENSE 2.0开源协议，您在使用过程中，需要注意以下几点：
 *	1.请不要删除和修改根目录下的LICENSE文件。
 *	2.请不要删除和修改Snowy源码头部的版权声明。
 *	3.本项目代码可免费商业使用，商业使用请保留源码和相关描述文件的项目出处，作者声明等。
 *	4.分发源码时候，请注明软件出处 https://www.xiaonuo.vip
 *	5.不可二次分发开源参与同类竞品，如有想法可联系团队xiaonuobase@qq.com商议合作。
 *	6.若您的项目无法满足以上几点，需要更多功能代码，获取Snowy商业授权许可，请在官网购买授权，地址为 https://www.xiaonuo.vip
 */
// 统一的请求发送
import { useStore } from '@/pinia/index'
import axioss from 'axios'

const pinia = useStore()

localStorage.setItem('base', import.meta.env.VITE_API_URL)

// 以下这些code需要重新登录
const reloadCodes = [401, 1011007, 1011008]

const errorCodeMap = {
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不正确。',
  406: '相同名称已存在。',
  410: '请求的资源被永久删除，且不会再得到的。',
  415: '参数传递异常。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}


// 定义一个重新登录弹出窗的变量
const loginBack = ref(false)


// 创建 axios 实例
const service = axioss.create({
  baseURL: '/api', // api base_url
  timeout: 5000, // 请求超时时间
})

// HTTP request 拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers['token'] = token
    }
    // if (!sysConfig.REQUEST_CACHE && config.method === 'get') {
    //   config.params = config.params || {}
    //   config.params._ = new Date().getTime()
    // }

    // // 格式化get请求的参数
    // if (config.method === 'get') config.paramsSerializer = { indexes: null }
    // Object.assign(config.headers, sysConfig.HEADERS)

    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// 保持重新登录Modal的唯一性
const error = () => {
  loginBack.value = true
  pinia.message.open({
    text: '登录已失效， 请重新登录',
  })

  //   Modal.error({
  //     title: '提示：',
  //     okText: '重新登录',
  //     content: '登录已失效， 请重新登录',
  //     onOk: () => {
  //       loginBack.value = false
  //       tool.data.remove('TOKEN')
  //       tool.data.remove('USER_INFO')
  //       tool.data.remove('MENU')
  //       tool.data.remove('PERMISSIONS')
  //       window.location.reload()
  //     },
  //   })
}

// HTTP response 拦截器
service.interceptors.response.use(
  response => {
    // 配置了blob，不处理直接返回文件流
    if (response.config.responseType === 'blob') {
      if (response.status === 200) {
        return response
      } else {
        pinia.message.open({
          text: '登录已失效， 文件下载失败或此文件不存在',
        })

        return
      }
    }

    const data = response.data
    const code = data.code
    if (reloadCodes.includes(code)) {
      if (!loginBack.value) {
        localStorage.clear()
        window.location.reload(true)
        error()
      }

      return
    }

    if (code !== 200) {
      if (errorCodeMap[code]) {
        pinia.message.open({
          text: response.data.msg,
        })
      }
      return Promise.reject()

    } else {
      // 统一成功提示
      // const responseUrl = response.config.url
    }

    return Promise.resolve(data)
  },
  error => {
    if (error) {
      const status = 503
      const description = errorCodeMap[status]
      pinia.message.open({
        text: '请求错误：' + description,
      })

      return Promise.reject(error)
    }
  },
)
export const baseRequest = (url, value = {}, method = 'post', options = {}, baseUrl) => {
  url = (baseUrl ? baseUrl : import.meta.env.VITE_API_URL) + url
  if (method === 'post') {
    return service.post(url, value, options)
  } else if (method === 'get') {
    return service.get(url, {
      params: value,
      ...options,
    })
  } else if (method === 'formdata') {
    return service({
      method: 'post',
      url,
      data: value,

      // 转换数据的方法
      transformRequest: [
        function (data) {
          let ret = ''
          for (const it in data) {
            ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])}&`
          }
          ret = ret.substring(0, ret.length - 1)

          return ret
        },
      ],

      // 设置请求头
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  } else if (method === 'put') {
    return service.put(url, value, options)
  } else if (method === 'delete') {
    return service.delete(url, {
      params: value,
      ...options,
    })
  }
}

export default service
