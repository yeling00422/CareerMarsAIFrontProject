<template>
  <div class="matchJob-page">
    <div class="particles">
      <span v-for="i in 15" :key="i" class="particle" :class="'p' + i"></span>
    </div>
    <div class="main-content">
      <div class="title-section">
        <span v-if="allJobs.length > 0">
          <h1 class="main-title">为你找到了<span class="highlight-text">{{ allJobs.length }}</span>个匹配岗位</h1>
        </span>
        <span v-else>
          <h1 class="main-title">没有匹配到合适的岗位</h1>
          <h1 class="main-title">请输入心仪的岗位</h1>
        </span>
      </div>
      <div class="navigation">
        <button class="iconfont iconfont-left icon-zuofanye" @click="prevPage" :disabled="currentPage === 1"></button>
        <button class="iconfont iconfont-right icon-youfanye" @click="nextPage" :disabled="isLastPage"></button>
      </div>

      <div class="jobs-section">
        <div
          class="job-card"
          v-for="(currentJob, index) in paginatedJobs"
          :key="index"
          @click="toggleCard(index)"
          :class="{ selected: index === indexInPage }"
        >
          <span class="iconfont icon-ai-briefcase"></span>
          <span class="iconfont icon-a-ziyuan543ldpi"></span>
          <div class="company-div"><span class="job-desc">{{ currentJob.company }}</span></div>
          <h3 class="job-name">{{ currentJob.position }}</h3>
        </div>
      </div>

      <div class="input-div">
        <p class="tip-text">① 提示：对匹配结果不满意，可填写心仪的岗位信息</p>
        <input type="text" placeholder="请输入职位信息" class="input-text" v-model="inputText" />
        <p class="tip-text">② 提示：职位描述越详细，AI分析越精准</p>
      </div>

      <div class="buttons-section">
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
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default {
  name: 'MatchJob',
  data() {
    return {
      allJobs: [],
      currentPage: 1,
      jobsPerPage: 3,
      indexInPage: null,
      isSelect: false,
      jobId: '',
      company: '',
      position: '',
      inputText: '',
      resumeText: '',
      userInfo: null,
    };
  },
  created() {
    this.loadMatchData();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.allJobs.length / this.jobsPerPage);
    },
    isLastPage() {
      return this.currentPage === this.totalPages;
    },
    paginatedJobs() {
      const start = (this.currentPage - 1) * this.jobsPerPage;
      return this.allJobs.slice(start, start + this.jobsPerPage);
    },
  },
  methods: {
    toggleCard(indexInPage) {
      const isSelected = this.indexInPage !== indexInPage;
      this.isSelect = isSelected;
      this.indexInPage = !isSelected ? null : indexInPage;
    },

    loadMatchData() {
      const matchJob = this.$route.query.matchJob;
      this.resumeText = this.$route.query.resumeText;
      this.userInfo = this.$route.query.userInfo;
      if (matchJob) {
        try {
          this.allJobs = JSON.parse(matchJob);
        } catch (e) {
          alert('数据加载失败，请重新尝试');
          this.$router.push('/');
        }
      } else {
        alert('未找到匹配数据，请重新分析');
        this.$router.push('/');
      }
    },

    async handleFreeAnalysis() {
      const index = (this.currentPage - 1) * this.jobsPerPage + this.indexInPage;
      if (this.allJobs.length !== 0) {
        this.jobId = this.allJobs[index].id;
        this.company = this.allJobs[index].company;
        this.position = this.allJobs[index].position;
      }

      if (this.isSelect) {
        if (this.inputText) {
          alert('不能同时填写岗位和选择岗位');
          return;
        }
        this.position = this.allJobs[index].position;
      } else {
        if (this.inputText) {
          this.position = this.inputText;
          alert('正在分析输入的岗位是否合法，请稍候。。。');
          const judgmentResponse = await api.get('/ai/judgment/position', {
            params: { position: this.position }
          });
          const judgmentResult = judgmentResponse.data;
          if (judgmentResult.code !== 200) {
            alert(judgmentResult.msg || '岗位有误！请重新输入正确的岗位信息');
            return;
          }
        } else {
          alert('请输入或选择岗位');
          return;
        }
      }

      this.$router.push({
        path: '/generate-test-question-load',
        query: {
          jobId: this.jobId,
          position: this.position,
          resumeText: this.resumeText,
          userInfo: this.userInfo,
        },
      });
    },

    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },

    nextPage() {
      if (!this.isLastPage) this.currentPage++;
    },
  },
};
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(3rem); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 15rem;
}

.title-section {
  margin-bottom: 4rem;
  animation: fadeInUp 0.5s ease both;
}

.main-title {
  font-size: 7rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.highlight-text { color: #01F5D4; }

.tip-text {
  font-size: 3rem;
  color: #999;
}

.navigation {
  position: absolute;
  top: 78rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  z-index: 10;
}

.iconfont {
  font-size: 8rem;
  color: #01F5D4;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.iconfont:hover { transform: scale(1.15); }
.iconfont:disabled { opacity: 0.3; cursor: default; }
.iconfont-left { margin-left: 3rem; }
.iconfont-right { margin-right: 3rem; }

.jobs-section {
  position: relative;
  height: auto;
  width: 75%;
  margin-left: 16rem;
  margin-bottom: 15rem;
  animation: fadeInUp 0.6s ease 0.1s both;
}

.job-card {
  width: 75%;
  min-height: 22rem;
  background-color: #595758;
  border-radius: 2rem;
  box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: left;
  margin-bottom: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  border: 2px solid transparent;
}

.job-card:hover {
  transform: translateY(-0.4rem);
  box-shadow: 0 0.8rem 2rem rgba(0, 0, 0, 0.2), 0 0 1.5rem rgba(1, 245, 212, 0.2);
}

.job-card.selected {
  border: 2px solid #01F5D4;
  box-shadow: 0 0 2rem rgba(1, 245, 212, 0.4);
}

.job-name {
  position: relative;
  font-size: 4rem;
  font-weight: 600;
  color: #CACACA;
  margin-top: -3rem;
  text-align: center;
}

.job-card.selected .job-name { color: #EEF1F0; }

.job-desc {
  font-size: 3rem;
  color: #666;
  line-height: 1.4;
}

.buttons-section {
  position: relative;
  top: -10rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeInUp 0.6s ease 0.2s both;
}

.btn {
  width: 40rem;
  padding: 2rem 3rem;
  font-size: 3rem;
  border-radius: 0.8rem;
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}

.btn-start {
  background: linear-gradient(90deg, #01F5D4, #00c9aa, #01F5D4);
  background-size: 200% auto;
  color: #333;
  animation: shimmer 2.5s linear infinite;
}

.btn-start:hover {
  transform: translateY(-0.3rem);
  box-shadow: 0 0 2rem rgba(1, 245, 212, 0.5);
}

.btn-start:active { transform: scale(0.97); }

.input-div {
  position: relative;
  top: -15rem;
  animation: fadeInUp 0.6s ease 0.15s both;
}

.icon-ai-briefcase {
  position: relative;
  top: 2rem;
  color: #B5B5B5;
}

.job-card.selected .icon-ai-briefcase { color: #E29648; }

.icon-a-ziyuan543ldpi {
  position: relative;
  left: 23rem;
  top: -8rem;
  color: #000;
  opacity: 0;
  transition: opacity 0.2s ease, color 0.2s ease;
}

.job-card.selected .icon-a-ziyuan543ldpi {
  color: #00F5D4;
  opacity: 1;
}

.company-div {
  position: relative;
  top: -5rem;
  display: flex;
  min-width: 25rem;
  max-width: 50rem;
  min-height: 5rem;
  background-color: #CDCDCD;
  justify-content: center;
  align-items: center;
  border-radius: 2rem;
  padding: 0 2rem;
  transition: background-color 0.2s ease;
}

.job-card.selected .company-div { background-color: #EEF1F0; }

.input-text {
  background-color: #595758;
  padding-left: 2rem;
  border-color: white;
  border-radius: 2rem;
  height: 6rem;
  width: 70rem;
  transition: border-color 0.2s ease;
}

.input-text:not(:placeholder-shown) {
  border: 2px solid #00F5D4 !important;
  color: #ccc;
}

@keyframes floatBubble {
  0%   { transform: translateY(0) scale(1); opacity: 0.7; }
  50%  { opacity: 0.3; }
  100% { transform: translateY(-120vh) scale(0.3); opacity: 0; }
}
.particles { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.particle { position: absolute; bottom: -5rem; border-radius: 50%; background: radial-gradient(circle, rgba(0, 245, 212, 0.9), rgba(0, 245, 212, 0.1)); animation: floatBubble linear infinite; }
.p1  { width:2rem;   height:2rem;   left:5%;  animation-duration:7s;  animation-delay:0s;   }
.p2  { width:3rem;   height:3rem;   left:15%; animation-duration:9s;  animation-delay:1s;   }
.p3  { width:1.5rem; height:1.5rem; left:25%; animation-duration:6s;  animation-delay:2s;   }
.p4  { width:4rem;   height:4rem;   left:35%; animation-duration:11s; animation-delay:0.5s; }
.p5  { width:2rem;   height:2rem;   left:45%; animation-duration:8s;  animation-delay:3s;   }
.p6  { width:3.5rem; height:3.5rem; left:55%; animation-duration:10s; animation-delay:1.5s; }
.p7  { width:1.5rem; height:1.5rem; left:65%; animation-duration:7s;  animation-delay:4s;   }
.p8  { width:2.5rem; height:2.5rem; left:75%; animation-duration:9s;  animation-delay:2s;   }
.p9  { width:3rem;   height:3rem;   left:85%; animation-duration:6s;  animation-delay:0.8s; }
.p10 { width:2rem;   height:2rem;   left:92%; animation-duration:8s;  animation-delay:3.5s; }
.p11 { width:4.5rem; height:4.5rem; left:10%; animation-duration:12s; animation-delay:2.5s; }
.p12 { width:1.8rem; height:1.8rem; left:30%; animation-duration:7.5s;animation-delay:5s;   }
.p13 { width:2.5rem; height:2.5rem; left:50%; animation-duration:9.5s;animation-delay:1s;   }
.p14 { width:3rem;   height:3rem;   left:70%; animation-duration:8.5s;animation-delay:4.5s; }
.p15 { width:2rem;   height:2rem;   left:88%; animation-duration:7s;  animation-delay:6s;   }
</style>
