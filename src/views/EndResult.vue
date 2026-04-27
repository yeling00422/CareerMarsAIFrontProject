<template>
  <div class="endResult-page">
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
import { getAiURL,getBaseUrl } from '@/utils/index';

const api = axios.create({
  baseURL: getAiURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  // 关键：开启跨域 Cookie 携带/写入
  withCredentials: true, 
});

// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default {
  name: 'EndResult',
  data() {
    return {
      currentPage: 1, 
      teachers:[],
      mentorId:'',
      token:'',
      url:'',
    };
  },
  created() {
    // 组件创建时自动加载数据
    this.loadResultData();
  },
  methods: {
    async goToConsult() {
      console.log('咨询导师-token：',this.token);
      console.log('咨询导师-url：',this.url);
      console.log('咨询导师-id',this.mentorId);
      if (this.token !== null && this.token !== '') {
        try {
          const API_PATH = "/ai/setCookie";
          const response = await api.get(API_PATH, {
            params: {
              token: this.token,
              url: this.url,
            }
          });
          console.log("接口调用成功，返回的数据是：", response);
          console.log("接口调用成功，url是：", this.url+'/teacherDetail?id='+this.mentorId);
          window.location.href = this.url+'/teacherDetail?id='+this.mentorId;
        } catch (error) {
          console.error("接口调用失败，错误信息是：", error);
          console.log("接口调用失败111，url是：", this.url+'/teacher');
          window.location.href = this.url+'/teacher';
        }
      }else{
          console.log("接口调用失败222，url是：", this.url+'/teacher');
          window.location.href = this.url+'/teacher';
      }
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
      this.token = this.$route.query.token;
      this.url = getBaseUrl();
      console.log("end-result-teachers:",this.teachers);
      console.log("end-result-token:",this.token);
    }
  },
  computed: {
    // 获取当前导师（分页逻辑）
    currentTeacher() {
      this.mentorId = this.teachers[this.currentPage - 1].id;
      console.log("current-teacher:",this.teachers[this.currentPage - 1]);
      console.log("current-mentorId:",this.mentorId);
      return this.teachers[this.currentPage - 1]; 
    },
    totalPages() {
      return this.teachers.length;
    }
  }
};
</script>

<style scoped>

.icon-page{
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  top: 80rem;
  margin-top: 15rem;
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
  color: #fff;
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