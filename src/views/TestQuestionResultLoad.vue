<template>
  <div class="testQuestionResultLoad-page">
    <div class="analysis-container">
      <img src="../assets/img/分析元素.png" class="element-image"/>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="text-content">
        <h2 class="main-text"><span class="green-text">Ai分析过程</span></h2>
        <p class="sub-text">正在分析你的答题表现...</p>
        <p class="sub-text">评估技术能力匹配度</p>
        <p class="sub-text">检测到</p>
        <p class="sub-text sub-text-last"><span class="green-text">....</span></p>
      </div>
    </div>
    <div class="bottom-progress">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="progress-step"
        :class="{ completed: step.completed }"
      >
        <div class="step-circle">{{ step.completed ? '✓' : index + 1 }}</div>
        <div class="step-label">{{ step.label }}</div>
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
  name: 'TestQuestionResultLoad',
  data() {
    return {
      steps: [
        { label: '正在评估答题质量...', completed: false },
        { label: '正在计算匹配度分数...', completed: false },
        { label: '正在生成提升建议...', completed: false }
      ],
      currentStep: 0,
      progress: 0,
      progressTimer: null,
      stepTimer: null,
    };
  },
  created() {
    this.loadData();
  },
  beforeDestroy() {
    clearInterval(this.progressTimer);
    clearTimeout(this.stepTimer);
  },
  methods: {
    resetSteps() {
      this.currentStep = 0;
      this.steps.forEach(step => { step.completed = false; });
    },

    async loadData() {
      this.startStepAnimation();
      this.startProgressAnimation();
      const position = this.$route.query.position;
      const interviewScore = this.$route.query.interviewScore;
      const resumeText = this.$route.query.resumeText;
      const userInfo = this.$route.query.userInfo;
      let personalAbility = null;

      try {
        const abilityResponse = await api.post('/ai/generate/personalAbility', String(resumeText), {
          headers: { 'Content-Type': 'text/plain;' }
        });
        const abilityResult = abilityResponse.data;
        if (abilityResult.code === 200 && abilityResult.data.personalAbility.length > 0) {
          personalAbility = abilityResult.data.personalAbility.slice();
        }
      } catch (e) { /* personalAbility remains null, handled by retry button */ }

      try {
        const response = await api.post('/ai/testQuestion/result', { resumeText, position });
        const result = response.data;
        clearInterval(this.progressTimer);
        if (result.code === 200 || result.code === 0) {
          this.$router.push({
            path: '/test-question-result',
            query: {
              testQuestionResultData: JSON.stringify(result.data),
              interviewScore,
              position,
              resumeText,
              userInfo,
              personalAbility,
            },
          });
        } else {
          MessageBox.confirm(result.msg, '提示', {
            confirmButtonText: '重新生成',
            cancelButtonText: '返回首页',
            type: 'warning',
            customClass: 'center-dialog'
          }).then(() => {
            this.loadData();
          }).catch(() => {
            this.$router.push('/');
          });
        }
      } catch (e) { /* silently handle network errors */ }
    },

    startProgressAnimation() {
      this.progress = 0;
      clearInterval(this.progressTimer);
      this.progressTimer = setInterval(() => {
        if (this.progress < 90) this.progress += Math.random() * 10;
      }, 500);
    },

    startStepAnimation() {
      this.resetSteps();
      clearTimeout(this.stepTimer);
      const run = () => {
        if (this.currentStep < this.steps.length) {
          this.steps[this.currentStep].completed = true;
          this.currentStep++;
          this.stepTimer = setTimeout(run, 9000);
        }
      };
      run();
    },
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

@keyframes stepSlideIn {
  from { opacity: 0; transform: translateX(-2rem); }
  to   { opacity: 1; transform: translateX(0); }
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
  height: 100rem;
  margin-left: 7.5rem;
  margin-top: 30rem;
  border-radius: 4rem;
  border: 0.3rem solid rgba(0, 245, 212, 0.2);
  animation: borderGlow 3s ease-in-out infinite;
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
  width: 55%;
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
  top: -40rem;
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
}

.main-text { font-size: 6rem; color: #fff; }
.green-text { color: #00F4D3; }
.sub-text { font-size: 3rem; color: #ffffffcb; }
.sub-text-last { font-size: 6.8rem; position: relative; top: -5rem; }

.bottom-progress {
  margin-top: 12rem;
  width: 85rem;
  margin-left: 7.5rem;
}

.progress-step {
  display: flex;
  height: 10rem;
  background: #7c7c7c;
  border-radius: 4rem;
  justify-content: left;
  align-items: center;
  margin-bottom: 5rem;
  padding-left: 5rem;
  transition: box-shadow 0.5s ease;
  animation: stepSlideIn 0.4s ease both;
}

.progress-step.completed { box-shadow: 0 0 1.5rem rgba(0, 168, 150, 0.4); }

.step-circle {
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background: #666;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
  font-weight: bold;
  color: #d8c6c6;
  margin-right: 3rem;
  transition: background-color 0.5s ease, color 0.5s ease;
}

.step-label {
  font-size: 4rem;
  color: rgba(198, 189, 189, 0.882);
  transition: color 0.5s ease;
}

.progress-step.completed .step-circle { background: #00a896; color: #fff; }
.progress-step.completed .step-label { color: #fff; }
</style>
