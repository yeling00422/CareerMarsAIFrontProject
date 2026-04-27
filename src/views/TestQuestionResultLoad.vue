<template>
  <div class="testQuestionResultLoad-page">
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
          :ref="'step' + (index + 1)"
        >
        <div class="step-circle">{{ step.completed ? '✓' : index + 1 }}</div>
        <div class="step-label">{{ step.label }}</div>
        </div>
        <!-- <div class="progress-step" ref="step1">
          <div class="step-circle">1</div>
          <div class="step-label">正在评估答题质量...</div>
        </div>
        <div class="progress-step" ref="step2">
          <div class="step-circle">2</div>
          <div class="step-label">正在计算匹配度分数...</div>
        </div>
        <div class="progress-step" ref="step3">
          <div class="step-circle">3</div>
          <div class="step-label">正在生成提升建议...</div>
        </div> -->
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

// 请求拦截器添加token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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
    async loadData(){
      // 初始化steps数组
      // this.steps[0].element = this.$refs.step1;
      // this.steps[1].element = this.$refs.step2;
      // this.steps[2].element = this.$refs.step3;
      // 开始步骤动画
      this.startStepAnimation();
      // 同时启动进度条动画
      this.startProgressAnimation();
      const position = this.$route.query.position;
      const interviewScore = this.$route.query.interviewScore;
      const resumeText = this.$route.query.resumeText;
      const userInfo = this.$route.query.userInfo;
      let personalAbility = null;

      console.log("test-question-result-load:position:",position);
      console.log("test-question-result-load:interviewScore:",interviewScore);

      try {
        // console.log("test-question-result-load:resumeText:",interviewScore);
        const response = await api.post(
          "/ai/generate/personalAbility",
          String(resumeText),
          {
            headers: {
              'Content-Type': 'text/plain;'
            }
          }
        );

        const result = response.data;
        console.log("生成个人能力图接口返回结果:", result);

        if (result.code === 200 && result.data.personalAbility.length > 0
        ) {
          console.log("personalAbility1:", personalAbility);
          personalAbility = result.data.personalAbility.slice();
          console.log("personalAbility2:", personalAbility);
        }
      } catch (error) {
        console.error("重新生成个人能力图失败", error);
        alert('个人能力图生成失败，请稍后重试！');
      }


      // console.log("test-question-result-load:resumeText:",resumeText);
      try {
        const API_PATH = "/ai/testQuestion/result";
        const data = {
          resumeText: resumeText,
          position: position,
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
            path: '/test-question-result',
            query: { 
              testQuestionResultData: JSON.stringify(result.data),
              interviewScore: interviewScore,
              position: position, 
              resumeText: resumeText,
              userInfo: userInfo,
              personalAbility: personalAbility,
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
    },
    async startStepAnimation() {
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
/* 分析容器 */
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
}

.element-image {
  position: relative;
  z-index: 2;
  top: -20rem;
  width: 55%;
  height: 80%;
  filter: drop-shadow(0 0 20px rgba(0, 255, 200, 0.3));
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
  top: -40rem;
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
  color: #00F4D3;
}

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
  transition: all 0.5s ease;
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
  transition: all 0.5s ease;
}

.step-label {
  font-size: 4rem;
  color: rgba(198, 189, 189, 0.882);
}

/* 定义已完成步骤的样式 */
.progress-step.completed .step-circle {
  background: #00a896;
  color: #fff;
}

</style>