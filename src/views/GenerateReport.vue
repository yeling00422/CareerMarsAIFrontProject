<template>
  <div class="generateReport-page">
    <!-- 分析容器 -->
    <div class="analysis-container">
      <!-- 科技感圆形图案 -->
      <img src="../assets/img/分析元素.png" class="element-image"/>
      <!-- 进度条 -->
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <!-- 文字内容 -->
      <div class="text-content">
        <h2 class="main-text">正在生成<span class="green-text">性格测试报告</span></h2>
        <p class="sub-text">AI正在根据您的简历与性格为你推荐岗位...</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getAiURL } from '@/utils/index';
import { MessageBox } from 'element-ui';


const api = axios.create({
  baseURL: getAiURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log("api:",api);
// 请求拦截器添加token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default {
  name: 'GenerateReport',
  data() {
    return {
      progress: 0,
      progressTimer: null,
    };
  },
  created() {
    // 组件创建时自动加载数据
    this.loadData();
  },
  methods: {

    async loadData() {
      try {
        this.startProgressAnimation();
        const characteristicsTest = this.$route.query.characteristicsTest;
        const userAnswers = this.$route.query.userAnswers;
        const resumeText = this.$route.query.resumeText;
        console.log("生成报告中-characteristicsTest:",characteristicsTest);
        console.log("生成报告中-userAnswers:",userAnswers);
        console.log("生成报告中-resumeText:",resumeText);

        const API_PATH = "/ai/generate/report";
        const data = {
          characteristicsTest: JSON.stringify(characteristicsTest),
          userAnswers: JSON.stringify(userAnswers),
          resumeText: resumeText,
        }
        const response = await api.post(API_PATH,data);
        console.log("接口调用成功，返回的数据是：", response);     

        // 处理后端返回的Result结构
        const result = response.data;
        console.log("result：", result);
        console.log("result.code:", result.code);
        console.log("result.data：", result.data);
        clearInterval(this.progressTimer);

        if (result.code === 200 || result.code === 0) {
          this.$router.push({
            path: '/login-load',
            query: { 
              testReport: JSON.stringify(result.data),
              resumeText: resumeText 
            },
          });
        } else {
            MessageBox.confirm(result.msg, '提示', {
              confirmButtonText: '重新生成',
              cancelButtonText: '返回首页',
              type: 'warning',
              customClass: 'center-dialog'
          }).then(action => {
            if (action === 'confirm') {
              this.loadData();
            }
          }).catch(() => {
            this.$router.push('/');
          });
        }
      } catch (error) {
        console.error("接口调用失败，错误信息是：", error);
      }
    },

    startProgressAnimation() {
      this.progress = 0;
      clearInterval(this.progressTimer);
      this.progressTimer = setInterval(() => {
        if (this.progress < 90) {
          this.progress += Math.random() * 10;
        }
      }, 500);
    }
  }
}
</script>

<style scoped>
/* 分析容器 */
.analysis-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(64, 64, 64, 0.95);
  width: 85rem; 
  height: 140rem;
  margin-left: 7.5rem;
  margin-top: 30rem;
  margin-bottom: 12rem;
  border-radius: 4rem;
}

.element-image {
  position: relative;
  z-index: 2;
  top: -30rem;
  width: 80%;
  height: 80%;
  filter: drop-shadow(0 0 20px rgba(0, 255, 200, 0.3));
  top: -20rem;
  left: -2rem;
}

/* 进度条 */
.progress-bar {
  width: 30%;
  height: 2rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  margin-bottom: 3rem;
  overflow: hidden;
  position: relative;
  z-index: 2;
  top: -50rem;
}

.progress-fill {
  height: 100%;
  width: 30%;
  background: linear-gradient(90deg, #00ffc8, #00cc9f);
  border-radius: 2rem;
  transition: width 0.8s ease;
}

.text-content {
  text-align: center;
  color: white;
  margin-top: -45rem;
  z-index: 2;
  position: relative;
}

.main-text {
  font-size: 6rem;
  color: #fff;
}

.green-text {
  color: #00ffc8;
}

.sub-text {
  font-size: 3rem;
  color: #ffffffcb;
}

</style>