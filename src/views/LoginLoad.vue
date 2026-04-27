<template>
  <div class="loginLoad-page">
    <!-- 报告标题 -->
    <div class="report-head">
      <p class="head-title">你的性格测试报告</p>
      <p class="head-desc">ai基于您的答题结果生成</p>
    </div>

    <div class="middle-container">
      <div class="head-div">
        <span class="report-text">{{this.testReportText}}</span>
      </div>
      
      <div class="position-title" ref="positionTitle">ai推荐岗位<span class="iconfont icon-gongju icon-upgrade"></span></div>
       <!-- 动态遮罩层：从这里开始往下覆盖到底部 -->
        <div class="mask-bottom"></div>

      <div class="position-div">
        <div class="end-box" v-for="(position, index) in positions" :key="index">
          <div class="first-line">
            <span class="position-name">{{ position.positionName }}</span>
            <div class="stars">
              <span v-for="n in 5" :key="n" class="star" :class="getStarClass(n, position.matchDegree)">
                <span class="iconfont icon-xingxing star-stroke"></span>
                <span class="iconfont icon-xingxing star-fill" :style="getStarStyle(n, position.matchDegree)"></span>
              </span>
            </div>
          </div>
          <div class="position-score">岗位推荐得分：{{ position.matchDegree }}</div>
          <div class="position-desc">推荐理由：{{ position.reasonsForRecommendation }}</div>
        </div>
        </div>
    </div>

    <div class="button-section">
      <button class="free-analysis-btn" @click=goNext>登录后查看详情</button>
      <span class="iconfont icon-denglu"></span>
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
  name: 'LoginLoad',
  data() {
    return {
      testReportText: '',  
      resumeText: '',  
      positions: [],
    }
  },

  created() {
    // 组件创建时自动加载数据
    this.loadAnalysisData();
  },
  methods: {
    setMaskTop() {
      const el = this.$refs.positionTitle
      if (!el) return
      // 1. 获取元素相对于父容器 .middle-container 的高度（px）
      const rect = el.getBoundingClientRect()
      const parentRect = el.parentElement.getBoundingClientRect()
      const relativeTop = rect.top - parentRect.top
      
      // 2. 加上标题自身高度 + 间距，确保标题完全露出
      const titleHeight = rect.height
      const finalTopPx = relativeTop + titleHeight 
      
      // 3. 换算成 rem（用项目真实根字体，100% 适配）
      const remBase = parseFloat(document.documentElement.style.fontSize)
      const finalTopRem = finalTopPx / remBase
      
      // 4. 设置遮罩位置
      document.documentElement.style.setProperty('--mask-top', finalTopRem + 'rem')
    },
    getStarClass(index, matchDegree) {
      const starCount = matchDegree / 20; // 100 → 5, 90 → 4.5
      const starValue = index;

      if (starCount >= starValue) {
        return 'full';
      } else if (starCount > starValue - 1) {
        return 'half';
      } else {
        return 'empty';
      }
    },

    /**
     * 控制半星的裁剪
     */
    getStarStyle(index, matchDegree) {
      const starCount = matchDegree / 20;
      const base = index - 1;
      const current = starCount - base;

      if (current <= 0) {
        return {
          color: '#595959', // 空星
        };
      } else if (current >= 1) {
        return {
          color: '#ffcb24', // 满星
        };
      } else {
        // 半星
        return {
          color: '#ffcb24',
          'clip-path': `inset(0 ${100 - current * 100}% 0 0)`,
        };
      }
    },
    loadAnalysisData() {
      // 从路由参数中获取数据
      const testReport = this.$route.query.testReport;
      // 新增：解析接口返回的JSON数据
      if (testReport) {
        try {
          const resultData = JSON.parse(testReport);
          this.testReportText = resultData.testReportText;
          this.resumeText = this.$route.query.resumeText;
          this.positions = resultData.recommendedPositionList;
          console.log("positions:", this.positions);
          this.$nextTick(() => {
            this.setMaskTop()
          });
        } catch (error) {
          console.error("解析analysisResultData失败:", error);
        }
      }
    },
    async goNext() {
      this.$router.push({
        path: '/login-by-phone-password',
        query: { 
          testReportText: this.testReportText,
          resumeText: this.resumeText,
          positions: this.positions,
        },
      });
    }
  }
}
</script>

<style scoped>

.mask-bottom {
  position: absolute;
  left: 0;
  top: var(--mask-top);
  width: 100%;
  bottom: 0;
  background: linear-gradient(
    to bottom, 
    rgba(0, 0, 0, 0),  
    rgba(0, 0, 0, 0.8)  
  );
  backdrop-filter: blur(1rem);
  z-index: 5;
  pointer-events: none;
}

.report-head {
  position: relative;
  text-align: center;
  margin-bottom: 2rem;
  margin-top: 15rem;
}

.head-title {
  color: #000000;
  font-size: 8rem;
  font-weight: 1000;
}

.head-desc {
  color: #666;
  font-size: 4rem;
  margin-top: -8rem;
}

.middle-container{
  position: relative;
  width: 90%;
  height: auto;
  min-height: 120rem;
  background-color: #E9E9E9;
  border-radius: 5rem;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.head-div {
  position: relative;
  height: auto;
  min-height: 30rem;
  padding: 2rem;
  width: 80rem;
  margin-top: 2rem;
  background-color: #646464;
	border-radius: 5rem;
	border: #00F5D4 solid 0.5rem;
}

.report-text{
  font-size: 3.5rem;
  color: #fff;
}

.comparison-section {
  top: 10rem;
  position: relative;
  height: 10rem;
  width: 90%;
  max-width: 80rem;
  background: #646464;
	border-radius: 2rem;
	border: #00F5D4 solid 0.5rem;
	box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
	text-align: center;
}

.position-title {
  position: relative;
  margin-top: 2rem;
  font-size: 5rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 3rem;
}

.icon-upgrade {
  font-size: 5rem;
  color: #FFCB24;
  margin-left: 2rem;
}

.position-div {
  position: relative;
  width: 85rem;
	height: auto;
}

.end-box{
  width: 98%;
  height: auto;
  background-color: #9E9E9E;
  border-radius: 2rem;
	border: #FFCB24 solid 0.5rem;
	box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
  margin-bottom: 4rem;
}

.first-line{
  display: flex;
  margin-top: 2rem;
}

.position-name{
  margin-left: 3rem;
  margin-right: 3rem;
  font-size: 5rem;
  font-weight: bold;
  color: #FFCB24;
}

.position-score{
  margin-left: 3rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 4rem;
  color: #fff;
}

.position-desc{
  margin-left: 3rem;
  margin-bottom: 2rem;
  font-size: 3rem;
}

.button-section {
  z-index: 10;
  margin-left: 22rem;
  position: relative; 
  display: flex; 
  margin-top: 3rem;
  margin-bottom: 3rem;
  align-items: center; 
  border-color: #fff;
}

.icon-denglu{
  font-size: 7rem;
  color: #01F5D4;
  margin-left: -48rem; 
}

.free-analysis-btn {
  border: #fff solid 0.5rem;
  background: #595959;
  width: 50rem; 
  height: 10rem; 
  color: white;
  border-radius: 2.67rem; 
  font-size: 4.5rem; 
  cursor: pointer;
  transition: all 0.3s ease;
  padding-left: 5rem;
}

.star {
  position: relative;
  display: inline-block;
  top: 0.8rem;
}

.star-stroke {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 5rem;
  color: #595959; 
  -webkit-text-stroke: 0.1rem #fff;
}

.star-fill {
  position: relative;
  z-index: 1; 
  font-size: 5rem;
  -webkit-text-stroke: 0.1rem #fff; 
}

</style>