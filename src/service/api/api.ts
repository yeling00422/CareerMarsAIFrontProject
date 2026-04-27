// // service/mentor.ts
// import { useJsonFetch } from '../utils/request'
// import qs from 'qs'

// /**
//  * 查询导师列表
//  * @param params 查询参数，会拼到 URL 的 query 上
//  * @param fetchOptions 可选的 fetch 配置（比如 headers、timeout 等）
//  * @returns 
//  */
// export const searchMentorApi = (params?: Record<string, any>, fetchOptions?: RequestInit) => {
//   // GET 请求参数用 qs 拼接，然后放到 URL 的 query 部分
//   const queryString = params ? `?${qs.stringify(params)}` : ''
//   const url = `/ai/search/mentor${queryString}`

//   return useJsonFetch<YourResponseType>(url, {
//     method: 'GET',
//     ...fetchOptions
//   })
// }