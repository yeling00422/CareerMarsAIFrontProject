<template>
  <div class="loginLoad-page">
    <!-- 报告标题 -->
    <div class="report-head">
      <p class="head-title">你的MBTI测试报告</p>
      <p class="head-desc">基于您的星座与答题结果生成</p>
    </div>

    <div class="middle-container">
      <div class="head-div">
        <div class="mbti-group">{{mbtiResultData.group}}</div>
        <div class="mbti-name">{{mbtiResultData.name}} {{mbtiResultData.type}}</div>
        <div class="mbti-description">{{mbtiResultData.description}}</div>
      </div>
      <!-- 动态遮罩层：从这里开始往下覆盖到底部 -->
      <div class="mask-bottom"></div>
      <div class="middle-div">
        <div class="mbti-title" ref="positionTitle">核心优势<span class="iconfont icon-youshi icon-upgrade"></span></div>
        <div class="mbti-desc" >{{mbtiResultData.advantage}}</div>
        <div class="mbti-title">明显短板<span class="iconfont icon-duanban2 icon-upgrade"></span></div>
        <div class="mbti-desc">{{mbtiResultData.disadvantage}}</div>
        <div class="mbti-title">推荐行业<span class="iconfont icon-hangye icon-upgrade"></span></div>
        <div class="mbti-desc">首选行业：{{mbtiResultData.firstIndustry}}</div>
        <div class="mbti-desc">次选行业：{{mbtiResultData.secondIndustry}}</div>
        <div class="mbti-title">推荐岗位<span class="iconfont icon-gangwei icon-upgrade"></span></div>
        <div class="mbti-desc">首选岗位：{{mbtiResultData.firstPostion}}</div>
        <div class="mbti-desc">次选岗位：{{mbtiResultData.secondPostion}}</div>
        <div class="mbti-title">尽量回避<span class="iconfont icon-huibi icon-upgrade"></span></div>
        <div class="mbti-desc">{{mbtiResultData.avoid}}</div>
        <div class="mbti-title">个人成长 & 职场建议<span class="iconfont icon-tousujianyi icon-upgrade"></span></div>
        <div class="mbti-desc">{{mbtiResultData.suggestion}}</div>
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
  name: 'MBTITestResult',
  data() {
    return {
      resumeText: '',  
      mbtiResultData: '',
      mbtiResult: '',
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
  const parent = el.closest('.middle-container')
  const rect = el.getBoundingClientRect()
  const parentRect = parent.getBoundingClientRect()

  // 元素相对父容器的顶部距离
  let relativeTop = rect.top - parentRect.top
  // 加上标题自身高度，让遮罩在标题完全下面
  relativeTop += rect.height
  // 额外加一点间距，避免紧贴标题
  relativeTop += 0

  // rem 换算
  const remBase = parseFloat(document.documentElement.style.fontSize)
  const finalTopRem = relativeTop / remBase

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
      const mbtiResultDataStr = this.$route.params.mbtiResultDataStr;
      this.mbtiResult = this.$route.params.mbtiResult;
      // 新增：解析接口返回的JSON数据
      if (mbtiResultDataStr) {
        try {
          this.mbtiResultData = JSON.parse(mbtiResultDataStr);
          this.resumeText = this.$route.params.resumeText;
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
        name: 'LoginByPhonePassword',
        params: { 
          mbtiResultDataStr: JSON.stringify(this.mbtiResultData ),
          resumeText: this.resumeText,
          mbtiResult: this.mbtiResult,
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
  font-size: 4rem;
}

.head-div {
  position: relative;
  height: auto;
  min-height: 30rem;
  padding: 3rem;
  width: 80rem;
  margin-top: 2rem;
  background-color: #646464;
	border-radius: 5rem;
	border: #00F5D4 solid 0.5rem;
  font-size: 3.5rem;
  color: #fff;
}

.mbti-group{
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  font-size: 4.5rem;
}

.mbti-name{
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  font-size: 4.5rem;
}

.mbti-description{
  margin-top: 2rem;
  margin-bottom: 2rem;
  font-size: 3.5rem;
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

.middle-div{
  margin-top: 5rem;
  margin-bottom: 5rem;
  padding: 5rem;
}

.mbti-title {
  position: relative;
  margin-bottom: 3rem;
  display: flex;
  items-align: center;
  justify-content: center;
  font-size: 5rem;
  font-weight: bold;
  color: #000;
}

.mbti-desc {
  margin-bottom: 5rem;
	border: #FFCB24 solid 0.5rem;
  border-radius: 3rem;
  padding: 3rem;
  background-color: #9E9E9E;
  color: #fff;
  font-size: 4rem;
}

.icon-upgrade {
  font-size: 6.5rem;
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
  position: relative; 
  display: flex; 
  align-items: center; 
  border-color: #fff;
  margin: 5rem auto;
}

.icon-denglu{
  position: relative;
  font-size: 7rem;
  color: #01F5D4;
  right: 69rem;
}

.free-analysis-btn {
  border: 0.5rem solid #53E4C7;
  transition: transform 0.15s ease, 
  box-shadow 0.2s ease;
  animation: cardGlow 3s ease-in-out infinite;
  background: #595959;
  width: 50rem; 
  height: 10rem; 
  color: white;
  border-radius: 5rem; 
  font-size: 4.5rem; 
  cursor: pointer;
  transition: all 0.3s ease;
  padding-left: 5rem;
  margin: 0 auto;
}

.free-analysis-btn:active {
  transform: scale(0.96);
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

.icon-youshi{
  color: green;
}

.icon-duanban2{
  color: red;
}

.icon-hangye{
  color: green;
}

.icon-gangwei{
  color: green;
}

.icon-huibi{
  color: red;
}

.icon-tousujianyi{
  color: green;
}
</style>