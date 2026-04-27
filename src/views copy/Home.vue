<template>
  <div class="home-container">
    <div class="head-container">
      <img src="../assets/img/灰色部分1.png" class="logo"/>
    </div>

    <div class="button-section">
      <button class="free-analysis-btn" @click="$router.push('/upload')">免费分析</button>
      <!-- <button class="free-analysis-btn" @click="handleFreeAnalysis">免费分析</button> -->
      <span class="iconfont icon-sanjiaoxing"></span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getAiURL } from '@/utils/index';

const api = axios.create({
  baseURL: getAiURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器添加token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default {
  name: 'Home',
  methods: {
    async handleFreeAnalysis() {
      try {
        const API_PATH = "/ai/search/mentor";
        const response = await api.get(API_PATH);
        console.log("接口调用成功，返回的数据是：", response);
      } catch (error) {
        console.error("接口调用失败，错误信息是：", error);
      }
    }
  }
}
</script>

<style scoped>


.home-container {
  width: 100vw;
  min-height: 100vh;
  height: auto;
  background-image: url('../assets/img/第一页白背景.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  left: 0;
}

.logo {
  width: 100%;
  height: 100%;
}

/* 按钮区域：用 Flex 布局替代固定 top，避免位置错乱 */
.button-section {
  position: relative; 
  top: -20rem; /* -200px ÷ 3.75 ≈ -53.33rem */
  display: flex; /* 新增：Flex 布局让按钮和图标对齐 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-bottom: 10rem;
}

/* 图标：用 rem 调整间距 */
.icon-sanjiaoxing {
  color: #01F5D4;
  margin-left: -13.33rem; /* -50px ÷ 3.75 ≈ -13.33rem */
}

/* 按钮：用 rem 调整尺寸和边距 */
.free-analysis-btn {
  background: #595959;
  width: 53.33rem; 
  height: 10.67rem; 
  color: white;
  border: none;
  border-radius: 2.67rem; /* 10px ÷ 3.75 ≈ 2.67rem */
  font-size: 5.33rem; 
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: -10rem; 
}

.free-analysis-btn:hover {
  background: #14a08d;
  transform: translateY(-0.53rem); /* 2px ÷ 3.75 ≈ 0.53rem */
}
</style>