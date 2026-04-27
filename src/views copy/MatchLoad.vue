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
        <h2 class="main-text">正在分析简历并<span class="green-text">匹配岗位</span></h2>
        <p class="sub-text">AI正在从我们的数据库中为你筛选最合适的职位...</p>
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

console.log("api:",api);
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
  mounted() {
    // 进度条动画逻辑
    this.startProgressAnimation();
  },
  created() {
    // 组件创建时自动加载数据
    this.loadMatchData();
  },
  methods: {
        // loadAnalysisData() {
    //   // 从路由参数中获取数据
    //   const result = this.$route.query.matchData;// 将数据转为字符串传递
    //   console.log("analysis-load-result:",result);
      // 设置延迟3秒
      // setTimeout(() => {
      //   this.$router.push({path: '/analysis-result',query: {matchData: result}});
      // }, 3000); // 3000毫秒 = 3秒
    // },
    async loadMatchData() {
      try {
        // ✅ 先进行表单验证
        // if (!this.validateForm()) {
        //   return; 
        // }
        // 从路由参数中获取数据
        // const matchPositionResult = this.$route.query.matchPositionResult;// 将数据转为字符串传递
        const resume = this.$route.query.resume;// 将数据转为字符串传递
        // console.log("Match-load:matchPositionResult:",matchPositionResult);
        console.log("Match-load:resume:",resume);


        const API_PATH = "/ai/search/industry";

        // const data = {
        //   name: "张三",
        //   educationalQualifications: "本科",
        //   skill: "Java开发，前端开发",
        //   educationalExperience: "计算机科学与技术专业，本科",
        //   jobExperience: "拥有三年开发经验。入职过两家公司，分别为阿里巴巴和腾讯。",
        // }
        // const response = await api.post(API_PATH,resume);
        const response = await api.get(API_PATH);
        console.log("接口调用成功，返回的数据是：", response);

        // 处理后端返回的Result结构
        const result = response.data;
        console.log("result：", result);
        console.log("result.code:", result.code);
        console.log("result.data：", result.data);

        
        if (result.code === 200 || result.code === 0) {
          this.$router.push({
            path: '/match-industry',
            query: { 
              matchPositionResult: JSON.stringify(result.data), // 将数据转为字符串传递
              resume: resume // 将数据转为字符串传递
            },
          });
        } else {
          console.error("接口返回错误:", result.msg);
          alert(result.msg || '匹配岗位失败');
        }
      } catch (error) {
        console.error("接口调用失败，错误信息是：", error);
      }


      // 设置延迟3秒
      // setTimeout(() => {
      //   this.$router.push({path: '/match-result',
      //   query: {
      //     matchPositionResult: matchPositionResult,
      //     resume: resume,
      //   }});
      // }, 3000); // 3000毫秒 = 3秒

      
    },

    startProgressAnimation() {
      // 模拟进度条增长
      let progress = 20;
      const interval = setInterval(() => {
        progress += Math.random() * 50;
        if (progress >= 100) {
          progress = 100;
          // window.location.href = '/match-result';
        }
        
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
          progressFill.style.width = progress + '%';
        }
      }, 800);
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
  height: 140rem;
  margin-left: 7.5rem;
  margin-top: 15rem;
  margin-bottom: 12rem;
  border-radius: 4rem;
}


.element-image {
  position: relative;
  z-index: 2;
  top: -30rem;
  width: 80%;
  height: 80%;
  filter: drop-shadow(0 0 20px rgba(0, 255, 200, 0.3));
  top: -20rem;
  left: -2rem;
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
  top: -50rem;
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
  color: #00ffc8;
}

.sub-text {
  font-size: 3rem;
  color: #ffffffcb;
}

</style>