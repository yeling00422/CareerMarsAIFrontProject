<template>
  <div class="home-container">
    <!-- 顶部固定栏 -->
    <div class="head-container">
      <img src="../assets/img/上面固定栏.png" class="logo" alt="CareerMars" />
    </div>

    <div class="icon-page">
      <span class="iconfont icon-Gc_05_public-DoubleRightOutlined" @click="lastPage"></span>
      <span class="iconfont icon-Gc_06_public-DoubleRightOutlined" @click="nextPage"></span>
    </div>

    <!-- 中间容器：职业咨询服务卡片 -->
    <div class="middle-container">

      <!-- 右上角匹配度标签 -->
        <div class="match-tag">
          <div class="match-tag-text">
            <span class="iconfont icon-xunzhang1"></span>{{ currentTeacher.marryRate}}% 匹配
          </div>
        </div>

        <!-- 个人信息区 -->
        <div class="profile-section">
          <!-- 头像占位 -->
          <!-- <div class="avatar"></div> -->
          <div class="name-div">
            <h2 class="name">{{  currentTeacher.menName }}</h2>
          </div>
          <div class="title-div">
            <p class="title">{{  currentTeacher.lableNames }}</p>
          </div>
          <hr class="line">
          <!-- 评分和学员数 -->
          <div class="rating-info">
            <div class="rating-left">
              <div class="stars">
                <span v-for="n in 5" :key="n" class="star" :class="getStarClass(n)">
                  <!-- 外层：负责描边（始终完整） -->
                  <span class="iconfont icon-xingxing star-stroke"></span>
                  <!-- 内层：负责填充（半星时裁剪） -->
                  <span class="iconfont icon-xingxing star-fill" :style="getStarStyle(n)"></span>
                </span>
              </div>
              <span class="rating-score">{{  currentTeacher.rating }}</span>
            </div>
            <div class="rating-right">
              <span class="iconfont icon-renyuan"></span>
              <span class="student-number">{{  currentTeacher.studyCount }}</span>
              <span class="students">学员</span>
            </div>
          </div>

          <!-- 成功率 -->
          <div class="rating-rate">
            <span class="iconfont icon-zhengque"></span>
            <span class="success-rate">{{ currentTeacher.successRate}}%</span>
            <span class="success-text">成功率</span>
          </div>
          <hr class="line">
        </div>

        <!-- 推荐理由 -->
        <div class="reasons-section">
          <span class="reasons-title">为什么推荐 {{  currentTeacher.menName }}:</span>
          <ul>
            <li v-for="(reason, index) in currentTeacher.reasons" :key="index"><span class="li-text">{{ reason }}</span></li>
          </ul>
        </div>

        <!-- 学员反馈 -->
        <div class="feedback-section">
          <div class="feedback-top">
            <span class="iconfont icon-ceshishenqing"></span>
            <span class="feedback-title">学员反馈:</span>
          </div>
          <!-- <div class="feedback-text">
            “{{ currentTeacher.feedback }}”
          </div> -->
        </div>

        <!-- 底部按钮 -->
        <div class="btn-div">
          <button class="consult-btn" @click="goToConsult">预约免费咨询</button>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getIp } from '@/utils/index';

const ip = getIp();
const baseURL = `http://${ip}:8180`;


export default {
  name: 'CareerReadinessReport',
  data() {
    return {
      currentPage: 1, 
      // teachers: [
      //   {
      //     marryRate:90,//匹配率
      //     name:"David Chen",//导师名称
      //     intriduce:"Ex-Google PM Career Coach | Behavioral lnterview Specialist",//导师介绍
      //     rating: 4.5, // 动态评分
      //     studentNumber:95,//学员数量
      //     successRate:95,//成功率
      //     // 推荐理由（动态）
      //     reasons: [
      //       '精通审计合规与风险报告机制，可针对性解决审计意识不足问题',
      //       '具备集团及审计制度设计经验，与目标岗位高度匹配',
      //       '擅长系统性思维训练，能强化对审计闭环管理的理解'
      //     ],
      //     // 学员反馈（动态）
      //     feedback: 'I came from a second-tier university and thought I had no chance at top companies. With David’s guidance, I landed offers from Google and Amazon.'
      //   },
      //   {
      //     marryRate: 85,
      //     name: "Emily Wang",
      //     intriduce: "Former McKinsey Consultant | Case Interview Expert",
      //     rating: 4.2,
      //     studentNumber: 78,
      //     successRate: 88,
      //     reasons: [
      //       '拥有顶级咨询公司背景，深谙案例面试套路',
      //       '擅长结构化思维训练，快速提升解题能力',
      //       '熟悉各行业商业模型，提供实战性建议'
      //     ],
      //     feedback: 'As a non-target school student, I struggled with case interviews. Emily helped me land an offer from BCG!'
      //   },
      //   {
      //     marryRate: 88,
      //     name: "Michael Zhang",
      //     intriduce: "Wall Street Quant Analyst | Technical Interview Coach",
      //     rating: 4.7,
      //     studentNumber: 120,
      //     successRate: 92,
      //     reasons: [
      //       '顶尖投行背景，精通技术面算法',
      //       '独创解题方法论，快速提升编码能力',
      //       '熟悉各大公司面试题库，针对性辅导'
      //     ],
      //     feedback: 'Michael helped me go from failing all tech interviews to getting a 500k offer from a FAANG company!'
      //   }
      // ],
      teachers:[],
    };
  },
  created() {
    // 组件创建时自动加载数据
    this.loadResultData();
  },
  methods: {
    goToConsult() {
      console.log('咨询导师：',window.location.hostname);
    },
    getStarClass(index) {
      const starValue = index; // 当前是第几颗星（1~5）
      if (this.currentTeacher.rating >= starValue) {
        return 'full'; // 全黄
      } else if (this.currentTeacher.rating > starValue - 1) {
        return 'half'; // 半黄
      } else {
        return 'empty'; // 空
      }
    },
    getStarStyle(index) {
      const starNumber = index;
      const baseScore = starNumber - 1;
      const currentScore = this.currentTeacher.rating - baseScore;
      
      if (currentScore <= 0) {
        return { 
          color: '#595959',
        };
      } else if (currentScore >= 1) {
        return { 
          color: '#ffcb24',
        };
      } else {
        // 半星或部分星
        return { 
          color: '#ffcb24',
          'clip-path': `inset(0 ${100 - (currentScore * 100)}% 0 0)`
        };
      }
    },
    lastPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        console.log(`进入第 ${this.currentPage}页`);
      } else {
        console.log('当前已经是第一页了！');
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        console.log(`进入第 ${this.currentPage}页`);
      } else {
        console.log('当前已经是最后一页了');
      }
    },
    loadResultData(){
      // 从路由参数中获取数据
      this.teachers = JSON.parse(this.$route.query.teachers);
      // const teachers = JSON.parse(teachers);  // 解析JSON字符串
      console.log("end-result-teachers:",this.teachers);
    }
  },
  computed: {
    // 获取当前导师（分页逻辑）
    currentTeacher() {
      return this.teachers[this.currentPage - 1]; 
    },
    totalPages() {
      return this.teachers.length;
    }
  }
};
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
  width: 100%;
}

.icon-page{
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  top: 80rem;
}

.icon-Gc_05_public-DoubleRightOutlined{
  font-size: 5rem;
}

.icon-Gc_06_public-DoubleRightOutlined{
  font-size: 5rem;
}

.middle-container {
  position: relative;
  top: 5rem;
  display: flex;
  flex-direction: column;
  width: 80rem;
  height: auto;
  margin: auto;
  border-radius: 5rem;
  background-color: #595959;
  border: #00f5d4 solid 0.5rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
  padding-left: 5rem;
  padding-right: 5rem;
  margin-bottom: 15rem;
}


/* 匹配度标签 */
.match-tag {
  position: absolute;
  width: 22rem;
  height: 6rem;
  top: 4rem;
  right: 3rem;
  background: #595959;
  border: #00f5d4 solid 1rem;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4rem;
  font-weight: bold;
}



.match-tag-text {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #00f5d4;
  font-size: 3.5rem;
  margin: 0;
}

.icon-xunzhang1{
  color: #FFCB24;
  font-size: 3rem;
  margin-left: -1rem;
  margin-right: 1rem;
}

/* 个人信息区 */
.profile-section {
  margin-bottom: 2rem;
  margin-top: 40rem;
}

.avatar {
  width: 8rem;
  height: 8rem;
  background: #ccc;
  border-radius: 50%;
  margin: 0 auto 1rem;
}

.name-div{
  display: flex;
  position: relative;
  top: -25rem;
}
.name {
  font-size: 8rem;
  font-weight: 900;
  color: #fff;
  margin: 0;
}

.title-div {
  width: 100%;
  height: 20rem;
  position: relative;
  top: -25rem;
}

.title {
  font-size: 4rem;
  color: #BAC8C5;
}

.line{
  position: relative;
  top: -20rem;
  right: 2rem;
  width: 100%;
}
.rating-info {
  position: relative;
  top: -18rem;
  display: flex;
  width: 100%;
  height: 10rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 1rem 0;
}



.icon-xingxing {
  color: #ccc;
  font-size: 5rem;
  margin-right: 1rem;
}

.rating-score {
  position: relative;
  top: -3.5rem;
  margin-left: 32rem;
  font-weight: bold;
  font-size: 5rem;
  color: #00f5d4;
}

.rating-right{
  position: relative;
  display: flex;
  align-items: center;
  top: -1rem;
}

.icon-renyuan{
  margin-right: 2rem;
  font-size: 5rem;
  color: #fff;
}

.student-number{
  margin-right: 2rem;
  font-size: 5rem;
  font-weight: 800;
  color: #00f5d4;
}

.students {
  color: #fff;
  font-size: 4rem;
}

.rating-rate {
  position: relative;
  top: -20rem;
  width: 100%;
  height: 10rem;
  display: flex;
  align-items: center;
  font-size: 2rem;
  color: #00f5d4;
}

.icon-zhengque{
  font-size: 5rem;
  color: #fff;
}

.success-rate{
  margin-left: 2rem;
  font-size: 5rem;
  color: #00f5d4;
  font-weight: 800;
}

.success-text{
  margin-left: 2rem;
  font-size: 4rem;
  color: #fff;
}

.reasons-section{
  position: relative;
  top: -20rem;
  width: 95%;
  height: 10rem;
  margin-bottom: 5rem;
}

/* 推荐理由 */
.reasons-title {
  font-size: 5rem;
  color:#fff;
  font-weight: 800;
  margin-bottom: 1rem;
}


.reasons-section ul {
  padding-left: 5rem;
  font-size: 3rem;
  color: #00f5d4;
}

.reasons-section li {
  margin-bottom: 2rem;
}

.li-text{
  color: #fff;
}

/* 学员反馈 */
.feedback-section {
  width: 95%;
  height: 30rem;
  background-color: #C7C8C8;
  margin-top: 10rem;
  margin-bottom: 5rem;
  border-radius: 5rem;
  padding-top: 2rem;
}

.feedback-top{
  display: flex;
  align-items: center;
}

.icon-ceshishenqing{
  margin-left: 2rem;
  font-size: 5rem;
  margin-bottom: 1rem;
}

.feedback-title {
  margin-left: 2rem;
  font-size: 4rem;
  color: #999;
  margin-bottom: 1rem;
}

.feedback-text {
  padding: 2rem;
  font-size: 3rem;
  color: #333;
  font-style: italic;
}

/* 按钮 */
.consult-btn {
  width: 50rem;
  height: 10rem;
  background: #00f5d4;
  color: #999;
  border: none;
  border-radius: 5rem;
  padding: 1.5rem;
  font-size: 4rem;
  margin-left: 12rem;
  margin-bottom: 5rem;
}



/* 星星容器：相对定位，让内外层重叠 */
.star {
  position: relative;
  display: inline-block;
  top: 2rem;
}

/* 外层描边：始终显示完整描边，颜色为白色 */
.star-stroke {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 5rem;
  color: transparent; /* 填充色透明，只显示描边 */
  -webkit-text-stroke: 0.1rem #fff; /* 白色描边 */
}

/* 内层填充：负责颜色填充，半星时裁剪 */
.star-fill {
  position: relative;
  z-index: 1; /* 覆盖在外层描边上 */
  font-size: 5rem;
}
</style>