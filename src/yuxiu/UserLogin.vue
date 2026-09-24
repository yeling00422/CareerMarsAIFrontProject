<template>
  <div class="loading-page">
    <p>微信登录中，请稍候……</p>
  </div>
</template>
<script>
import axios from 'axios';
import { getAiURL } from '@/utils/index';
const api = axios.create({
  baseURL: getAiURL(),
  headers: { 'Content-Type': 'application/json' },
});
export default {
  name: 'UserLogin',
  async mounted() {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    if (!code) {
      alert('网络请求错误，请稍候再重新扫码!')
      return
    }
    const res = await api.get('/ai/yxb/user/login', {
      params: {
        code: code,
        state: state
      }
    })
    console.log('res', res)
    const result = res.data
    console.log('result', result)
    if (result.code === 200) {
      const userData = result.data
      this.$router.push({
        name: 'User',
        params: {
          userData: userData        
        }
      });
    } else {
      alert(result.msg)
    }
  }
}
</script>
