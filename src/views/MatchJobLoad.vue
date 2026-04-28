<template>
  <div class="matchJobLoad-page">
    <div class="analysis-container">
      <img src="../assets/img/分析元素.png" class="element-image"/>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="text-content">
        <h2 class="main-text">正在分析简历并<span class="green-text">匹配岗位</span></h2>
        <p class="sub-text">AI正在从我们的数据库中为你筛选最合适的职位...</p>
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
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default {
  name: 'MatchJobLoad',
  data() {
    return {
      progress: 0,
      progressTimer: null,
    };
  },
  created() {
    this.loadData();
  },
  beforeDestroy() {
    clearInterval(this.progressTimer);
  },
  methods: {
    async loadData() {
      this.startProgressAnimation();
      const resumeText = this.$route.query.resumeText;
      const userInfo = this.$route.query.userInfo;
      try {
        const response = await api.post('/ai/match/job', resumeText, {
          headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
        });
        const result = response.data;
        clearInterval(this.progressTimer);
        if (result.code !== 200) {
          alert(result.msg || '简历信息有误！请重新输入选择正确的简历文件');
          return;
        }
        this.$router.push({
          path: '/match-job',
          query: { matchJob: JSON.stringify(result.data), resumeText, userInfo },
        });
      } catch (e) { /* silently handle network errors */ }
    },

    startProgressAnimation() {
      this.progress = 0;
      clearInterval(this.progressTimer);
      this.progressTimer = setInterval(() => {
        if (this.progress < 90) this.progress += Math.random() * 10;
      }, 500);
    }
  }
};
</script>

<style scoped>
@keyframes pulse {
  0%, 100% { filter: drop-shadow(0 0 1rem rgba(0, 255, 200, 0.3)); }
  50%       { filter: drop-shadow(0 0 4rem rgba(0, 255, 200, 0.8)); }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(3rem); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scanDown {
  0%   { top: -3%; opacity: 0; }
  10%  { opacity: 0.8; }
  90%  { opacity: 0.5; }
  100% { top: 103%; opacity: 0; }
}

@keyframes borderGlow {
  0%, 100% { border-color: rgba(0, 245, 212, 0.2); }
  50%       { border-color: rgba(0, 245, 212, 0.7); box-shadow: 0 0 4rem rgba(0,245,212,0.3), inset 0 0 2rem rgba(0,245,212,0.05); }
}

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
  border: 0.3rem solid rgba(0, 245, 212, 0.2);
  animation: fadeInUp 0.6s ease both, borderGlow 3s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}

.analysis-container::before {
  content: '';
  position: absolute;
  left: 0;
  top: -3%;
  width: 100%;
  height: 0.4rem;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 200, 0.8), transparent);
  animation: scanDown 3.5s ease-in-out infinite;
  z-index: 10;
  pointer-events: none;
}

.element-image {
  position: relative;
  z-index: 2;
  top: -20rem;
  left: -2rem;
  width: 80%;
  height: 80%;
  animation: pulse 2.5s ease-in-out infinite;
}

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
  background: linear-gradient(90deg, #00ffc8, #00cc9f, #00ffc8);
  background-size: 200% auto;
  border-radius: 2rem;
  transition: width 0.8s ease;
  animation: shimmer 1.5s linear infinite;
}

.text-content {
  text-align: center;
  color: white;
  margin-top: -45rem;
  z-index: 2;
  position: relative;
  animation: fadeInUp 0.7s ease 0.2s both;
}

.main-text { font-size: 6rem; color: #fff; }
.green-text { color: #00ffc8; }
.sub-text { font-size: 3rem; color: #ffffffcb; }
</style>
