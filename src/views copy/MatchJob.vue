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
        <h1 class="main-title">为你找到了<span class="highlight-text">{{ allJobs.length}}</span>个匹配岗位</h1>
      </div>

      <div class="navigation">
        <button class="iconfont iconfont-left icon-zuofanye" @click="prevPage" :disabled="currentPage === 1" ></button>
        <button class="iconfont iconfont-right icon-youfanye" @click="nextPage" :disabled="isLastPage"></button>
      </div>

      <!-- 岗位卡片区 -->
      <div class="jobs-section">
        <div class="job-card" v-for="(currentJob, index) in paginatedJobs" :key="index"
        @click="toggleCard(index)"
          :class="{ 'selected': index === indexInPage }">
          <span class="iconfont icon-ai-briefcase"></span>
          <span class="iconfont icon-a-ziyuan543ldpi"></span>
          <div class="company-div"><span class="job-desc">{{ currentJob.company }}</span></div>
          <h3 class="job-name">{{ currentJob.position }}</h3>
        </div>
      </div>

      <div class="input-div">
        <p class="tip-text">① 提示：对匹配结果不满意，可填写心仪的岗位信息</p>
        <input type="text" placeholder="请输入职位信息" class="input-text" v-model="inputText" />
        <p class="tip-text">① 提示：职位描述越详细，AI分析越精准</p>
      </div>

      <!-- 底部按钮区 -->
      <div class="buttons-section">
        <button class="btn btn-back" @click="$router.push('/upload')">返回上一步</button>
        <!-- <button class="btn btn-start" @click="$router.push('/analysis-load')">开始精准分析</button> -->
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
      allJobs: [], 
      // 当前页码
      currentPage: 1,
      // 每页显示的岗位数
      jobsPerPage: 3,
      indexInPage: null,
      isSelect: false, 
      testPaperName: null, 
      // position: '', 
      jobId: '', 
      company: '', 
      position: '', 
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
      return Math.ceil(this.allJobs.length / this.jobsPerPage);
    },
    // 判断是否为最后一页
    isLastPage() {
      return this.currentPage === this.totalPages;
    },
    // 获取当前页的岗位数据
    paginatedJobs() {
      const startIndex = (this.currentPage - 1) * this.jobsPerPage;
      const endIndex = startIndex + this.jobsPerPage;
      return this.allJobs.slice(startIndex, endIndex);
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
      console.log("match-job:matchPositionResult",matchPositionResult);
      console.log("match-job:resume",this.resume);
      if (matchPositionResult) {
        try {
          // 解析数据
          this.allJobs = JSON.parse(matchPositionResult);
          console.log("allJobs",this.allJobs);
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
      let index = (this.currentPage-1)*this.jobsPerPage+this.indexInPage;//当前索引=（当前页数-1)*每页条数+当前索引-1
      this.jobId = this.allJobs[index].jobId;
      this.company = this.allJobs[index].company;
      this.position = this.allJobs[index].position;

      if (this.isSelect) {
        if (this.inputText != null && this.inputText !== '') {
          alert('不能同时填写岗位和选择岗位');
          return;
        }
        this.position = this.allJobs[index].position;

        const response = await api.get(`/ai/search/testPaper/${this.jobId}`);

        const result = response.data;
        console.log("result:",result); // Result<List<TestPaperVo>>

        if (result.code === 200 || result.code === 0) {
          console.log("testPaperList:",result.data); // Result<List<TestPaperVo>>
          this.$router.push({
            path: '/match-test-name',
            query: { 
              testPaperList: result.data, // 将数据转为字符串传递
              expectationPosition: this.position, // 将数据转为字符串传递
              resume: this.resume, // 将数据转为字符串传递
              jobId: this.jobId // 将数据转为字符串传递
            }
          });
        } else {
          console.error("接口返回错误:", result.msg);
          alert(result.msg || '匹配岗位失败');
        }
        // this.$router.push({
        //   path: '/match-test-name',
        //   query: { 
        //     jobId: this.jobId, // 将数据转为字符串传递
        //     expectationPosition: this.position, // 将数据转为字符串传递
        //     resume: this.resume // 将数据转为字符串传递
        //   },
        // });
      }else{
        if (this.inputText != null && this.inputText !== '') {
          this.position = this.inputText;

          this.$router.push({
            path: '/generate-test-question-load',
            query: { 
              testPaperName: this.testPaperName, // 将数据转为字符串传递
              jobId: this.jobId, // 将数据转为字符串传递
              expectationPosition: this.position, // 将数据转为字符串传递
              resume: this.resume // 将数据转为字符串传递
            },
          });
        }else{
          alert('请输入或选择岗位');
          return;
        }
      }


      // if (this.isSelect) {
      //   if (this.inputText != null && this.inputText !== '') {
      //     alert('不能同时填写岗位和选择岗位');
      //     return;
      //   }
      //   this.position = this.allJobs[index].position;
      //   try {
      //     const API_PATH =  `/ai/search/testQuestion/${this.jobId}`;
      //     const response = await api.get(API_PATH);
      //     console.log("接口调用成功，返回的数据是：", response);
      //     const result = response.data;
      //     console.log("result：", result);
      //     console.log("result.code:", result.code);
          
      //     if (result.code === 200 || result.code === 0) {
      //       console.log("result.data：", result.data);
      //       this.$router.push({
      //         path: '/test-question',
      //         query: { 
      //           generateQuestion: JSON.stringify(result.data), // 将数据转为字符串传递
      //           expectationPosition: this.position, // 将数据转为字符串传递
      //           resume: this.resume // 将数据转为字符串传递
      //         },
      //       });
      //     } else {
      //       console.error("接口返回错误:", result.msg);
      //       alert(result.msg || '匹配测试问题失败');
      //     }
      //   } catch (error) {
      //     console.error("接口调用失败，错误信息是：", error);
      //   }
      // }else{
      //   if (this.inputText != null && this.inputText !== '') {
      //     this.position = this.inputText;
      //     try {
      //       const API_PATH = "/ai/generate/testQuestion";
      //       const response = await api.get(API_PATH, {
      //         params: {position: this.position}
      //       });  
      //       console.log("接口调用成功，返回的数据是：", response);
      //       const result = response.data;
      //       console.log("result：", result);
      //       console.log("result.code:", result.code);
            
      //       if (result.code === 200 || result.code === 0) {
      //         console.log("result.data：", result.data);
      //         this.$router.push({
      //           path: '/test-question',
      //           query: { 
      //             generateQuestion: JSON.stringify(result.data), // 将数据转为字符串传递
      //             expectationPosition: this.position, // 将数据转为字符串传递
      //             resume: this.resume // 将数据转为字符串传递
      //           },
      //         });
      //       } else {
      //         console.error("接口返回错误:", result.msg);
      //         alert(result.msg || '匹配测试问题失败');
      //       }
      //     } catch (error) {
      //       console.error("接口调用失败，错误信息是：", error);
      //     }
      //   }else{
      //     alert('请输入或选择岗位');
      //   }
      // }
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
  /* height: 105rem; */
  height: auto;
  width: 75%;
  margin-left: 16rem;
  margin-bottom: 15rem;
  /* background: #333; */
}

.job-card {
  width: 75%;
  min-height: 22rem;
  background: #fff;
  background-color: #595758; 

  border-radius: 2rem;
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
  border: 2px solid #01F5D4; /* 绿色边框 */
}

.job-name {
  position: relative;
  top: -3rem;
  font-size: 4rem;
  font-weight: 600;
  color: #CACACA;
  /* margin-top: 1rem;
  margin-bottom: 1rem;
  margin-left: auto; */
  margin: auto;
}


.job-card.selected .job-name{
  color: #EEF1F0;
}


.job-desc {
  font-size: 3rem;
  color: #666;
  line-height: 1.4;
}



/* 底部按钮 */
.buttons-section {
  position: relative;
  top: -10rem;
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
  top: -15rem;
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

/* .input:hover {
  border: 2px solid #01F5D4;
} */
.icon-ai-briefcase{
  position: relative;
  top: 2rem;
  color: #B5B5B5;
}

.job-card.selected .icon-ai-briefcase{
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

.company-div{
  position: relative;
  top: -5rem;
  display: flex;
  width: 20rem;
  height: 4rem;
  background-color: #CDCDCD;
  justify-content: center;
  /* align-items: center; */
  border-radius: 2rem;
  
}

.job-card.selected .company-div{
  background-color: #EEF1F0;
}

.input-text{
  background-color: #595758;
  padding-left: 2rem;
  border-color: white;
  border-radius: 2rem;
  height: 6rem;
  width: 70rem;
}

.input-text:not(:placeholder-shown) {
  border: 2px solid #00F5D4 !important;
  color: #ccc;
}


</style>