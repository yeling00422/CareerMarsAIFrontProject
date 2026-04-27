<template>
  <div class="home-container">
    <!-- 顶部固定栏 -->
    <div class="head-container">
      <img src="../assets/img/上面固定栏.png" class="logo"/>
    </div>
    <!-- 分析容器 -->
    <div class="analysis-container">
      <!-- 科技感圆形图案 -->
      <img src="../assets/img/分析元素.png" class="element-image"/>
      <!-- 进度条 -->
      <div class="progress-bar">
        <div class="progress-fill"></div>
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
        <div class="progress-step" ref="step1">
          <div class="step-circle">1</div>
          <div class="step-label">正在解析简历核心经历...</div>
        </div>
        <div class="progress-step" ref="step2">
          <div class="step-circle">2</div>
          <div class="step-label">正在匹配岗位技术要求...</div>
        </div>
        <div class="progress-step" ref="step3">
          <div class="step-circle">3</div>
          <div class="step-label">正在生成场景化问题...</div>
        </div>
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
  data() {
    return {
      steps: [
        { element: null, completed: false },
        { element: null, completed: false },
        { element: null, completed: false }
      ],
      currentStep: 0
    };
  },
  mounted() {
    // 初始化steps数组
    this.steps[0].element = this.$refs.step1;
    this.steps[1].element = this.$refs.step2;
    this.steps[2].element = this.$refs.step3;
    
    // 开始步骤动画
    this.startStepAnimation();
    
    // 同时启动进度条动画
    this.startProgressAnimation();
  },
  created() {
    // 组件创建时自动加载数据
    this.loadAnalysisData();
  },
  methods: {
    async loadAnalysisData() {
      // 从路由参数中获取数据
      const testPaperName = this.$route.query.testPaperName;// 将数据转为字符串传递
      const resume = this.$route.query.resume;// 将数据转为字符串传递
      const position = this.$route.query.expectationPosition;// 将数据转为字符串传递
      const jobId = this.$route.query.jobId;// 将数据转为字符串传递

      console.log("generate-test-question-load-position:",position);
      console.log("generate-test-question-load-resume:",resume);
      console.log("generate-test-question-load-testPaperName:",testPaperName);
      console.log("generate-test-question-load-jobId:",jobId);
      // 设置延迟3秒
      // setTimeout(() => {
      //   this.$router.push({path: '/question',
      //   query: {
      //     generateQuestion: generateQuestion,
      //     expectationPosition: expectationPosition,
      //     resume: resume,
      //   }});
      // }, 3000);
        let result = null;
        console.log("正在调用后端接口");
        if(testPaperName != null){
          const API_PATH =  "/ai/search/testQuestion";
          const response = await api.get(API_PATH, {
              params: {
                  testPaperName: testPaperName,
                  jobId: jobId,
              }
          });
          console.log("testPaperName:",testPaperName);
          console.log("response:", response);
          result = response.data;
        }else{
          const API_PATH = "/ai/generate/testQuestion";
          const response = await api.get(API_PATH, {
            params: {position: position}
          });  
          console.log("testPaperName:",testPaperName);
          console.log("response:", response);
          result = response.data;
        }    
        // 处理后端返回的Result结构
        console.log("result：", result);
        console.log("result.code:", result.code);
        console.log("result.data：", result.data);
        
        if (result.code === 200 || result.code === 0) {
          this.$router.push({
            path: '/test-question',
            query: { 
              generateQuestion: JSON.stringify(result.data), // 将数据转为字符串传递
              expectationPosition: position, // 将数据转为字符串传递
              resume: resume, // 将数据转为字符串传递
              testPaperName: testPaperName // 将数据转为字符串传递
            }
          });
        } else {
          console.error("接口返回错误:", result.msg);
          alert(result.msg || '匹配岗位失败');
        }
    },
    startProgressAnimation() {
      // 模拟进度条增长
      let progress = 30;
      const interval = setInterval(() => {
        progress += Math.random() * 25;
        // if (progress >= 100) {
        //   progress = 100;
        //   window.location.href = '/question';
        // }
        
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
          progressFill.style.width = progress + '%';
        }
      }, 800);
    },
    async startStepAnimation() {
      // 循环执行每个步骤的动画
      while (this.currentStep < this.steps.length) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待2秒
        
        // 设置当前步骤为完成状态
        this.completeCurrentStep();
        
        // 增加currentStep
        this.currentStep++;
      }
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

.head-container {
  height: 10rem;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* 分析容器 */
.analysis-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(64, 64, 64, 0.95);
  width: 85rem; 
  height: 100rem;
  margin-left: 7.5rem;
  margin-top: 8rem;
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