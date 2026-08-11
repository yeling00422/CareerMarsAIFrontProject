<template>
  <div class="endLoad-page">
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
        <h2 class="main-text"><span class="green-text">Ai思考过程</span></h2>
        <p class="sub-text">正在分析简历内容...</p>
        <p class="sub-text">识别候选人<span class="green-text">核心工作能力</span></p>
        <p class="sub-text">提取关键技能和专业能力</p>
        <p class="sub-text sub-text-last"><span class="green-text">....</span></p>
      </div>
    </div>
    <div class="bottom-progress">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="progress-step"
          :class="{ completed: step.completed }"
          :ref="'step' + (index + 1)"
        >
        <div class="step-circle">{{ step.completed ? '✓' : index + 1 }}</div>
        <div class="step-label">{{ step.label }}</div>
        </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getAiURL,getBaseUrl } from '@/utils/index';
import { MessageBox } from 'element-ui';

const api = axios.create({
  baseURL: getAiURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  // 关键：开启跨域 Cookie 携带/写入
  withCredentials: true, 
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
  name: 'EndLoad',
  data() {
    return {
      steps: [
        { label: '正在解析简历核心经历...', completed: false },
        { label: '正在加载导师信息...', completed: false },
        { label: '正在匹配合适的导师...', completed: false }
      ],
      currentStep: 0,
      progress: 0,
      progressTimer: null,
      stepTimer: null,
      userInfo: null,
    };
  },
  created() {
    // 组件创建时自动加载数据
    this.loadData();
  },
  methods: {
    resetSteps() {
      this.currentStep = 0;
      this.steps.forEach(step => {
        step.completed = false;
      });
    },
    async loadData() {
      // 开始步骤动画
      this.startStepAnimation();
      // 同时启动进度条动画
      this.startProgressAnimation();
      // 从路由参数中获取数据
      const resumeText = this.$route.params.resumeText;
      const mbtiResult = this.$route.params.mbtiResult;
      console.log("mbtiResult", mbtiResult);
      const position = this.$route.params.position;
      this.userInfo = this.$route.params.userInfo;
      const userInfoJson = JSON.parse(this.userInfo);
      const token = userInfoJson.token;
      const url = getBaseUrl();
      try {
        const API_PATH = "/ai/recommendation/mentor";
        const data = {
          resumeText: JSON.stringify(resumeText),
          position: position,
          mbtiResult: mbtiResult,
        }
        const response = await api.post(API_PATH,data);
        const result = response.data;
        clearInterval(this.progressTimer);
        if (result.code === 200) {
          if (result.data.mentorList.length === 0) {
            MessageBox.confirm(result.msg || '推荐导师生成失败，是否重新生成？', '提示', {
              confirmButtonText: '重新生成推荐导师',
              cancelButtonText: '查看所有导师',
              type: 'warning',
              customClass: 'center-dialog'
            }).then(action => {
              if (action === 'confirm') {
                this.loadData();
              }
            }).catch(async () => {
              // window.location.href = url+'/teacher';
              const searchAllMentorResponse = await api.get("/ai/search/all/mentor");
              const searchAllMentorResult = searchAllMentorResponse.data;
              if (searchAllMentorResult.code === 200) {
                this.$router.push({
                  name: 'AllMentorResult',
                  params: { 
                    teachers: JSON.stringify(searchAllMentorResult.data.mentorList),
                    token: token,
                    userInfo:this.userInfo,
                  },
                });
              }
            });
            return;
          }
          this.$router.push({
            name: 'EndResult',
            params: { 
              teachers: JSON.stringify(result.data.mentorList),
              token: token,
              userInfo:this.userInfo,
            },
          });
        } else {
          MessageBox.confirm(result.msg || '推荐导师生成失败，是否重新生成？', '提示', {
            confirmButtonText: '重新生成推荐导师',
            cancelButtonText: '查看所有导师',
            type: 'warning',
            customClass: 'center-dialog'
          }).then(action => {
            if (action === 'confirm') {
              this.loadData();
            }
          }).catch(async () => {
              // window.location.href = url+'/teacher';
              const searchAllMentorResponse = await api.get("/ai/search/all/mentor");
              const searchAllMentorResult = searchAllMentorResponse.data;
              if (searchAllMentorResult.code === 200) {
                this.$router.push({
                  name: 'AllMentorResult',
                  params: { 
                    teachers: JSON.stringify(searchAllMentorResult.data.mentorList),
                    token: token,
                    userInfo:this.userInfo,
                  },
                });
              }
          });
        }
      } catch (error) {
        //跳转导师推荐列表页面
        console.error("推荐导师接口调用失败，错误信息是：", error);
      }      
    },
    startProgressAnimation() {
      this.progress = 0;
      clearInterval(this.progressTimer);
      this.progressTimer = setInterval(() => {
        if (this.progress < 90) {
          this.progress += Math.random() * 20;
        }
      }, 500);
    },
    async startStepAnimation() {
      this.resetSteps();
      clearTimeout(this.stepTimer);

      const run = () => {
        if (this.currentStep < this.steps.length) {
          this.steps[this.currentStep].completed = true;
          this.currentStep++;
          this.stepTimer = setTimeout(run, 5000);
        }
      };

      run();
    },
    completeCurrentStep() {
      const step = this.steps[this.currentStep];
      if (!step || !step.element) return;
      step.completed = true;
      // 添加completed类来显示绿色√
      const circleElement = step.element.querySelector('.step-circle');
      if (circleElement) {
        circleElement.classList.add('completed');
        circleElement.textContent = '✓'; // 替换数字为对号
        // 添加延迟确保样式生效
        setTimeout(() => {
          circleElement.style.backgroundColor = '#00a896';
          circleElement.style.color = 'white';
        }, 50);
      }
      // 更新标签样式
      const labelElement = step.element.querySelector('.step-label');
      if (labelElement) {
        labelElement.style.color = 'white';
      }
    }
  }
}
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

.main-text {
  font-size: 6rem;
  color: #fff;
}

.green-text { color: #00F4D3; }

.sub-text {
  font-size: 3rem;
  color: #ffffffcb;
}

.sub-text-last {
  font-size: 6.8rem;
  position: relative;
  top: -5rem;
}

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
  transition: background-color 0.5s ease, box-shadow 0.5s ease;
  animation: stepSlideIn 0.4s ease both;
}

.progress-step.completed {
  box-shadow: 0 0 1.5rem rgba(0, 168, 150, 0.4);
}

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