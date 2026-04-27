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
        <h1 class="main-title">请从以下<span class="highlight-text">{{ allIndustrys.length}}</span>个行业中选择岗位</h1>
        <!-- <p class="sub-title">根据你的简历，这些岗位最适合你</p> -->
      </div>

      <div class="navigation">
        <button class="iconfont iconfont-left icon-zuofanye" @click="prevPage" :disabled="currentPage === 1" ></button>
        <button class="iconfont iconfont-right icon-youfanye" @click="nextPage" :disabled="isLastPage"></button>
      </div>

      <!-- 岗位卡片区 -->
      <div class="industrys-section">
        <div class="industry-card" v-for="(currentIndustry, index) in paginatedIndustrys" :key="index"
        @click="toggleCard(index)"
          :class="{ 'selected': index === indexInPage }">
          <span class="iconfont icon-hangye"></span>
          <span class="iconfont icon-a-ziyuan543ldpi"></span>
          <h3 class="industry-name">{{ currentIndustry.industry }}</h3>
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
      // 所有行业数据
      allIndustrys: [], 
      // 当前页码
      currentPage: 1,
      industrysPerPage: 3,
      indexInPage: null,
      isSelect: false, 
      industryId: '', 
      industry: '', 
      inputText: '', 
      resume: '', 
    };
  },
  created() {
    // 组件创建时自动加载数据
    this.loadMatchData();
  },
  computed: {
    // 计算总页数
    totalPages() {
      return Math.ceil(this.allIndustrys.length / this.industrysPerPage);
    },
    // 判断是否为最后一页
    isLastPage() {
      return this.currentPage === this.totalPages;
    },
    // 获取当前页的行业数据
    paginatedIndustrys() {
      const startIndex = (this.currentPage - 1) * this.industrysPerPage;
      const endIndex = startIndex + this.industrysPerPage;
      return this.allIndustrys.slice(startIndex, endIndex);
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
      const matchPositionResult = this.$route.query.matchPositionResult;
      this.resume = this.$route.query.resume;
      if (typeof this.resume === 'string') {
        console.log("resume",this.resume);
        console.log("resume typeof",typeof this.resume);

        // ✅ 只改这一行逻辑：避免解析 "[object Object]"
        if (this.resume !== '[object Object]') {
          try {
            this.resume = JSON.parse(this.resume);
          } catch (e) {
            console.error("解析 resume 失败，使用空对象:", e);
            this.resume = {};
          }
        } else {
          this.resume = {};
        }
      } 
      console.log("match-industry:matchPositionResult",matchPositionResult);
      console.log("match-industry:resume",this.resume);
      if (matchPositionResult) {
        try {
          // 解析数据
          this.allIndustrys = JSON.parse(matchPositionResult);
          console.log("allIndustrys",this.allIndustrys);
        } catch (error) {
          console.error('解析匹配数据失败:', error);
          alert('数据加载失败，请重新尝试');
          this.$router.push('/');
        }
      } else {
        // 如果没有数据，直接跳转回首页
        alert('未找到匹配数据，请重新分析');
        this.$router.push('/');
      }
    },

    async handleFreeAnalysis() {
      if (!this.isSelect) {
        alert('请先选择一个行业!');
        return;
      }
      let index = (this.currentPage-1)*this.industrysPerPage+this.indexInPage;//当前索引=（当前页数-1)*每页条数+当前索引-1
      this.industryId = this.allIndustrys[index].industryId;
      this.industry = this.allIndustrys[index].industry;

      console.log("isSelect:",this.isSelect);
      console.log("industryId",this.industryId);
      console.log("industry",this.industry);
      if (this.industryId != null && this.industry !== '') {
        try {
          const API_PATH =  `/ai/search/job/${this.industryId}`;
          const response = await api.get(API_PATH);
          console.log("接口调用成功，返回的数据是：", response);
          const result = response.data;
          console.log("result：", result);
          console.log("result.code:", result.code);
          if (result.code === 200 || result.code === 0) {
            console.log("result.data：", result.data);
            console.log("result.resume", result.resume);
            this.$router.push({
              path: '/match-job',
              query: { 
                matchPositionResult: JSON.stringify(result.data), // 将数据转为字符串传递
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

/* 行业卡片 */
.industrys-section {
  position: relative;
  flex-wrap: wrap;
  height: 105rem;
  width: 75%;
  margin-left: 16rem;
  /* background: #333; */
}

.industry-card {
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

.industry-card.selected {
  background-color: #595758; /* 浅绿色背景 */
  border: 2px solid #01F5D4; /* 绿色边框 */
}


.industry-name {
  position: relative;
  top: -4rem;
  font-size: 4rem;
  font-weight: 600;
  color: #CDCDCD;
  margin: auto;
}

.industry-card.selected .industry-name{
  color: #F2F5F3;
}

.industry-desc {
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

.icon-hangye{
  position: relative;
  top: 2rem;
  color: #B5B5B5;
}

.industry-card.selected .icon-hangye{
  color: #E29648;
}

.icon-a-ziyuan543ldpi{
  position: relative;
  left: 23rem;
  top: -8rem;
  color: #000;
  opacity: 0; /* 默认隐藏 */
}

.industry-card.selected .icon-a-ziyuan543ldpi{
  position: relative;
  left: 23rem;
  top: -8rem;
  color: #00F5D4;
  opacity: 1; /* 默认隐藏 */
}


</style>