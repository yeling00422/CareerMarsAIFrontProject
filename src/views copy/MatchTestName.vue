<template>
  <div class="home-container">
    <!-- 顶部固定栏（保留第一张图的内容和样式） -->
    <div class="head-container">
      <img src="../assets/img/上面固定栏.png" class="logo" />
    </div>

    <!-- 主体内容（改成第二张图的布局） -->
    <div class="main-content">
      <!-- 标题区 -->
      <div class="title-section">
        <h1 class="main-title">请从以下<span class="highlight-text">{{ testPaperList.length}}</span>份试卷中选择要练习的真题</h1>
        <!-- <p class="sub-title">根据你的简历，这些岗位最适合你</p> -->
      </div>

      <div class="navigation">
        <button class="iconfont iconfont-left icon-zuofanye" @click="prevPage" :disabled="currentPage === 1" ></button>
        <button class="iconfont iconfont-right icon-youfanye" @click="nextPage" :disabled="isLastPage"></button>
      </div>

      <!-- 岗位卡片区 -->
      <div class="jobs-section">
        <div class="job-card" v-for="(currentTestPaper, index) in paginatedJobs" :key="index"
        @click="toggleCard(index)"
          :class="{ 'selected': index === indexInPage }">
          <span class="iconfont icon-shijuan"></span>
          <span class="iconfont icon-a-ziyuan543ldpi"></span>
          <h3 class="job-title">{{ currentTestPaper.name }}</h3>
        </div>
      </div>

      <!-- 底部按钮区 -->
      <div class="buttons-section">
        <button class="btn btn-back" @click="$router.push('/upload')">返回上一步</button>
        <button class="btn btn-start" @click="handleFreeAnalysis">下一步</button>
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
      // 所有岗位数据
      testPaperList: [], 
      // 当前页码
      currentPage: 1,
      jobsPerPage: 3,
      indexInPage: null,
      isSelect: false, 
      name: '', 
      position: '', 
      inputText: '', 
      resume: '', 
      jobId: '', 
    };
  },
  created() {
    // 组件创建时自动加载数据
    this.loadMatchData();
  },
  computed: {
    // 计算总页数
    totalPages() {
      return Math.ceil(this.testPaperList.length / this.jobsPerPage);
    },
    // 判断是否为最后一页
    isLastPage() {
      return this.currentPage === this.totalPages;
    },
    // 获取当前页的试卷数据
    paginatedJobs() {
      const startIndex = (this.currentPage - 1) * this.jobsPerPage;
      const endIndex = startIndex + this.jobsPerPage;
      return this.testPaperList.slice(startIndex, endIndex);
    },
  },
  methods: {
    // 切换卡片选中状态
    toggleCard(indexInPage) {
      const isSelected = this.indexInPage !== indexInPage;
      this.isSelect = isSelected;
      this.indexInPage = !isSelected ? null : indexInPage;
    },


    // 加载匹配数据
    loadMatchData() {
      // 从路由参数中获取数据
      this.testPaperList = this.$route.query.testPaperList;// 将数据转为字符串传递
      this.resume = this.$route.query.resume;// 将数据转为字符串传递
      this.position = this.$route.query.expectationPosition;// 将数据转为字符串传递
      this.jobId = this.$route.query.jobId;// 将数据转为字符串传递

      console.log("match-test-name-testPaperList:",this.testPaperList);
      console.log("match-test-name-resume:",this.resume);
      console.log("match-test-name-position:",this.position);
      console.log("match-test-name-jobId:",this.jobId);
    },

    async handleFreeAnalysis() {
      if (!this.isSelect) {
        alert('请先选择一个行业!');
        return;
      }
      let index = (this.currentPage-1)*this.jobsPerPage+this.indexInPage;//当前索引=（当前页数-1)*每页条数+当前索引-1
      this.name = this.testPaperList[index].name;

      console.log("isSelect:",this.isSelect);
      console.log("name",this.name);
      if (this.name != null && this.name !== '') {
        this.$router.push({
          path: '/generate-test-question-load',
          query: { 
            testPaperName: this.name, // 将数据转为字符串传递
            position: this.position, // 将数据转为字符串传递
            resume: this.resume, // 将数据转为字符串传递
            jobId: this.jobId, // 将数据转为字符串传递
          },
        });
      }
    },
    
    // 上一页
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    // 下一页
    nextPage() {
      if (!this.isLastPage) {
        this.currentPage++;
      }
    },
  },
};
</script>

<style scoped>
/* 保留第一张图的背景和顶部栏 */
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

/* 主体内容（第二张图样式） */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
  text-align: center;
}

.title-section {
  margin-bottom: 4rem;
}

.main-title {
  font-size: 7rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.highlight-text {
  color: #01F5D4;
}

.sub-title {
  font-size: 3rem;
  color: #666;
  margin-bottom: 1rem;
}

.tip-text {
  font-size: 3rem;
  color: #999;
}

/* 导航箭头容器 */
.navigation {
  position: absolute;
  top: 78rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  z-index: 10; 
}



.iconfont{
  font-size: 8rem;
  color: #01F5D4;
  border: none;
}

.iconfont-left{
  margin-left: 3rem;
}

.iconfont-right{
  margin-right: 3rem;
}

/* 岗位卡片 */
.jobs-section {
  position: relative;
  flex-wrap: wrap;
  height: 105rem;
  width: 75%;
  margin-left: 16rem;
  /* background: #333; */
}

.job-card {
  width: 75%;
  height: 20rem;
  background: #595758;
  border-radius: 1rem;
  border-color: #333;
  box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: left;
  margin-bottom: 5rem; /* 新增这一行控制上下间距 */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column; 
}

.job-card.selected {
  background-color: #595758; /* 浅绿色背景 */
  border: 2px solid #01F5D4; /* 绿色边框 */
}


.job-title {
  position: relative;
  top: -3rem;
  font-size: 4rem;
  font-weight: 600;
  color: #CDCDCD;
  margin: auto;
}

.job-card.selected .job-title{
  color: #F2F5F3;
}

.job-desc {
  font-size: 3rem;
  color: #666;
  line-height: 1.4;
}

/* 底部按钮 */
.buttons-section {
  /* position: relative; */
  top: 10rem;
  display: flex;
  flex-direction: column;/* 底部按钮横向或者纵向 */
  gap: 2rem;

}

.btn {
  width: 40rem;
  padding: 2rem 3rem;
  font-size: 3rem;
  border-radius: 0.8rem;
  border: none;
}

.btn-back {
 background: #595959;
 color: #fff;
}

.btn-start {
background: #01F5D4;
 color: #333;
}

.input-div{
  position: relative;
  top: -10rem;
}

.input{
  width: 72rem;
  height: 10rem;
  font-size: 3rem;
  border-radius: 0.8rem;
  border: none;
  padding: 0 1rem;
  margin-bottom: 2rem;
}

.icon-shijuan{
  position: relative;
  top: 3rem;
  color: #B5B5B5;
}

.job-card.selected .icon-shijuan{
  color: #E29648;
}

.icon-a-ziyuan543ldpi{
  position: relative;
  left: 23rem;
  top: -8rem;
  color: #000;
  opacity: 0; /* 默认隐藏 */
}

.job-card.selected .icon-a-ziyuan543ldpi{
  position: relative;
  left: 23rem;
  top: -8rem;
  color: #00F5D4;
  opacity: 1; /* 默认隐藏 */
}


</style>