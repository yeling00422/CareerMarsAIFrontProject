<template>
  <div class="testQuestionResult-page">
    <!-- 报告标题 -->
    <div class="report-title">
      <p class="head-text">你的职业准备度分析</p>
      <p class="head-next-text">基于简历、岗位匹配和面试表现的综合评估</p>
    </div>

    <div class="middle-container">
      <!-- 综合评分 -->
      <div class="main-score">
        <!-- ★★ 修改1：给svg加上【正确的viewBox】，这是尺寸一致的核心，永不断裂 -->
        <svg class="progress-ring" viewBox="0 0 100 100">
          <circle class="progress-ringbackground"/>
          <circle class="progress-ringcircle" :stroke-dasharray="circumference" :stroke-dashoffset="strokeDashoffset"/>
        </svg>
        <p class="score-label">综合评分</p>
        <p class="score-number"><span class="main-number">{{ avgScore }}</span>%</p>
      </div>
      <!-- 三个小矩形框 -->
      <div class="mini-scores">

        <div class="mini-score-item">
          <span class="iconfont icon-qiyewenhua"></span>
          <div class="mini-score-value">{{ culturalCompatibility }}%</div>
          <div class="mini-score-label">文化契合度</div>

          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: this.culturalCompatibility + '%' }"></div>
          </div>
        </div>
        <div class="mini-score-item">
          <span class="iconfont icon-gongju"></span>
          <div class="mini-score-value">{{resumeMatchingScore }}%</div>
          <div class="mini-score-label">技能匹配度</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: resumeMatchingScore + '%' }"></div>
          </div>
        </div>
        <div class="mini-score-item">
          <span class="iconfont icon-ceshishenqing"></span>
          <div class="mini-score-value">{{interviewScore }}%</div>
          <div class="mini-score-label">面试表现</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width:interviewScore + '%' }"></div>
          </div>
        </div>
      </div>


      <!-- 综合表现对比 -->
      <div class="comparison-section">
        <p class="comparison-text">你的综合表现超过了<span class="comparison-text-span">{{overallPerformance}}%</span>的同类候选人</p>
      </div>

      <div class="six-title">个人能力图</div>

      <div class="six-div">
        <svg viewBox="0 0 200 200" class="hexagon-svg">
          <!-- ✅ 1️⃣ 多层虚线圆环（半径20/40/60/80/100） -->
          <circle
            v-for="r in [0,20,40,60,80,100]"
            :key="r"
            cx="100"
            cy="100"
            :r="r"
            fill="none"
            stroke="#aaa"
            stroke-width="1"
            stroke-dasharray="4 2"
          />

          <!-- ✅ 2️⃣ 圆环上的分数标注（位置更精准） -->
          <text
            v-for="(r, index) in [0,20,40,60,80,100]"
            :key="'label-' + index"
            :x="100"
            :y="100 - r - 4"
            font-size="3rem"
            fill="#aaa"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ r }}
          </text>

          <!-- ✅ 3️⃣ 背景六边形（6边形，半径80） -->
          <polygon
            v-for="(item, index) in personalAbility"
            :key="'bg-' + index"
            :points="getHexagonPoints(6, 80, index)"
            fill="none"
            stroke="#666"
            stroke-width="1"
          />

          <!-- ✅ 4️⃣ 数据填充六边形（根据score动态计算） -->
          <polygon
            :points="dataPoints"
            fill="rgba(0, 245, 212, 0.6)"
            stroke="#00F5D4"
            stroke-width="2"
          />

          <!-- ✅ 5️⃣ 能力名称标签（白色，居中） -->
          <text
            v-for="(item, index) in personalAbility"
            :key="'text-' + index"
            :x="getTextX(index)"
            :y="getTextY(index)"
            font-size="3rem"
            fill="#fff"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ item.ability +'：' + item.score }}
          </text>
        </svg>
        <button class="reGender-button" v-show="!personalAbilityResult" @click="reGeneratePersonalAbilityChart">个人能力图生成失败。点击重试</button>
      </div>

      <!-- 提升空间 -->
      <div class="improvement-section">
        <div class="improvement-title">你的提升空间<span class="iconfont icon-gongju icon-upgrade"></span></div>
        <div class="end-box" v-for="(improvement, index) in improvements" :key="index">
          <span class="end-title">{{ improvement.title }}</span>
          <div class="end-text">{{ improvement.description }}</div>
        </div>
      </div>
    </div>

    <div class="button-section">
      <button class="free-analysis-btn" @click=goNext>下一页</button>
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
  name: 'TestQuestionResult',
  data() {
    return {
      position: '',  // 期望岗位
      resumeText: '',  // 简历
      avgScore: 0,// 综合评分50
      educationalScore:0, // 教育背景分0
      resumeMatchingScore: 0,  // 技能匹配度
      culturalCompatibility: 0,  // 学历匹配度
      interviewScore: 0,  // 面试表现分80
      overallPerformance: 0,  // 综合表现：超越了36%的同类候选人
      improvements: [],
      userInfo: null,
      personalAbility:null,
      personalAbilityResult:false,
    }
  },
  computed: {

    dataPoints() {
      if (!Array.isArray(this.personalAbility)) {
        return '';
      }

      return this.personalAbility
        .slice(0, 6)
        .map((item, index) => {
          const score = item.score;
          const angle = (Math.PI * 2 / 6) * index - Math.PI / 2;
          const radius = score;

          const x = 100 + radius * Math.cos(angle);
          const y = 100 + radius * Math.sin(angle);

          return `${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(' ');
    },
    circumference() {
      const radius = 40; 
      return Math.PI * radius * 2;
    },
    // 计算前景圆的偏移量，实现进度效果
    strokeDashoffset() {
      const progress = this.avgScore / 100;
      const offset = this.circumference * (1 - progress);
      return offset;
    }
  },
  created() {
    // 组件创建时自动加载数据
    this.loadAnalysisData();
  },
  methods: {
    async reGeneratePersonalAbilityChart() {
      console.log("重新生成个人能力图");
      alert('正在重新生成个人能力图，请稍后...');
      try {
        const response = await api.post(
          "/ai/generate/personalAbility",
          this.resumeText,
          {
            headers: {
              'Content-Type': 'text/plain;'
            }
          }
        );

        const result = response.data;
        console.log("接口返回结果:", result);

        // ✅ 第一层兜底：接口没返回
        if (!result) {
          alert('个人能力图生成失败！');
          return;
        }

        // ✅ 第二层兜底：code 不存在
        if (result.code !== 200) {
          alert(result.msg || '个人能力图生成失败！');
          return;
        }

        // ✅ 第三层兜底：data 为空
        if (
          !result.data ||
          result.data === '' ||
          result.data === '[]'
        ) {
          alert('个人能力图数据为空！');
          return;
        }

        // ✅ 正常解析
        this.personalAbility = result.data.personalAbility.slice();
        this.personalAbilityResult = true;
        alert('个人能力图生成成功！');
      } catch (error) {
        console.error("重新生成个人能力图失败", error);
        alert('个人能力图生成失败，请稍后重试！');
      }
    },
      // ✅ 计算六边形顶点坐标（n边形，半径r，第i个顶点）
    getHexagonPoints(n, r, i) {
      const angle = (Math.PI * 2 / n) * i - Math.PI / 2;
      const x = 100 + r * Math.cos(angle);
      const y = 100 + r * Math.sin(angle);
      return `${x},${y}`;
    },

    // 文本 X 坐标
    getTextX(index) {
      const angle = (Math.PI * 2 / 6) * index - Math.PI / 2;
      return 100 + 120 * Math.cos(angle);
    },

    // 文本 Y 坐标
    getTextY(index) {
      const angle = (Math.PI * 2 / 6) * index - Math.PI / 2;
      return 100 + 120 * Math.sin(angle);
    },
    loadAnalysisData() {
      // 从路由参数中获取数据
      this.personalAbilityResult = false;
      this.interviewScore = Number(this.$route.query.interviewScore);
      const testQuestionResultData = this.$route.query.testQuestionResultData;
      this.resumeText = this.$route.query.resumeText;
      this.position = this.$route.query.position;
      this.userInfo = this.$route.query.userInfo;
      this.personalAbility = this.$route.query.personalAbility;
      if(this.personalAbility !== null && this.personalAbility !== '[]' && this.personalAbility !== undefined && this.personalAbility !== ''){
        this.personalAbilityResult = true;
      }
      console.log("personalAbilityResult:", this.personalAbilityResult);
      console.log("personalAbility:", this.personalAbility);
      // 新增：解析接口返回的JSON数据
      if (testQuestionResultData) {
        try {
          const resultData = JSON.parse(testQuestionResultData);
          console.log("解析后的数据:", resultData);
          // 赋值给对应的字段
          this.culturalCompatibility = resultData.culturalCompatibility;
          this.resumeMatchingScore = resultData.resumeMatchingScore;
          this.overallPerformance = resultData.overallPerformance;
          this.improvements = resultData.improvements;
          this.avgScore = Math.trunc((this.culturalCompatibility + this.resumeMatchingScore + this.interviewScore) / 3);
          console.log("avgScore:", this.avgScore);
          console.log("culturalCompatibility:", this.culturalCompatibility);
          console.log("resumeMatchingScore:", this.resumeMatchingScore);
          console.log("interviewScore:", this.interviewScore);
          console.log("overallPerformance:", this.overallPerformance);
          console.log("improvements:", this.improvements);
        } catch (error) {
          console.error("解析testQuestionResultData失败:", error);
        }
      }
    },
    async goNext() {
      this.$router.push({
        path: '/end-load',
        query: { 
          resumeText: this.resumeText,
          position: this.position,
          userInfo: this.userInfo,
        },
      });
    }
  }
}
</script>

<style scoped>

.report-title {
  text-align: center;
  margin-top: 15rem;
  margin-bottom: 10rem;
}

.head-text {
  color: #000000;
  font-size: 8rem;
  font-weight: 1000;
}

.head-next-text {
  color: #666;
  font-size: 3rem;
  margin-top: -8rem;
}

.middle-container{
  position: relative;
  top: -7rem;
  left: 0rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
  height: auto;
  min-height: 120rem;
  margin: auto;
  border-radius: 5rem;
  background-color: #E9E9E9;
}

.progress-ring{
  /* ★★ 修改4：圆环核心样式，固定宽高+居中，所有尺寸大小一致，永不变化 */
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

.progress-ringbackground{
  stroke:#e6e6e6;
  stroke-width:1rem;
  fill:transparent;
  /* ★★ 修改5：cx/cy/r 对应 viewBox 0 0 100 100，圆心永远在正中间，永不偏移 */
  r:40;
  cx:50;
  cy:50;
}

.progress-ringcircle{
  stroke:#00F5D4;
  stroke-width:1rem;
  fill:transparent;
  r:40;
  cx:50;
  cy:50;
  /* ★★ 修改6：新增2行，圆环从顶部12点开始，视觉最佳，进度条无错位 */
  transform-origin: 50% 50%;
  transform: rotate(-90deg);
  /* 可选：进度变化有平滑过渡动画 */
  transition: stroke-dashoffset 0.6s ease;
}

.main-score {
  position: relative;
  top:3rem;
  height: 30rem;
  /* ★★ 修改7：百分比宽度+最大宽度，适配所有屏幕，容器大小协调 */
  width: 90%;
  max-width: 80rem;
  background-color: #646464;
	border-radius: 5rem;
	border: #00F5D4 solid 0.5rem;
	box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
  /* 内部内容垂直居中，解决定位偏移 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-label {
  position: absolute;
  font-size: 3rem;
  color: #fff;
  top: 4rem;
}

.score-number {
  position: absolute;
  font-size: 4rem;
  color: #00F5D4;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  top: -2rem;
}

.main-number{
  font-size: 10rem;
  font-weight: bold;
  color: #00F5D4;
}

.mini-scores {
  display: flex;
  justify-content: space-around;
  position: relative;
  gap: 2rem;
  /* ★★ 修改8：和main-score统一宽度规则，整体布局协调 */
  width: 90%;
  max-width: 80rem;
  height: 15rem;
  margin: auto;
  top: 6rem;
}

.mini-score-item {
  background: #9E9E9E;
  padding: 2rem;
  border-radius: 2rem;
  border: #00F5D4 solid 0.5rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
}

.mini-score-value {
  position: relative;
  font-size: 4rem;
	font-weight: bold;
	color: #00F5D4;
	margin-bottom: 0.5rem;
	top: -9rem;
	/* right: -10rem; */
  left: 10rem;
}

.mini-score-label {
 	position: relative;
	top: -10rem;
	/* right: -9rem; */
	left: 9rem;
	font-size: 2.5rem;
	color: #F2F2F2
}

.progress-bar{
  position: relative;
	height: 1rem;
	width: 20rem;
	top: -8.5rem;
	/* right: -1rem; */
  left: 1rem;
	background-color: #e0e0e0;;
	border-radius: 0.5rem;
	overflow: hidden;
}

.progress-fill {
  
	height: 100%;
	background-color: #00F5D4;
	border-radius: 0.5rem;
}

.iconfont{
  position: relative;
	font-size: 8rem;
	color: #fff;
	top: 0rem;
	right: -0rem;
}

.comparison-section {
  top: 10rem;
  position: relative;
  height: 10rem;
  /* 和上面统一宽度规则 */
  width: 90%;
  max-width: 80rem;
  background: #646464;
	border-radius: 2rem;
	border: #00F5D4 solid 0.5rem;
	box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
	text-align: center;
  margin-bottom: 13rem;
}

.comparison-text {
  position: relative;
	top: -1rem;
	font-size: 3rem;
	color: #fff;
}

.comparison-text-span {
	font-size: 4rem;
	color: #00F5D4;
}

/* .six-div{
  position: relative;
  width: 90%;
  height: 50rem;
  background-color: #646464;
  border: #00F5D4 solid 0.5rem;
  border-radius: 2rem;
} */

.six-div {
  position: relative;
  width: 90%;
  height: 70rem;
  background-color: #646464;
  border: #00F5D4 solid 0.5rem;
  border-radius: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.six-title {
  position: relative;
  font-size: 5rem;
  color: #000;
  margin-bottom: 3rem;
  font-weight: 600;
}

.reGender-button{
  position: absolute;
  top: auto;
  left: auto;
  width: 60rem;
  height: 6rem;
  border-radius: 2rem;
  color: #fff;
  background-color: #595959;
  border: #00F5D4 solid 0.5rem;
}

.hexagon-svg {
  position: relative;
  width: 50rem;
  height: 50rem;
  overflow: visible; 
}

.improvement-section {
  position: relative;
	/* margin-top: 10rem;  */
	margin-bottom: 0rem; 
  width: 90%;
  max-width: 80rem;
	height: auto;
}

.improvement-title {
  margin-left: 22rem;
  position: relative;
  top: 2rem;
  font-size: 5rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 5rem;
}

.icon-upgrade {
  font-size: 5rem;
  color: #FFCB24;
  margin-left: 2rem;
}

.end-box{
  width: 98%;
  height: auto;
  background-color: #9E9E9E;
  border-radius: 2rem;
	border: #FFCB24 solid 0.5rem;
	box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
  margin-left: 0.5rem;
  margin-bottom: 4rem;
  padding-bottom: 2rem;
}

.end-title{
  margin-left: 3rem;
  font-size: 4rem;
  font-weight: bold;
  color: #FFCB24;
}

.end-text{
  margin-left: 3rem;
  margin-top: 1rem;
  font-size: 3rem;
  color: #fff;
}

/* 按钮区域：用 Flex 布局替代固定 top，避免位置错乱 */
.button-section {
  width: 20rem;
  margin-left: 40rem;
  position: relative; 
  display: flex; /* 新增：Flex 布局让按钮和图标对齐 */
  margin-bottom: 3rem;
  align-items: center; 
}

/* 图标：用 rem 调整间距 */
.icon-sanjiaoxing {
  font-size: 3rem;
  color: #01F5D4;
  margin-left: -10rem; /* -50px ÷ 3.75 ≈ -13.33rem */
}

/* 按钮：用 rem 调整尺寸和边距 */
.free-analysis-btn {
  background: #595959;
  width: 40rem; 
  height: 8rem; 
  color: white;
  border: none;
  border-radius: 2.67rem; /* 10px ÷ 3.75 ≈ 2.67rem */
  font-size: 4rem; 
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: -10rem; 
}



</style>