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
        <h2 class="main-text"><span class="green-text">Ai分析过程</span></h2>
        <p class="sub-text">正在分析你的答题表现...</p>
        <p class="sub-text">评估技术能力匹配度</p>
        <p class="sub-text">检测到</p>
        <p class="sub-text sub-text-last"><span class="green-text">....</span></p>
      </div>
    </div>
    <div class="bottom-progress">
        <div class="progress-step" ref="step1">
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
      currentStep: 0,
      interviewScore: 0,  // 面试表现分80
      expectationPosition: '',  // 期望岗位
      resume: '',  // 简历
      
      avgScore: 50,// 综合评分50
      resumeMatchingScore: 25,    // 简历匹配分25
      positionMatchingScore: 40,  // 岗位匹配分40
      overallPerformance: 36,  // 综合表现：超越了36%的同类候选人
      improvements: [
        {
          title: "审计合规意识不足",//缺陷
          description: "在第三题中选择“自行补录模拟附件”属于严重违反审计档案完整性和可追溯性原则的行为，暴露了对审计工作严谨性的理解偏差。应该立即上报主管，启动追溯程序，并记录缺失原因，确保审计证据链真实可靠。",//缺陷详情
        },
        {
          title: "缺乏独立审计实操经验",
          description: "简历中虽提及协助财务核算与流程优化，但未体现参与与独立审计项目，编制底稿或展开实质性审计程序的经验，与岗位要求的审计主导能力存在明显差距。建议通过实习或模拟项目积累真实审计流程经验。",
        }
      ],
      mentorList: [
        {
          marryRate:90,//匹配率
          menName:"David Chen",//导师名称
          lableNames:"Ex-Google PM Career Coach | Behavioral lnterview Specialist",//导师介绍
          rating: 4.5, // 动态评分
          studyCount:95,//学员数量
          successRate:95,//成功率
          // 推荐理由（动态）
          reasons: [
            '精通审计合规与风险报告机制，可针对性解决审计意识不足问题',
            '具备集团及审计制度设计经验，与目标岗位高度匹配',
            '擅长系统性思维训练，能强化对审计闭环管理的理解'
          ],
        },
        {
          marryRate: 85,
          menName: "Emily Wang",
          lableNames: "Former McKinsey Consultant | Case Interview Expert",
          rating: 4.2,
          studyCount: 78,
          successRate: 88,
          reasons: [
            '拥有顶级咨询公司背景，深谙案例面试套路',
            '擅长结构化思维训练，快速提升解题能力',
            '熟悉各行业商业模型，提供实战性建议'
          ],
        },
        {
          marryRate: 88,
          menName: "Michael Zhang",
          lableNames: "Wall Street Quant Analyst | Technical Interview Coach",
          rating: 4.7,
          studyCount: 120,
          successRate: 92,
          reasons: [
            '顶尖投行背景，精通技术面算法',
            '独创解题方法论，快速提升编码能力',
            '熟悉各大公司面试题库，针对性辅导'
          ],
        }
      ],
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
    loadAnalysisData(){
      this.interviewScore = this.$route.query.interviewScore;// 将数据转为字符串传递
      this.expectationPosition = this.$route.query.expectationPosition;// 将数据转为字符串传递
      this.resume = this.$route.query.resume;// 将数据转为字符串传递

      console.log("analysis-question-expectationPosition:",this.expectationPosition);
      console.log("analysis-question-resume:",this.resume);

      // 设置延迟3秒
      setTimeout(async () => {
        try {
        const API_PATH = "/ai/analysis/result";

        const data = {
          resume: JSON.stringify(this.resume),
          expectationPosition: this.expectationPosition,
          // interviewScore: String(this.interviewScore),
        }
        const response = await api.post(API_PATH,data);
        console.log("接口调用成功，返回的数据是：", response);

        // 处理后端返回的Result结构
        const result = response.data;
        console.log("result：", result);
        console.log("result.code:", result.code);
        console.log("result.data：", result.data);

        
        if (result.code === 200 || result.code === 0) {
          this.$router.push({
            path: '/login-load',
            query: { 
              analysisResultData: JSON.stringify(result.data), // 将数据转为字符串传递
              interviewScore: this.interviewScore, // 将数据转为字符串传递
              expectationPosition: this.expectationPosition, // 将数据转为字符串传递
              resume: this.resume // 将数据转为字符串传递
            },
          });
        } else {
          console.error("接口返回错误:", result.msg);
          alert(result.msg || '匹配岗位失败');
        }
      } catch (error) {
        console.error("接口调用失败，错误信息是：", error);
      }
      
        // this.$router.push({path: '/analysis-result',
        // query: {
        //   interviewScore: interviewScore,
        //   expectationPosition: expectationPosition,
        //   resume: resume,
        // }});
      }, 3000); // 3000毫秒 = 3秒
    },
    startProgressAnimation() {
      // 模拟进度条增长
      let progress = 30;
      const interval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress >= 100) {
          progress = 100;
          // window.location.href = '/analysis-result';
        }
        
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