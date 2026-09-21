<template>
  <div class="screen-cover yuxiucup-screen">
    <div class="screen-bg"></div>
    <div class="screen-page" ref="page">
      <div class="header">
        <div class="badge">毓秀杯电影配音交流赛 · 第二期 </div>
        <div class="title"><span class="title-line-left">———</span>以声会友 · 声深入心<span class="title-line-right">———</span></div>
      </div>
      <div class="main">
        <div class="char-col">
          <video class="char-video-bg" autoplay muted loop playsinline src="../assets/video/水滴人.mp4"></video>
          <div class="speech" id="speech">你好呀～我是小水滴！<br>准备为选手们认真打分！✨</div>
          <div class="char-name">小水滴 · AI评委</div>
          <div class="char-role">毓秀杯 · 智能打分官</div>
        </div>
        <div class="score-col">
          <div class="player-card">
              <div class="label">当前组别 :&nbsp;&nbsp;<span class="p-name">{{ stu1 && stu1.groupName || '—'}}</span></div>
              <div class="label">作品名称 :&nbsp;&nbsp;<span class="p-work">{{ stu1 && stu1.work || '—' }}</span></div>
          </div>
          <div class="score-radar" :class="{ singleMode: stu2 == null }">
            <div class="semi-left" :class="{singleLeft: stu2 == null}">
              <svg class="score-semicircle" viewBox="0 0 760 400" preserveAspectRatio="xMidYMid meet">
              <g>
                <path class="sector-bg" :d="getSectorPath(0)"/>
                <path v-if="getSectorValuePath(stu1 && stu1.score1, 0)" class="sector-first" :d="getSectorValuePath(stu1.score1, 0)"/>
                <text class="sector-score" :x="getTextPosition(0).x" :y="getTextPosition(0).y + 28">{{ stu1 && stu1.score1 || '—' }}分</text>
                <text class="sector-label" :x="getTextPosition(0).x" :y="getTextPosition(0).y - 28">{{ scoreItems[0].name }}</text>
              </g>
              <g>
                <path class="sector-bg" :d="getSectorPath(1)"/>
                <path v-if="getSectorValuePath(stu1 &&stu1.score2, 1)" class="sector-second" :d="getSectorValuePath(stu1.score2, 1)"/>
                <text class="sector-score" :x="getTextPosition(1).x" :y="getTextPosition(1).y + 28">{{ stu1 && stu1.score2 || '—' }}分</text>
                <text class="sector-label" :x="getTextPosition(1).x" :y="getTextPosition(1).y - 28">{{ scoreItems[1].name }}</text>
              </g>
              <g>
                <path class="sector-bg" :d="getSectorPath(2)"/>
                <path v-if="getSectorValuePath(stu1 && stu1.score3, 2)" class="sector-three" :d="getSectorValuePath(stu1.score3, 2)"/>
                <text class="sector-score" :x="getTextPosition(2).x" :y="getTextPosition(2).y + 28">{{ stu1 && stu1.score3 || '—' }}分</text>
                <text class="sector-label" :x="getTextPosition(2).x" :y="getTextPosition(2).y - 28">{{ scoreItems[2].name }}</text>
              </g>
              <g>
                <path class="sector-bg" :d="getSectorPath(3)"/>
                <path v-if="getSectorValuePath(stu1 && stu1.score4, 3)" class="sector-four" :d="getSectorValuePath(stu1.score4, 3)"/>
                <text class="sector-score" :x="getTextPosition(3).x" :y="getTextPosition(3).y + 28">{{ stu1 && stu1.score4 || '—' }}分</text>
                <text class="sector-label" :x="getTextPosition(3).x" :y="getTextPosition(3).y - 28">{{ scoreItems[3].name }}</text>
              </g>
              <text class="center-small" x="380" y="280">得分</text>
              <text class="center-total" x="380" y="380"> {{ stu1 && stu1.total || '—' }}</text>
              </svg>
              <div class="radar-player">{{ stu1 && stu1.name || '—' }}</div>
            </div>
            <div class="semi-right" v-show="stu2 != null">
              <svg class="score-semicircle" viewBox="0 0 760 400" preserveAspectRatio="xMidYMid meet">
              <g>
                <path class="sector-bg" :d="getSectorPath(0)"/>
                <path v-if="getSectorValuePath(stu2 && stu2.score1, 0)" class="sector-first" :d="getSectorValuePath(stu2.score1, 0)"/>
                <text class="sector-score" :x="getTextPosition(0).x" :y="getTextPosition(0).y + 28">{{ stu2 && stu2.score1 || '—' }}分</text>
                <text class="sector-label" :x="getTextPosition(0).x" :y="getTextPosition(0).y - 28">{{ scoreItems[0].name }}</text>
              </g>
              <g>
                <path class="sector-bg" :d="getSectorPath(1)"/>
                <path v-if="getSectorValuePath(stu2 && stu2.score2, 1)" class="sector-second" :d="getSectorValuePath(stu2.score2, 1)"/>
                <text class="sector-score" :x="getTextPosition(1).x" :y="getTextPosition(1).y + 28">{{ stu2 && stu2.score2 || '—' }}分</text>
                <text class="sector-label" :x="getTextPosition(1).x" :y="getTextPosition(1).y - 28">{{ scoreItems[1].name }}</text>
              </g>
              <g>
                <path class="sector-bg" :d="getSectorPath(2)"/>
                <path v-if="getSectorValuePath(stu2 && stu2 && stu2.score3, 2)" class="sector-three" :d="getSectorValuePath(stu2.score3, 2)"/>
                <text class="sector-score" :x="getTextPosition(2).x" :y="getTextPosition(2).y + 28">{{ stu2 && stu2.score3 || '—' }}分</text>
                <text class="sector-label" :x="getTextPosition(2).x" :y="getTextPosition(2).y - 28">{{ scoreItems[2].name }}</text>
              </g>
              <g>
                <path class="sector-bg" :d="getSectorPath(3)"/>
                <path v-if="getSectorValuePath(stu2 && stu2.score4, 3)" class="sector-four" :d="getSectorValuePath(stu2 && stu2.score4, 3)"/>
                <text class="sector-score" :x="getTextPosition(3).x" :y="getTextPosition(3).y + 28">{{ stu2 && stu2.score4 || '—' }}分</text>
                <text class="sector-label" :x="getTextPosition(3).x" :y="getTextPosition(3).y - 28">{{ scoreItems[3].name }}</text>
              </g>
              <text class="center-small" x="380" y="280">得分</text>
              <text class="center-total" x="380" y="380">{{ stu2 && stu2.total || '—' }}</text>
              </svg>
              <div class="radar-player">  {{ stu2 && stu2.name || '—' }}</div>
            </div>
          </div>
          <div class="avg-score">组别平均分 : <span class="avg-score-light">{{ this.avgScore || '—' }}</span></div>

          <div class="score-list-button" @click="toggleScoreList">
            <span class="slb-arrow">{{ showScoreList ? '◀' : '▼' }}</span>
            <span class="slb-label">排行榜</span>
          </div>

          <div class="score-list" v-show="showScoreList">
            <div class="sl-header">🏆 选手得分榜</div>
            <div class="sl-header-tip">评分实时更新，综合得分排行</div>
            <div class="sl-header-row">
              <span class="sl-rank-header sl-header-item">排名</span>
              <span class="sl-name sl-header-item">选手</span>
              <span class="sl-score sl-header-item">专家评委组得分</span>
              <span class="sl-score sl-header-item">大众评委组得分</span>
              <span class="sl-avg-score sl-header-item">综合得分</span>
            </div>
            <div class="sl-body">
              <div class="sl-row" v-for="(item, i) in visibleScoreList" :key="scoreListOffset + i">
                <!-- <span class="sl-rank" :class="'top-' + item.realRank">{{ item.realRank <=3 ? '🏆'+item.realRank : item.realRank }}</span>                 -->
                <span class="sl-rank">
                  <span class="medal" v-if="item.realRank === 1">🥇</span>
                  <span class="medal" v-else-if="item.realRank === 2">🥈</span>
                  <span class="medal" v-else-if="item.realRank === 3">🥉</span>
                  <span v-else>{{ item.realRank }}</span>
                </span>
                <span class="sl-name">{{ item.name }}</span>
                <span class="sl-score">{{ item.expertEndScore === null ? '待统计' : item.expertEndScore }}</span>
                <span class="sl-score">{{ item.volkswagenEndScore === null ? '待统计' : item.volkswagenEndScore }}</span>
                <span class="sl-avg-score">{{ item.endScore === null ? '-' : item.endScore }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getAiURL } from '@/utils/index';
const api = axios.create({ baseURL: getAiURL(), headers: { 'Content-Type': 'application/json' } });
const FIELDS = ['score1', 'score2', 'score3', 'score4'];
const SPEECH = [
  [18, '哇哦！！满星级别。小水滴超级感动！🌟✨🎉'],
  [15, '太棒了！这位选手实力超强！👏💫'],
  [12, '不错哦！继续努力会更棒！😊💪'],
  [0,  '加油加油！下次一定会更好！💕'],
];
const IDLE = [
  '你好呀～我是小水滴！准备为选手们认真打分！✨',
  '小水滴的耳朵竖起来啦！认真听，认真评！👂✨',
  '毓秀杯加油！每一位选手都很棒！💕',
  '配音是一门艺术，小水滴会仔细欣赏的～🎭',
];

export default {
  name: 'Screen',
  data() {
    return {
      lastData: null,
      showScoreList: false,
      scoreList: [],
      scoreListOffset: 0,
      scoreItems: [
        { name: '难度系数', value: null },
        { name: '作品完成率', value: null },
        { name: '发音准确度', value: null },
        { name: '角色还原度', value: null },
      ],
      stu1:null,
      stu2:null,
      avgScore: null,
    };
  },
  computed: {
    visibleScoreList() {
      console.log(this.scoreList);
      return this.scoreList.slice(this.scoreListOffset, this.scoreListOffset + 6);
    },
  },
  mounted() {
    document.body.classList.add('has-yuxiucup-screen')
    this.scaleScreen();
    window.addEventListener('resize', this.scaleScreen);
    this.startPoll();
    this.startIdleSpeech();
  },
  methods: {
    scaleScreen() {
      const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      const el = this.$refs.page;
      el.style.transform = `scale(${scale})`;
      el.style.left = `${(window.innerWidth - 1920 * scale) / 2}px`;
      el.style.top = `${(window.innerHeight - 1080 * scale) / 2}px`;
    },
    setSpeech(txt) {
      const el = document.getElementById('speech');
      el.style.opacity = '0';
      setTimeout(() => { el.innerHTML = txt; el.style.opacity = '1'; }, 200);
    },
    async fetchLatest() {
      try {
        const res = await api.get('/ai/yxb/search/score');
        const responseData = res.data;
        if (responseData.code !== 200 || responseData.data == null || responseData.data.length === 0) {
          this.showEmpty();
          return;
        }
        const studentList = responseData.data;
        this.stu1 = studentList[0] || null;
        this.stu2 = studentList[1] || null;
        if (!this.stu1) {
          this.avgScore = null;
        } else if (this.stu2 != null) {
          this.avgScore = (this.stu1.total + this.stu2.total) / 2;
        } else {
          this.avgScore = this.stu1.total;
        }
        let speech = '';
        if (this.avgScore >= 18) {
          speech = SPEECH[0][1];
        } else if (this.avgScore >= 15) {
          speech = SPEECH[1][1];
        } else if (this.avgScore >= 12) {
          speech = SPEECH[2][1];
        } else {
          speech = SPEECH[3][1];
        }
        this.setSpeech(speech);
      } catch (error) {
        console.error('获取最新评分失败：', error);
      }
    },
    showEmpty() {
      this.scoreItems.forEach(item => {
        item.value = null;
      });
      this.lastData = null;
      this.avgScore = null;
      this.stu1 = null;
      this.stu2 = null;
    },
    async fetchScoreList() {
      try {
        const { data } = await api.get('/ai/yxb/search/endScore');
        if (Array.isArray(data.data)) {
          // 过滤：两个都为 -1 才不显示
          const filtered = data.data.filter(item => {
            return !(item.expertScore === -1 && item.volkswagenScore === -1);
          });
          // 按分数从高到低排序，未打分(-1)放最后
          this.scoreList = filtered.sort((a, b) => {
          const sa = a.endScore === -1 ? -999 : a.endScore;
          const sb = b.endScore === -1 ? -999 : b.endScore;
          return sb - sa;
        }).map((item, realIndex)=>{
          // realIndex 是全局真实下标，从0开始，真实排名=realIndex+1
          return {
            ...item,
            realRank: realIndex + 1
          }
        });
          this.scoreListOffset = 0;
        }
      } catch (e) {}
    },
    startPoll() {
      this.fetchLatest();
      this._scoreTimer = setInterval(() => {
        this.fetchLatest();
      }, 10000);
      this.fetchScoreList();
      this._scoreListSyncTimer = setInterval(() => {
        this.fetchScoreList();
      }, 60000);
    },
    startIdleSpeech() {
      this._idleSpeechTimer = setInterval(() => {
        if (!this.lastData) {
          this.setSpeech(IDLE[Math.floor(Math.random() * IDLE.length)]);
        }
      }, 7000);
    },
    toggleScoreList() {
      this.showScoreList = !this.showScoreList;
      if (this.showScoreList) {
        this.fetchScoreList();
        this.startScoreListCycle();
      } else {
        if (this._scoreListTimer) {
          clearInterval(this._scoreListTimer);
          this._scoreListTimer = null;
        }
      }
    },
    startScoreListCycle() {
      if (this._scoreListTimer) clearInterval(this._scoreListTimer);
      this._scoreListTimer = setInterval(() => {
        const next = this.scoreListOffset + 6;
        this.scoreListOffset = next >= this.scoreList.length ? 0 : next;
      }, 10000);
    },
    getSectorPath(index) {
      const cx = 380;
      const cy = 380;
      const outerR = 380;
      const innerR = 220;
      const gap = 3;
      const sectorAngle = (180 - gap * 3) / 4;
      // 从左边 180° 开始，向右走
      const startAngle = 180 - index * (sectorAngle + gap);
      const endAngle = startAngle - sectorAngle;
      const toPoint = (radius, angle) => {
        const rad = angle * Math.PI / 180;
        return {
          x: cx + radius * Math.cos(rad),
          y: cy - radius * Math.sin(rad),
        };
      };
      const outerStart = toPoint(outerR, startAngle);
      const outerEnd = toPoint(outerR, endAngle);
      const innerEnd = toPoint(innerR, endAngle);
      const innerStart = toPoint(innerR, startAngle);
      return `M ${outerStart.x} ${outerStart.y} A ${outerR} ${outerR} 0 0 1 ${outerEnd.x} ${outerEnd.y} L ${innerEnd.x} ${innerEnd.y} A ${innerR} ${innerR} 0 0 0 ${innerStart.x} ${innerStart.y} Z`;
    },
    getSectorValuePath(value, index) {
      if (value === null || value === undefined || value === '') return '';
      const score = Number(value);
      if (!Number.isFinite(score) || score <= 0) return '';
      const cx = 380;
      const cy = 380;
      const outerR = 380;
      const innerR = 220;
      const gap = 3;
      const sectorAngle = (180 - gap * 3) / 4;
      // 限制在 0 ~ 5
      const ratio = Math.max(0, Math.min(score, 5)) / 5;
      const startAngle = 180 - index * (sectorAngle + gap);
      const endAngle = startAngle - sectorAngle * ratio;
      const toPoint = (radius, angle) => {
        const rad = angle * Math.PI / 180;
        return {
          x: cx + radius * Math.cos(rad),
          y: cy - radius * Math.sin(rad),
        };
      };
      const outerStart = toPoint(outerR, startAngle);
      const outerEnd = toPoint(outerR, endAngle);
      const innerEnd = toPoint(innerR, endAngle);
      const innerStart = toPoint(innerR, startAngle);
      return `M ${outerStart.x} ${outerStart.y} A ${outerR} ${outerR} 0 0 1 ${outerEnd.x} ${outerEnd.y} L ${innerEnd.x} ${innerEnd.y} A ${innerR} ${innerR} 0 0 0 ${innerStart.x} ${innerStart.y} Z`;
    },
    getTextPosition(index) {
      const cx = 380;
      const cy = 380;
      const radius = 280;
      const gap = 5;
      const sectorAngle = (180 - gap * 3) / 4;
      const startAngle = 180 - index * (sectorAngle + gap);
      const endAngle = startAngle - sectorAngle;
      const middleAngle = (startAngle + endAngle) / 2;
      const rad = middleAngle * Math.PI / 180;
      return {
        x: cx + radius * Math.cos(rad),
        y: cy - radius * Math.sin(rad),
      };
    },
    formatScore(value) {
      if (value === null || value === undefined || value === '') return '—';
      const num = Number(value);
      if (!Number.isFinite(num)) return '—';
      return num.toFixed(1);
    },
  },
};
</script>

<style>
.screen-cover {
  position: fixed;
  inset: 0;
  width:100vw;
  height:100vh;
  overflow: hidden;
}
.screen-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: url('../assets/img/毓秀杯背景.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(2px);
  transform: scale(1.05);
}
.screen-page {
  width: 2000px;
  height: 1080px;
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  color: #FFF8FF;
  display: flex;
  flex-direction: column;
  z-index: 1;
}
canvas#stars { position: absolute; inset: 0; z-index: 0; }
.blob { position: absolute; border-radius: 50%; filter: blur(90px); z-index: 0; }
.b1 { width: 700px; height: 700px; top: -200px; left: -150px; background: rgba(168,85,247,.2); }
.b2 { width: 600px; height: 600px; bottom: -180px; right: -120px; background: rgba(255,143,171,.16); }
/* 标题 */
.header { position: relative; z-index: 1; text-align: center; padding: 28px 0 14px; }
.badge {
  position: relative;
  margin-top:-25px;
  font-size: 70px;
  font-weight: bold;
  background: linear-gradient(180deg, #F7F09B 30%, #8C4F03 70%);
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 12px;
  letter-spacing: 1px;
}
.title {
  font-family: "STKaiti","KaiTi",serif;
  font-size: 34px;
  color: #FDE175;
  margin-bottom: 30px;
}
.title-line-left{
  position: relative;
  font-size: 20px;
  margin-right: 30px;
  color:#897745;
  top: -5px;
}
.title-line-right{
  position: relative;
  font-size: 20px;
  margin-left: 30px;
  color:#897745;
  top: -5px;
}
/* 主体布局 */
.main {
  flex: 1; min-height: 0;
  display: flex; gap: 48px; align-items: flex-start;
  width: 1760px; margin: 0 auto; padding-bottom: 24px;
  position: relative; z-index: 1;
}
/* 左侧角色列 */
.char-col {
  position: relative;
  width: 400px;
  height: 600px;
  flex-shrink: 0;
  background:#21192E;
  border: 2px solid #DBA612;
  border-radius: 24px;
  padding: 20px 20px 24px;
  text-align: center;
  box-shadow: 0 16px 60px rgba(0,0,0,.6);
  margin-left: -90px;
}
.char-name {
  font-family: "STKaiti","KaiTi",serif;
  font-size: 26px;
  font-weight: 900;
  margin:0 auto;
  width: 280px;
  border-radius: 20px;
  margin-bottom: 25px;
  color:#050609;
  background: #FDD93B;
  margin-top: 70px;
}
.char-role {
  font-size: 18px;
  color:#9A948C;
  margin-top: 20px;
}
.speech {
  font-size: 16px;
  margin-top: 30px;
  line-height: 1.7;
}
.char-video-bg{
  width:400px;
}
.score-col {
  position: relative;
  width: 1380px;
  margin-left: -20px;
}
.player-card {
  height: 130px; flex-shrink: 0;
  background: #21192C;
  border: 2px solid #DBA612;
  border-radius: 24px;
  padding: 30px 36px;
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
}
.label { 
  font-size: 30px; 
  color: #D7BD67; 
  letter-spacing: 2px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.p-name {
  font-family: "STKaiti", KaiTi, serif;
  font-size: 32px;
  color: #fff;
  letter-spacing: 1px;
  font-weight: 600;
}
.p-work {
  font-family: "STKaiti", KaiTi, serif;
  font-size: 32px;
  color: #fff;
  letter-spacing: 1px;
  font-weight: 600;
}
.total-box { text-align: center; padding-left: 36px; border-left: 1px solid rgba(168,85,247,.2); }
.total-num {
  font-family: "STKaiti","KaiTi",serif; font-size: 96px; font-weight: 900; line-height: 1;
  background: linear-gradient(135deg,#F0D27A,#FF8FAB,#C084FC); background-size: 220% auto;
  -webkit-background-clip: text; color: transparent; animation: shimmer 5s linear infinite;
}
.total-sub { font-size: 14px; color: rgba(255,255,255,.38); margin-top: 4px; }
@keyframes shimmer {
  0% { background-position: 0% 0%; }
  100% { background-position: 220% 0%; }
}
/* 四扇形评分区域 */
.score-radar {
  position: relative;
  background: #20172D;
  border: 2px solid#DBA612;
  border-radius: 24px;
  display: flex;
  justify-content: space-between;
  padding: 25px;
  align-items: center;
  width: 100%;
  height: 625px;
  box-sizing: border-box;
}
/* 单人模式：居中 */
.score-radar.singleMode {
  justify-content: center;
}
.semi-left,
.semi-right {
  width: 48%; 
  flex-shrink: 0;
}
.score-semicircle {
  position: relative;
  top: -20px;
  width: 100%;
}
/* 扇形背景 */
.sector-bg {
  fill: #BABABA;
  stroke:#BABABA;
  stroke-width: 2;
}

/* 实际得分填充 */
.sector-first {
  fill: #F6DD7D;
  stroke-width: 2;
  transition: d .7s ease, fill .4s ease;
}
.sector-second {
  fill: #F5D313;
  stroke-width: 2;
  transition: d .7s ease, fill .4s ease;
}
.sector-three {
  fill: #F2AC14;
  stroke-width: 2;
  transition: d .7s ease, fill .4s ease;
}
.sector-four {
  fill: #EF7611;
  stroke-width: 2;
  transition: d .7s ease, fill .4s ease;
}
/* 分数文字 */
.sector-score {
  position: relative;
  fill: #676767;
  font-size: 35px;
  font-weight: 900;
  text-anchor: middle;
}
/* 项目名称 */
.sector-label {
  fill: #676767;
  font-size: 30px;
  font-weight: 700;
  text-anchor: middle;
}
/* 中央「得分」 */
.center-small {
  fill: rgba(255, 255, 255, .55);
  font-size: 40px;
  font-weight: 500;
  text-anchor: middle;
}
/* 中央总分 */
.center-total {
  fill: #FDE175;
  font-size: 80px;
  font-weight: 900;
  text-anchor: middle;
  filter: drop-shadow(0 0 12px rgba(240, 210, 122, .55));
}
/* 当前选手 */
.radar-player {
  position: relative;
  top: -20px;
  width: 566px;
  padding: 10px 35px;
  text-align: center;
  font-family: "STKaiti", "KaiTi", serif;
  font-size:40px;
  font-weight: 900;
  color: #fff;
}
.avg-score {
  position: relative;
  top: -120px;
  text-align: center;
  font-family: "STKaiti", "KaiTi", serif;
  font-size: 50px;
  font-weight: 900;
  color: #FDD93D;
}

.avg-score-light{
  color: #FEE175;
  fill: #FDE175;
  font-size: 60px;
  font-weight: 900;
  text-anchor: middle;
  filter: drop-shadow(0 0 12px rgba(240, 210, 122, .55));
}

/* 排行榜按钮 */
.score-list-button {
  position: relative;
  right: -1382px;
  top: -600px;
  width: 35px;
  height: 200px;
  background: #FEDB4B;
  border: 1px solid rgba(168,85,247,.6);
  border-radius: 14px 0 0 14px;
  z-index: 100;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background .2s, box-shadow .2s;
  user-select: none;
}
.slb-arrow {
  font-size: 20px;
  color:#05060A;
}
.slb-label {
  writing-mode: vertical-rl;
  font-size: 20px;
  letter-spacing: 3px;
  color: #05060A;
  font-weight: 900;
}
.score-list {
  position: relative;
  top: -1130px;
  width: 1278px;
  height: 765px;
  background: #21192C;
  border: 2px solid #DBA612;
  border-radius: 25px;
  z-index: 20;
  padding: 36px 48px 40px;
  box-shadow: 0 16px 60px rgba(0,0,0,.6);
}
.sl-header {
  font-family: "STKaiti","KaiTi",serif;
  font-size: 38px;
  font-weight: 750;
  letter-spacing: 5px;
  margin-top: -15px;
  margin-bottom: 10px;
  text-align: center;
  color: #FDE175;
}
.sl-header-tip{
  font-size: 20px;
  font-weight: 100;
  letter-spacing:1px;
  margin-bottom: 20px;
  text-align: center;
  color: #ACAAAE;
}
.sl-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(#fff, #fff);
  background-repeat: repeat-y;
  background-position: 160px 0;
  background-size: 1px 100%;
}
.sl-row {
  display: flex;
  padding: 20px 16px;
  font-size: 32px;
  font-weight: 100;
  text-align: center;
  justify-content: center;
  align-items: center;
  background: linear-gradient(90deg, #fff 0 15px, transparent 0 15px);
  background-size: 30px 1px;
  background-repeat: repeat-x;
}
.sl-rank {
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 700;
}
.medal {
  transform: scale(1.5);
  display: inline-block;
}
/* 金银铜颜色 */
.medal:nth-child(1) {
  color: #FFD700;
}
.medal:nth-child(2) {
  color: #C0C0C0;
}
.medal:nth-child(3) {
  color: #CD7F32;
}
.sl-rank-header{
  margin-left: 50px;
}
.sl-name {
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sl-score {
  width: 300px;
}
.sl-avg-score{
  width: 200px;
  text-align: center;
  font-size: 45px;
  color: #FDE076;
  font-weight: 750;
}
/* 排行榜表头样式 */
.sl-header-row {
  background: #40342B;
  border-top: 2px solid #fff;
  display: flex;
  padding: 20px 16px;
  text-align: center;
  background-image: linear-gradient(#fff, #fff);
  background-repeat: repeat-y;
  background-position: 160px 0;
  background-size: 1px 100%;
}
.sl-header-item {
  color: #F4DE8D;
  font-weight: bold;
  font-size: 30px;
}
body.has-yuxiucup-screen {
  background-image: none !important;
}
body.has-yuxiucup-screen .logo,
body.has-yuxiucup-screen .particles {
  display: none !important;
}
</style>
