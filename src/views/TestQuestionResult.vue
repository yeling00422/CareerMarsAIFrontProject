<template>
  <div class="testQuestionResult-page">
    <div class="particles">
      <span v-for="i in 15" :key="i" class="particle" :class="'p' + i"></span>
    </div>
    <div class="report-title">
      <p class="head-text">你的职业准备度分析</p>
      <p class="head-next-text">基于简历、岗位匹配和面试表现的综合评估</p>
    </div>

    <div class="middle-container">
      <div class="main-score">
        <svg class="progress-ring" viewBox="0 0 100 100">
          <circle class="progress-ringbackground"/>
          <circle class="progress-ringcircle" :stroke-dasharray="circumference" :stroke-dashoffset="strokeDashoffset"/>
        </svg>
        <p class="score-label">综合评分</p>
        <p class="score-number"><span class="main-number">{{ avgScore }}</span>%</p>
      </div>

      <div class="mini-scores">
        <div class="mini-score-item">
          <span class="iconfont icon-qiyewenhua"></span>
          <div class="mini-score-value">{{ culturalCompatibility }}%</div>
          <div class="mini-score-label">文化契合度</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: culturalCompatibility + '%' }"></div>
          </div>
        </div>
        <div class="mini-score-item">
          <span class="iconfont icon-gongju"></span>
          <div class="mini-score-value">{{ resumeMatchingScore }}%</div>
          <div class="mini-score-label">技能匹配度</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: resumeMatchingScore + '%' }"></div>
          </div>
        </div>
        <div class="mini-score-item">
          <span class="iconfont icon-ceshishenqing"></span>
          <div class="mini-score-value">{{ interviewScore }}%</div>
          <div class="mini-score-label">面试表现</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: interviewScore + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="comparison-section">
        <p class="comparison-text">你的综合表现超过了<span class="comparison-text-span">{{ overallPerformance }}%</span>的同类候选人</p>
      </div>

      <div class="six-title">个人能力图</div>

      <div class="six-div">
        <svg viewBox="0 0 200 200" class="hexagon-svg">
          <circle
            v-for="r in [0,20,40,60,80,100]"
            :key="r"
            cx="100" cy="100" :r="r"
            fill="none" stroke="#aaa" stroke-width="1" stroke-dasharray="4 2"
          />
          <text
            v-for="(r, index) in [0,20,40,60,80,100]"
            :key="'label-' + index"
            :x="100" :y="100 - r - 4"
            font-size="3rem" fill="#aaa" text-anchor="middle" dominant-baseline="middle"
          >{{ r }}</text>
          <polygon
            v-for="(item, index) in personalAbility"
            :key="'bg-' + index"
            :points="getHexagonPoints(6, 80, index)"
            fill="none" stroke="#666" stroke-width="1"
          />
          <polygon
            :points="dataPoints"
            fill="rgba(0, 245, 212, 0.6)"
            stroke="#00F5D4"
            stroke-width="2"
          />
          <text
            v-for="(item, index) in personalAbility"
            :key="'text-' + index"
            :x="getTextX(index)" :y="getTextY(index)"
            font-size="3rem" fill="#fff" text-anchor="middle" dominant-baseline="middle"
          >{{ item.ability + '：' + item.score }}</text>
        </svg>
        <button class="reGender-button" v-show="!personalAbilityResult" @click="reGeneratePersonalAbilityChart">个人能力图生成失败。点击重试</button>
      </div>

      <div class="improvement-section">
        <div class="improvement-title">你的提升空间<span class="iconfont icon-gongju icon-upgrade"></span></div>
        <div class="end-box" v-for="(improvement, index) in improvements" :key="index">
          <span class="end-title">{{ improvement.title }}</span>
          <div class="end-text">{{ improvement.description }}</div>
        </div>
      </div>
    </div>

    <div class="button-section">
      <button class="free-analysis-btn" @click="goNext">下一页</button>
      <span class="iconfont icon-sanjiaoxing"></span>
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
  name: 'TestQuestionResult',
  data() {
    return {
      position: '',
      resumeText: '',
      avgScore: 0,
      educationalScore: 0,
      resumeMatchingScore: 0,
      culturalCompatibility: 0,
      interviewScore: 0,
      overallPerformance: 0,
      improvements: [],
      userInfo: null,
      personalAbility: null,
      personalAbilityResult: false,
    };
  },
  computed: {
    dataPoints() {
      if (!Array.isArray(this.personalAbility)) return '';
      return this.personalAbility.slice(0, 6).map((item, index) => {
        const angle = (Math.PI * 2 / 6) * index - Math.PI / 2;
        const x = 100 + item.score * Math.cos(angle);
        const y = 100 + item.score * Math.sin(angle);
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      }).join(' ');
    },
    circumference() {
      return Math.PI * 40 * 2;
    },
    strokeDashoffset() {
      return this.circumference * (1 - this.avgScore / 100);
    }
  },
  created() {
    this.loadAnalysisData();
  },
  methods: {
    async reGeneratePersonalAbilityChart() {
      alert('正在重新生成个人能力图，请稍后...');
      try {
        const response = await api.post('/ai/generate/personalAbility', this.resumeText, {
          headers: { 'Content-Type': 'text/plain;' }
        });
        const result = response.data;
        if (!result || result.code !== 200) {
          alert((result && result.msg) || '个人能力图生成失败！');
          return;
        }
        if (!result.data || result.data === '' || result.data === '[]') {
          alert('个人能力图数据为空！');
          return;
        }
        this.personalAbility = result.data.personalAbility.slice();
        this.personalAbilityResult = true;
        alert('个人能力图生成成功！');
      } catch (e) {
        alert('个人能力图生成失败，请稍后重试！');
      }
    },

    getHexagonPoints(n, r, i) {
      const angle = (Math.PI * 2 / n) * i - Math.PI / 2;
      const x = 100 + r * Math.cos(angle);
      const y = 100 + r * Math.sin(angle);
      return `${x},${y}`;
    },

    getTextX(index) {
      return 100 + 120 * Math.cos((Math.PI * 2 / 6) * index - Math.PI / 2);
    },

    getTextY(index) {
      return 100 + 120 * Math.sin((Math.PI * 2 / 6) * index - Math.PI / 2);
    },

    loadAnalysisData() {
      this.personalAbilityResult = false;
      this.interviewScore = Number(this.$route.query.interviewScore);
      const testQuestionResultData = this.$route.query.testQuestionResultData;
      this.resumeText = this.$route.query.resumeText;
      this.position = this.$route.query.position;
      this.userInfo = this.$route.query.userInfo;
      this.personalAbility = this.$route.query.personalAbility;
      if (this.personalAbility && this.personalAbility !== '[]') {
        this.personalAbilityResult = true;
      }
      if (testQuestionResultData) {
        try {
          const resultData = JSON.parse(testQuestionResultData);
          this.culturalCompatibility = resultData.culturalCompatibility;
          this.resumeMatchingScore = resultData.resumeMatchingScore;
          this.overallPerformance = resultData.overallPerformance;
          this.improvements = resultData.improvements;
          this.avgScore = Math.trunc((this.culturalCompatibility + this.resumeMatchingScore + this.interviewScore) / 3);
        } catch (e) { /* parsing error silently ignored */ }
      }
    },

    goNext() {
      this.$router.push({
        path: '/end-load',
        query: {
          resumeText: this.resumeText,
          position: this.position,
          userInfo: this.userInfo,
        },
      });
    }
  }
};
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(4rem); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes cardPulse {
  0%, 100% { box-shadow: 0 0 1rem rgba(0, 245, 212, 0.2), 0 0.5rem 1.5rem rgba(0,0,0,0.1); }
  50%       { box-shadow: 0 0 3rem rgba(0, 245, 212, 0.5), 0 0.5rem 1.5rem rgba(0,0,0,0.1); }
}

@keyframes radarGlow {
  0%, 100% { filter: drop-shadow(0 0 0.5rem rgba(0, 245, 212, 0.4)); }
  50%       { filter: drop-shadow(0 0 2rem rgba(0, 245, 212, 0.9)); }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.report-title {
  text-align: center;
  margin-top: 15rem;
  margin-bottom: 10rem;
  animation: fadeInUp 0.6s ease both;
}

.head-text {
  color: #000000;
  font-size: 8rem;
  font-weight: 1000;
}

.head-next-text {
  color: #666;
  font-size: 3rem;
  margin-top: -8rem;
}

.middle-container {
  position: relative;
  top: -7rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
  height: auto;
  min-height: 120rem;
  margin: auto;
  border-radius: 5rem;
  background-color: #E9E9E9;
  animation: fadeInUp 0.7s ease 0.15s both;
}

.progress-ring {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

.progress-ringbackground {
  stroke: #e6e6e6;
  stroke-width: 1rem;
  fill: transparent;
  r: 40; cx: 50; cy: 50;
}

.progress-ringcircle {
  stroke: #00F5D4;
  stroke-width: 1rem;
  fill: transparent;
  r: 40; cx: 50; cy: 50;
  transform-origin: 50% 50%;
  transform: rotate(-90deg);
  transition: stroke-dashoffset 0.6s ease;
}

.main-score {
  position: relative;
  top: 3rem;
  height: 30rem;
  width: 90%;
  max-width: 80rem;
  background-color: #646464;
  border-radius: 5rem;
  border: #00F5D4 solid 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: cardPulse 3s ease-in-out infinite;
}

.score-label {
  position: absolute;
  font-size: 3rem;
  color: #fff;
  top: 4rem;
}

.score-number {
  position: absolute;
  font-size: 4rem;
  color: #00F5D4;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  top: -2rem;
}

.main-number {
  font-size: 10rem;
  font-weight: bold;
  color: #00F5D4;
}

.mini-scores {
  display: flex;
  justify-content: space-around;
  position: relative;
  gap: 2rem;
  width: 90%;
  max-width: 80rem;
  height: 15rem;
  margin: auto;
  top: 6rem;
}

.mini-score-item {
  background: #9E9E9E;
  padding: 2rem;
  border-radius: 2rem;
  border: #00F5D4 solid 0.5rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.mini-score-item:hover {
  transform: translateY(-0.5rem);
  box-shadow: 0 0 2rem rgba(0, 245, 212, 0.5);
}

.mini-score-value {
  position: relative;
  font-size: 4rem;
  font-weight: bold;
  color: #00F5D4;
  margin-bottom: 0.5rem;
  top: -9rem;
  left: 10rem;
}

.mini-score-label {
  position: relative;
  top: -10rem;
  left: 9rem;
  font-size: 2.5rem;
  color: #F2F2F2;
}

.progress-bar {
  position: relative;
  height: 1rem;
  width: 20rem;
  top: -8.5rem;
  left: 1rem;
  background-color: #e0e0e0;
  border-radius: 0.5rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00F5D4, #00c9aa, #00F5D4);
  background-size: 200% auto;
  border-radius: 0.5rem;
  animation: shimmer 2s linear infinite;
  transition: width 0.8s ease;
}

.iconfont {
  position: relative;
  font-size: 8rem;
  color: #fff;
  top: 0rem;
  right: -0rem;
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
  margin-bottom: 13rem;
  animation: cardPulse 3.5s ease-in-out infinite;
}

.comparison-text {
  position: relative;
  top: -1rem;
  font-size: 3rem;
  color: #fff;
}

.comparison-text-span {
  font-size: 4rem;
  color: #00F5D4;
}

.six-div {
  position: relative;
  width: 90%;
  height: 70rem;
  background-color: #646464;
  border: #00F5D4 solid 0.5rem;
  border-radius: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.six-title {
  position: relative;
  font-size: 5rem;
  color: #000;
  margin-bottom: 3rem;
  font-weight: 600;
}

.reGender-button {
  position: absolute;
  width: 60rem;
  height: 6rem;
  border-radius: 2rem;
  color: #fff;
  background-color: #595959;
  border: #00F5D4 solid 0.5rem;
  cursor: pointer;
}

.hexagon-svg {
  position: relative;
  width: 50rem;
  height: 50rem;
  overflow: visible;
  animation: radarGlow 3s ease-in-out infinite;
}

.improvement-section {
  position: relative;
  margin-bottom: 0rem;
  width: 90%;
  max-width: 80rem;
  height: auto;
}

.improvement-title {
  margin-left: 22rem;
  position: relative;
  top: 2rem;
  font-size: 5rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 5rem;
}

.icon-upgrade {
  font-size: 5rem;
  color: #FFCB24;
  margin-left: 2rem;
}

.end-box {
  width: 98%;
  height: auto;
  background-color: #9E9E9E;
  border-radius: 2rem;
  border: #FFCB24 solid 0.5rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
  margin-left: 0.5rem;
  margin-bottom: 4rem;
  padding-bottom: 2rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.end-box:hover {
  transform: translateX(0.5rem);
  box-shadow: 0 0 2rem rgba(255, 203, 36, 0.4);
}

.end-title {
  margin-left: 3rem;
  font-size: 4rem;
  font-weight: bold;
  color: #FFCB24;
}

.end-text {
  margin-left: 3rem;
  margin-top: 1rem;
  font-size: 3rem;
  color: #fff;
}

.button-section {
  width: 20rem;
  margin-left: 40rem;
  position: relative;
  display: flex;
  margin-bottom: 3rem;
  align-items: center;
}

.icon-sanjiaoxing {
  font-size: 3rem;
  color: #01F5D4;
  margin-left: -10rem;
}

.free-analysis-btn {
  background: linear-gradient(90deg, #595959, #717171, #595959);
  background-size: 200% auto;
  width: 40rem;
  height: 8rem;
  color: white;
  border: none;
  border-radius: 2.67rem;
  font-size: 4rem;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
  margin-left: -10rem;
  animation: shimmer 3s linear infinite;
}

.free-analysis-btn:hover {
  transform: translateY(-0.3rem);
  box-shadow: 0 0 2rem rgba(0, 245, 212, 0.4);
}

.free-analysis-btn:active {
  transform: scale(0.96);
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
