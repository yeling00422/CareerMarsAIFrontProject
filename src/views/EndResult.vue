<template>
  <div class="endResult-page">
    <div class="particles">
      <span v-for="i in 15" :key="i" class="particle" :class="'p' + i"></span>
    </div>
    <div class="icon-page">
      <span class="iconfont icon-Gc_05_public-DoubleRightOutlined" @click="lastPage"></span>
      <span class="iconfont icon-Gc_06_public-DoubleRightOutlined" @click="nextPage"></span>
    </div>
    <div class="middle-container">
      <div class="match-tag">
        <div class="match-tag-text">
          <span class="iconfont icon-xunzhang1"></span>{{ currentTeacher.marryRate }}% 匹配
        </div>
      </div>
      <div class="profile-section">
        <div class="name-div">
          <h2 class="name">{{ currentTeacher.menName }}</h2>
        </div>
        <div class="title-div">
          <p class="title">{{ currentTeacher.lableNames }}</p>
        </div>
        <hr class="line">
        <div class="rating-info">
          <div class="rating-left">
            <div class="stars">
              <span v-for="n in 5" :key="n" class="star" :class="getStarClass(n)">
                <span class="iconfont icon-xingxing star-stroke"></span>
                <span class="iconfont icon-xingxing star-fill" :style="getStarStyle(n)"></span>
              </span>
            </div>
            <span class="rating-score">{{ currentTeacher.rating }}</span>
          </div>
          <div class="rating-right">
            <span class="iconfont icon-renyuan"></span>
            <span class="student-number">{{ currentTeacher.studyCount }}</span>
            <span class="students">学员</span>
          </div>
        </div>
        <div class="rating-rate">
          <span class="iconfont icon-zhengque"></span>
          <span class="success-rate">{{ currentTeacher.successRate }}%</span>
          <span class="success-text">成功率</span>
        </div>
        <hr class="line">
      </div>
      <div class="reasons-section">
        <span class="reasons-title">为什么推荐 {{ currentTeacher.menName }}:</span>
        <ul>
          <li v-for="(reason, index) in currentTeacher.reasons" :key="index"><span class="li-text">{{ reason }}</span></li>
        </ul>
      </div>
      <div class="feedback-section">
        <div class="feedback-top">
          <span class="iconfont icon-ceshishenqing"></span>
          <span class="feedback-title">学员反馈:</span>
        </div>
      </div>
      <div class="btn-div">
        <button class="consult-btn" @click="goToConsult">预约免费咨询</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getAiURL, getBaseUrl } from '@/utils/index';

const api = axios.create({
  baseURL: getAiURL(),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export default {
  name: 'EndResult',
  data() {
    return {
      currentPage: 1,
      teachers: [],
      mentorId: '',
      token: '',
      url: '',
    };
  },
  created() {
    this.loadResultData();
  },
  computed: {
    currentTeacher() {
      this.mentorId = this.teachers[this.currentPage - 1].id;
      return this.teachers[this.currentPage - 1];
    },
    totalPages() {
      return this.teachers.length;
    }
  },
  methods: {
    async goToConsult() {
      if (this.token) {
        try {
          await api.get('/ai/setCookie', { params: { token: this.token, url: this.url } });
          window.location.href = this.url + '/teacherDetail?id=' + this.mentorId;
        } catch (e) {
          window.location.href = this.url + '/teacher';
        }
      } else {
        window.location.href = this.url + '/teacher';
      }
    },

    getStarClass(index) {
      if (this.currentTeacher.rating >= index) return 'full';
      if (this.currentTeacher.rating > index - 1) return 'half';
      return 'empty';
    },

    getStarStyle(index) {
      const currentScore = this.currentTeacher.rating - (index - 1);
      if (currentScore <= 0) return { color: '#595959' };
      if (currentScore >= 1) return { color: '#ffcb24' };
      return { color: '#ffcb24', 'clip-path': `inset(0 ${100 - currentScore * 100}% 0 0)` };
    },

    lastPage() {
      if (this.currentPage > 1) this.currentPage--;
    },

    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },

    loadResultData() {
      this.teachers = JSON.parse(this.$route.query.teachers);
      this.token = this.$route.query.token;
      this.url = getBaseUrl();
    }
  },
};
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(4rem); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes cardGlow {
  0%, 100% { box-shadow: 0 0 1rem rgba(0, 245, 212, 0.2), 0 0.5rem 1.5rem rgba(0,0,0,0.1); }
  50%       { box-shadow: 0 0 4rem rgba(0, 245, 212, 0.5), 0 0.5rem 1.5rem rgba(0,0,0,0.1); }
}

@keyframes tagPulse {
  0%, 100% { box-shadow: 0 0 0.5rem rgba(0, 245, 212, 0.3); }
  50%       { box-shadow: 0 0 2rem rgba(0, 245, 212, 0.8); }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.icon-page {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  top: 80rem;
  margin-top: 15rem;
}

.icon-Gc_05_public-DoubleRightOutlined,
.icon-Gc_06_public-DoubleRightOutlined {
  font-size: 5rem;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
}

.icon-Gc_05_public-DoubleRightOutlined:hover,
.icon-Gc_06_public-DoubleRightOutlined:hover {
  color: #00f5d4;
  transform: scale(1.2);
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
  padding-left: 5rem;
  padding-right: 5rem;
  margin-bottom: 15rem;
  animation: fadeInUp 0.6s ease both, cardGlow 3s ease-in-out infinite;
}

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
  animation: tagPulse 2.5s ease-in-out infinite;
}

.match-tag-text {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #00f5d4;
  font-size: 3.5rem;
  margin: 0;
}

.icon-xunzhang1 {
  color: #FFCB24;
  font-size: 3rem;
  margin-left: -1rem;
  margin-right: 1rem;
}

.profile-section {
  margin-bottom: 2rem;
  margin-top: 40rem;
}

.name-div {
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

.line {
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

.rating-right {
  position: relative;
  display: flex;
  align-items: center;
  top: -1rem;
}

.icon-renyuan {
  margin-right: 2rem;
  font-size: 5rem;
  color: #fff;
}

.student-number {
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

.icon-zhengque {
  font-size: 5rem;
  color: #fff;
}

.success-rate {
  margin-left: 2rem;
  font-size: 5rem;
  color: #00f5d4;
  font-weight: 800;
}

.success-text {
  margin-left: 2rem;
  font-size: 4rem;
  color: #fff;
}

.reasons-section {
  position: relative;
  top: -20rem;
  width: 95%;
  height: 10rem;
  margin-bottom: 5rem;
}

.reasons-title {
  font-size: 5rem;
  color: #fff;
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

.li-text { color: #fff; }

.feedback-section {
  width: 95%;
  height: 30rem;
  background-color: #C7C8C8;
  margin-top: 10rem;
  margin-bottom: 5rem;
  border-radius: 5rem;
  padding-top: 2rem;
}

.feedback-top {
  display: flex;
  align-items: center;
}

.icon-ceshishenqing {
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

.consult-btn {
  width: 50rem;
  height: 10rem;
  background: linear-gradient(90deg, #00f5d4, #00c9aa, #00f5d4);
  background-size: 200% auto;
  color: #fff;
  border: none;
  border-radius: 5rem;
  padding: 1.5rem;
  font-size: 4rem;
  margin-left: 12rem;
  margin-bottom: 5rem;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
  animation: shimmer 3s linear infinite;
}

.consult-btn:hover {
  transform: translateY(-0.4rem);
  box-shadow: 0 0 3rem rgba(0, 245, 212, 0.7), 0 0.8rem 2rem rgba(0, 0, 0, 0.2);
}

.consult-btn:active {
  transform: scale(0.97);
}

.star {
  position: relative;
  display: inline-block;
  top: 2rem;
}

.star-stroke {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 5rem;
  color: transparent;
  -webkit-text-stroke: 0.1rem #fff;
}

.star-fill {
  position: relative;
  z-index: 1;
  font-size: 5rem;
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
