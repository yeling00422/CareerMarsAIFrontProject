// import { createFetch, UseFetchOptions } from '@vueuse/core'
// import { set } from 'lodash'
// import { ElMessage } from 'element-plus'
// import { useUserStore } from '@/stores/user'
// import { routes } from '@/router'
// import { getEnv, getBaseUrl } from '@/utils'
// const env = getEnv()
// console.log(3, env)
// let baseUrl = ''
// if (env === 'dev') {
//   baseUrl = '/api'
// } else if (env === 'test') {
//   baseUrl = `${getBaseUrl()}/api`
// } else {
//   baseUrl = `${getBaseUrl()}/api`
// }

// const _useJsonFetch = createFetch({
//   baseUrl,
//   options: {
//     beforeFetch({ options }) {
//       if (options.headers) {
//         const token = localStorage.getItem('token')
//         set(options.headers, 'Content-Type', `application/json`)
//         set(options.headers, 'userToken', token)
//       }
//       return { options }
//     },
//     async afterFetch(ctx) {
//       // responseType 为text的URL，不需要解析
//       if (ctx?.response?.url.includes('/pay/vip/aliPay')) {
//         return ctx
//       }
//       try {
//         ctx.data = JSON.parse(ctx.data)
//       } catch (error) {
//         console.error(error)
//       }
//       if (ctx.data.code === 200) {
//       } else if (ctx.data.code === 401) {
//         // 未登录或者登录过期
//         // ElMessage({
//         //   message: '登陆过期',
//         //   type: 'error'
//         // })
//         const path = window.location.pathname
//         const currentObj = routes.find((item) => item.path === path)
//         if (currentObj) {
//           // 不需要token的页面，401不用跳转
//           if (currentObj.meta?.noToken) {
//             console.log('没token', currentObj)
//           } else {
//             const userStore = useUserStore()
//             userStore.resetUserInfo()
//             // 需要token的页面，401时跳转登录页
//             window.location.href = `${window.location.origin}/reg`
//           }
//         }
//       } else if (ctx.data.code !== 200) {
//         if (ctx.data.msg) {
//           ElMessage({
//             message: ctx.data.msg,
//             type: 'error'
//           })
//         } else {
//           ElMessage({
//             message: '错误(前端提示)',
//             type: 'error'
//           })
//         }
//       }
//       return ctx
//     },
//     onFetchError(ctx) {
//       return ctx
//     },
//     timeout: 30000
//   },
//   fetchOptions: {
//     mode: 'cors',
//     credentials: 'include'
//   }
// })

// export const useJsonFetch = function (
//   url: string,
//   options: RequestInit,
// //   useFetchOptions?: UseFetchOptions | undefined
// ) {
//   // 解析url
//   if (options.method === 'GET' || options.method === 'DELETE') {
//     const urlArr = url.split('?')
//     const query: any = {}
//     const urlParams = urlArr[1] ? decodeURIComponent(urlArr[1]).split('&') : []
//     urlParams.forEach((item) => {
//       const arr = item.split('=')
//       query[arr[0]] = arr[1]
//     })
//   } else {
//     const body = JSON.parse(options.body as string) || {}
//     options.body = JSON.stringify(body)
//   }

//   return _useJsonFetch(url, options, useFetchOptions)
// }
