<template>
  <div class="screen-cover">
    <div class="screen-page" ref="page">
      <canvas id="stars"></canvas>
      <div class="blob b1"></div>
      <div class="blob b2"></div>

      <div class="header">
        <div class="badge">✦ 毓秀杯电影配音交流赛 · 第一期 · 2026 ✦</div>
        <div class="title">以声会友&emsp;深入人心</div>
      </div>

      <div class="sep">
        <div class="sep-line"></div>
        <span>◆</span>
        <div class="sep-line r"></div>
      </div>

      <div class="main">
        <!-- 左侧：水滴人角色 -->
        <div class="char-col">
          <div class="char-wrap">
            <div class="halo"></div>

            <!-- SVG 水滴人：3D渐变 + 挥手 + 眨眼 + 表情变化 -->
            <svg id="shuiDiRen" class="char-svg" viewBox="0 0 280 420" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <!-- 身体 3D 渐变：左上亮、右下暗 -->
                <radialGradient id="bG" cx="36%" cy="28%" r="70%">
                  <stop offset="0%"   stop-color="#CCF0FF"/>
                  <stop offset="40%"  stop-color="#7ECCE8"/>
                  <stop offset="100%" stop-color="#3A8AB8"/>
                </radialGradient>
                <!-- 头发渐变 -->
                <radialGradient id="hG" cx="35%" cy="30%" r="65%">
                  <stop offset="0%"   stop-color="#5898E0"/>
                  <stop offset="100%" stop-color="#0A3498"/>
                </radialGradient>
                <!-- 眼白渐变 -->
                <radialGradient id="ewG" cx="35%" cy="30%" r="65%">
                  <stop offset="0%"   stop-color="#FFFFFF"/>
                  <stop offset="100%" stop-color="#D5EDF8"/>
                </radialGradient>
                <!-- 瞳孔渐变 -->
                <radialGradient id="puG" cx="30%" cy="28%" r="62%">
                  <stop offset="0%"   stop-color="#3060A0"/>
                  <stop offset="55%"  stop-color="#081840"/>
                  <stop offset="100%" stop-color="#040C20"/>
                </radialGradient>
                <!-- 手臂/腿渐变 -->
                <radialGradient id="lG" cx="40%" cy="30%" r="65%">
                  <stop offset="0%"   stop-color="#A0D8F0"/>
                  <stop offset="100%" stop-color="#58AACC"/>
                </radialGradient>
                <!-- 阴影滤镜 -->
                <filter id="fSh" x="-15%" y="-5%" width="135%" height="125%">
                  <feDropShadow dx="2" dy="5" stdDeviation="5" flood-color="rgba(8,36,80,0.3)"/>
                </filter>
                <!-- 身体剪裁（用于条纹衬衫） -->
                <clipPath id="bClip">
                  <path d="M140,68 C166,54 210,87 225,140 C242,196 238,254 221,300 C204,334 183,352 140,352 C97,352 76,334 59,300 C42,254 38,196 55,140 C70,87 114,54 140,68 Z"/>
                </clipPath>
              </defs>

              <!-- 地面阴影 -->
              <ellipse cx="140" cy="412" rx="62" ry="8" fill="rgba(30,80,140,0.2)"/>

              <!-- 左腿 + 靴子 -->
              <path d="M117,345 Q113,370 111,384 Q113,395 122,395 Q131,395 129,384 Q127,370 123,345 Z"
                    fill="url(#lG)" stroke="#4A90B8" stroke-width="1.5"/>
              <ellipse cx="116" cy="396" rx="23" ry="13" fill="#5AAAD0" stroke="#388AB0" stroke-width="1.5"/>
              <ellipse cx="116" cy="389" rx="15" ry="10" fill="#6ABADC"/>

              <!-- 右腿 + 靴子 -->
              <path d="M163,345 Q167,370 169,384 Q167,395 158,395 Q149,395 151,384 Q153,370 157,345 Z"
                    fill="url(#lG)" stroke="#4A90B8" stroke-width="1.5"/>
              <ellipse cx="164" cy="396" rx="23" ry="13" fill="#5AAAD0" stroke="#388AB0" stroke-width="1.5"/>
              <ellipse cx="164" cy="389" rx="15" ry="10" fill="#6ABADC"/>

              <!-- 左臂（自然下垂，在身体后面） -->
              <path d="M85,222 Q62,244 56,275 Q53,298 62,310 Q73,320 85,314 Q96,306 98,286 Q102,263 101,240"
                    fill="url(#lG)" stroke="#4A90B8" stroke-width="2"/>
              <!-- 左手 -->
              <circle cx="60" cy="312" r="15" fill="url(#lG)" stroke="#4A90B8" stroke-width="1.5"/>
              <ellipse cx="47" cy="308" rx="7" ry="10" fill="url(#lG)" stroke="#4A90B8" stroke-width="1.2"/>
              <ellipse cx="44" cy="318" rx="7" ry="9"  fill="url(#lG)" stroke="#4A90B8" stroke-width="1.2"/>

              <!-- 主体（水滴形状，带3D渐变） -->
              <path d="M140,68 C166,54 210,87 225,140 C242,196 238,254 221,300 C204,334 183,352 140,352 C97,352 76,334 59,300 C42,254 38,196 55,140 C70,87 114,54 140,68 Z"
                    fill="url(#bG)" stroke="#3A88B0" stroke-width="2.5" filter="url(#fSh)"/>
              <!-- 身体高光（3D光泽感） -->
              <ellipse cx="102" cy="128" rx="26" ry="44" fill="rgba(255,255,255,0.17)" transform="rotate(-18,102,128)"/>

              <!-- 条纹衬衫（剪裁到身体内） -->
              <g clip-path="url(#bClip)">
                <rect x="38" y="244" width="204" height="112" fill="#F8F8F8"/>
                <rect x="38" y="244" width="204" height="14" fill="#2860C8"/>
                <rect x="38" y="270" width="204" height="14" fill="#2860C8"/>
                <rect x="38" y="296" width="204" height="14" fill="#2860C8"/>
                <rect x="38" y="322" width="204" height="14" fill="#2860C8"/>
                <rect x="38" y="348" width="204" height="14" fill="#2860C8"/>
                <!-- 领口阴影 -->
                <rect x="38" y="244" width="204" height="2" fill="rgba(0,30,100,0.15)"/>
                <!-- 胸前徽章 -->
                <circle cx="140" cy="280" r="16" fill="rgba(10,42,132,0.9)" stroke="rgba(255,255,255,0.75)" stroke-width="1.5"/>
                <text x="140" y="286" text-anchor="middle" fill="white" font-size="9" font-family="sans-serif" font-weight="bold">毓秀</text>
              </g>
              <!-- 短裤（深色） -->
              <g clip-path="url(#bClip)">
                <rect x="38" y="340" width="204" height="18" fill="rgba(42,38,68,0.92)"/>
              </g>

              <!-- 右臂（举起挥手，在身体前面） -->
              <g class="arm-wave">
                <path d="M197,222 Q220,202 236,173 Q246,151 240,139 Q232,127 220,131 Q210,136 205,154 Q199,177 197,203"
                      fill="url(#lG)" stroke="#4A90B8" stroke-width="2"/>
                <!-- 右手 -->
                <circle cx="239" cy="135" r="16" fill="url(#lG)" stroke="#4A90B8" stroke-width="1.5"/>
                <!-- 手指 -->
                <ellipse cx="242" cy="120" rx="6" ry="10" fill="url(#lG)" stroke="#4A90B8" stroke-width="1.2"/>
                <ellipse cx="252" cy="124" rx="5" ry="9"  fill="url(#lG)" stroke="#4A90B8" stroke-width="1.2"/>
                <ellipse cx="258" cy="134" rx="5" ry="7"  fill="url(#lG)" stroke="#4A90B8" stroke-width="1.2"/>
              </g>

              <!-- 左眼 -->
              <g class="char-eye" style="transform-box:fill-box;transform-origin:50% 50%">
                <ellipse cx="112" cy="172" rx="25" ry="27" fill="url(#ewG)" stroke="#2A78A0" stroke-width="1.8"/>
                <ellipse cx="113" cy="175" rx="17" ry="19" fill="url(#puG)"/>
                <ellipse cx="113" cy="175" rx="10" ry="11" fill="#04081C"/>
                <!-- 眼白高光 -->
                <ellipse cx="106" cy="164" rx="6.5" ry="7.5" fill="white" opacity="0.94"/>
                <ellipse cx="118" cy="179" rx="3.5" ry="4"   fill="rgba(255,255,255,0.55)"/>
                <!-- 上眼睑弧线 -->
                <path d="M88,165 Q112,152 136,165" fill="none" stroke="#1A5878" stroke-width="2.5" stroke-linecap="round"/>
              </g>

              <!-- 右眼 -->
              <g class="char-eye" style="transform-box:fill-box;transform-origin:50% 50%">
                <ellipse cx="168" cy="172" rx="25" ry="27" fill="url(#ewG)" stroke="#2A78A0" stroke-width="1.8"/>
                <ellipse cx="169" cy="175" rx="17" ry="19" fill="url(#puG)"/>
                <ellipse cx="169" cy="175" rx="10" ry="11" fill="#04081C"/>
                <ellipse cx="162" cy="164" rx="6.5" ry="7.5" fill="white" opacity="0.94"/>
                <ellipse cx="174" cy="179" rx="3.5" ry="4"   fill="rgba(255,255,255,0.55)"/>
                <path d="M144,165 Q168,152 192,165" fill="none" stroke="#1A5878" stroke-width="2.5" stroke-linecap="round"/>
              </g>

              <!-- 腮红 -->
              <ellipse cx="86"  cy="208" rx="20" ry="13" fill="rgba(255,130,130,0.35)"/>
              <ellipse cx="194" cy="208" rx="20" ry="13" fill="rgba(255,130,130,0.35)"/>

              <!-- 嘴巴（JS控制表情） -->
              <path id="charMouth" d="M118,230 Q140,252 162,230"
                    stroke="#1A5878" stroke-width="3.5" fill="none" stroke-linecap="round"/>
              <!-- 张嘴内部（兴奋时显示） -->
              <ellipse id="mouthInner" cx="140" cy="242" rx="19" ry="13" fill="#CC3355" opacity="0"/>
              <ellipse id="mouthTeeth" cx="140" cy="234" rx="16" ry="7"  fill="white"   opacity="0"/>

              <!-- 头发（深蓝渐变，左上高光） -->
              <circle cx="145" cy="50"  r="40" fill="url(#hG)" stroke="#082A80" stroke-width="2"/>
              <circle cx="168" cy="22"  r="22" fill="url(#hG)" stroke="#082A80" stroke-width="2"/>
              <!-- 头发高光 -->
              <ellipse cx="132" cy="38" rx="13" ry="10" fill="rgba(155,210,255,0.42)" transform="rotate(-20,132,38)"/>
              <ellipse cx="160" cy="14" rx="9"  ry="7"  fill="rgba(155,210,255,0.40)" transform="rotate(-15,160,14)"/>
            </svg>

            <div class="char-shadow-ring"></div>
          </div>

          <div class="char-name">小水滴 · AI评委</div>
          <div class="char-role">毓秀杯 · 智能打分官</div>
          <div class="speech" id="speech">你好呀～我是小水滴！<br>准备为选手们认真打分！✨</div>
        </div>

        <!-- 右侧：分数 -->
        <div class="score-col">
          <div class="player-card">
            <div>
              <div class="label">当前选手 : <span class="p-name" id="playerName">— 等待选手 —</span></div>
              <div class="label">作品名称 : <span class="p-work" id="playerWork">— —</span></div>
            </div>
            <div class="total-box">
              <div class="label">综合总分</div>
              <div class="total-num" id="totalScore">—</div>
              <div class="total-sub">满分 80 分</div>
            </div>
          </div>

          <div class="score-grid">
            <div class="sc-card" id="sc0">
              <div class="sc-top"><span class="sc-icon">🎬</span><span class="sc-cat">难度系数</span></div>
              <div class="sc-num" id="n0">—</div>
              <div class="bar-wrap"><div class="bar" id="b0"></div></div>
            </div>
            <div class="sc-card" id="sc1">
              <div class="sc-top"><span class="sc-icon">🎙️</span><span class="sc-cat">作品完成率</span></div>
              <div class="sc-num" id="n1">—</div>
              <div class="bar-wrap"><div class="bar" id="b1"></div></div>
            </div>
            <div class="sc-card" id="sc2">
              <div class="sc-top"><span class="sc-icon">💝</span><span class="sc-cat">发音吐字准确度</span></div>
              <div class="sc-num" id="n2">—</div>
              <div class="bar-wrap"><div class="bar" id="b2"></div></div>
            </div>
            <div class="sc-card" id="sc3">
              <div class="sc-top"><span class="sc-icon">🎭</span><span class="sc-cat">角色还原度</span></div>
              <div class="sc-num" id="n3">—</div>
              <div class="bar-wrap"><div class="bar" id="b3"></div></div>
            </div>
          </div>
        </div>
      </div>

      <div class="cf-wrap" id="cfWrap"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getAiURL } from '@/utils/index';

const api = axios.create({ baseURL: getAiURL(), headers: { 'Content-Type': 'application/json' } });
const FIELDS = ['score1', 'score2', 'score3', 'score4'];
const SPEECH = [
  [72, '哇哦！！满分级别。小水滴超级感动！🌟✨🎉'],
  [60, '太棒了！这位选手实力超强！👏💫'],
  [48, '不错哦！继续努力会更棒！😊💪'],
  [0,  '加油加油！下次一定会更好！💕'],
];
const IDLE = [
  '你好呀～我是小水滴！准备为选手们认真打分！✨',
  '小水滴的耳朵竖起来啦！认真听，认真评！👂✨',
  '毓秀杯加油！每一位选手都很棒！💕',
  '配音是一门艺术，小水滴会仔细欣赏的～🎭',
];

// 各表情对应的嘴巴路径
const MOUTH = {
  idle:     'M118,230 Q140,252 162,230',
  worried:  'M118,236 Q140,226 162,236',
  normal:   'M116,229 Q140,254 164,229',
  happy:    'M112,227 Q140,260 168,227',
  excited:  'M108,225 Q140,272 172,225',
};

export default {
  name: 'Screen',
  data() { return { lastData: null }; },
  mounted() {
    this.scaleScreen();
    window.addEventListener('resize', this.scaleScreen);
    this.initStars();
    this.startPoll();
    this.startIdleSpeech();
  },
  methods: {
    scaleScreen() {
      const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      const el = this.$refs.page;
      el.style.transform = `scale(${scale})`;
      el.style.left = `${(window.innerWidth - 1920 * scale) / 2}px`;
      el.style.top  = `${(window.innerHeight - 1080 * scale) / 2}px`;
    },
    initStars() {
      const cv = document.getElementById('stars');
      const ctx = cv.getContext('2d');
      cv.width = 1920; cv.height = 1080;
      const stars = Array.from({ length: 160 }, () => ({
        x: Math.random() * 1920, y: Math.random() * 1080,
        r: 0.3 + Math.random() * 1.2,
        a: Math.random(), da: (Math.random() - 0.5) * 0.018,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, 1920, 1080);
        stars.forEach(s => {
          s.a += s.da;
          if (s.a <= 0 || s.a >= 1) s.da = -s.da;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(210,170,255,${s.a * 0.6})`;
          ctx.fill();
        });
        requestAnimationFrame(draw);
      };
      draw();
    },
    setSpeech(txt) {
      const el = document.getElementById('speech');
      el.style.opacity = '0';
      setTimeout(() => { el.innerHTML = txt; el.style.opacity = '1'; }, 200);
    },

    // 根据总分更新角色表情（嘴型 + 眼神 + 发光）
    updateExpression(total) {
      const mouth  = document.getElementById('charMouth');
      const mInner = document.getElementById('mouthInner');
      const mTeeth = document.getElementById('mouthTeeth');
      const svg    = document.getElementById('shuiDiRen');
      if (!mouth) return;

      let mouthPath = MOUTH.idle;
      let openOpacity  = '0';
      let teethOpacity = '0';
      let stateClass   = '';

      if (total == null) {
        mouthPath  = MOUTH.idle;
      } else if (total >= 72) {
        mouthPath    = MOUTH.excited;
        openOpacity  = '1';
        teethOpacity = '1';
        stateClass   = 'state-excited';
      } else if (total >= 60) {
        mouthPath  = MOUTH.happy;
        stateClass = 'state-happy';
      } else if (total >= 48) {
        mouthPath  = MOUTH.normal;
        stateClass = 'state-normal';
      } else {
        mouthPath  = MOUTH.worried;
        stateClass = 'state-low';
      }

      mouth.setAttribute('d', mouthPath);
      mInner.setAttribute('opacity', openOpacity);
      mTeeth.setAttribute('opacity', teethOpacity);
      if (svg) svg.setAttribute('class', `char-svg ${stateClass}`);
    },

    confetti() {
      const w = document.getElementById('cfWrap'); w.innerHTML = '';
      const cols = ['#FF8FAB','#C084FC','#F0D27A','#67E8F9','#A3E635','#FB923C'];
      for (let i = 0; i < 90; i++) {
        const d = document.createElement('div'); d.className = 'cf';
        d.style.cssText = `left:${Math.random()*100}%;background:${cols[i%6]};width:${4+Math.random()*8}px;height:${6+Math.random()*10}px;rotate:${Math.random()*360}deg;animation-duration:${1.8+Math.random()*2}s`;
        w.appendChild(d);
      }
      setTimeout(() => { w.innerHTML = ''; }, 4500);
    },

    async fetchLatest() {
      try {
        const { data } = await api.get('/ai/yxb/search/score');
        const d = data.data;
        if (!d) { this.showEmpty(); return; }

        const changed = JSON.stringify(d) !== JSON.stringify(this.lastData);
        this.lastData = d;

        document.getElementById('playerName').innerText = d.name || '— 等待选手 —';
        document.getElementById('playerWork').innerText = d.work ? `《${d.work}》` : '— —';

        let total = 0, counted = 0;
        FIELDS.forEach((field, i) => {
          const val  = d[field];
          const num  = document.getElementById(`n${i}`);
          const bar  = document.getElementById(`b${i}`);
          const card = document.getElementById(`sc${i}`);
          if (val == null || isNaN(val)) {
            num.innerText = '—';
            bar.style.width = '0%'; card.classList.remove('lit');
          } else {
            const v = Number(val);
            num.innerText = v;
            bar.style.width = `${v / 20 * 100}%`; card.classList.add('lit');
            total += v; counted++;
            if (changed) { num.classList.add('bump'); setTimeout(() => num.classList.remove('bump'), 500); }
          }
        });

        document.getElementById('totalScore').innerText = counted > 0 ? total : '—';
        this.updateExpression(counted > 0 ? total : null);

        if (changed && counted > 0 && total >= 72) this.confetti();
        if (changed && counted > 0) {
          const sp = SPEECH.find(s => total >= s[0]);
          if (sp) this.setSpeech(sp[1]);
        }
      } catch (e) {
        this.showEmpty();
      }
    },

    showEmpty() {
      document.getElementById('playerName').innerText = '— 等待选手 —';
      document.getElementById('playerWork').innerText = '— —';
      document.getElementById('totalScore').innerText = '—';
      FIELDS.forEach((_, i) => {
        document.getElementById(`n${i}`).innerText = '—';
        document.getElementById(`b${i}`).style.width = '0%';
        document.getElementById(`sc${i}`).classList.remove('lit');
      });
      this.updateExpression(null);
    },

    startPoll() { this.fetchLatest(); setInterval(this.fetchLatest, 3000); },
    startIdleSpeech() {
      setInterval(() => {
        if (!this.lastData || !this.lastData.name) {
          this.setSpeech(IDLE[Math.floor(Math.random() * IDLE.length)]);
        }
      }, 7000);
    },
  },
};
</script>

<style scoped>
/* ── 全屏遮罩 ── */
.screen-cover {
  position: fixed; inset: 0; z-index: 9999;
  background: #080514; overflow: hidden;
}
:global(.logo), :global(.particles) { display: none !important; }

/* ── 1920×1080 内容区 ── */
.screen-page {
  width: 1920px; height: 1080px;
  position: absolute; top: 0; left: 0;
  transform-origin: 0 0;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  color: #FFF8FF;
  display: flex; flex-direction: column;
}

/* ── 背景 ── */
canvas#stars { position: absolute; inset: 0; z-index: 0; }
.blob { position: absolute; border-radius: 50%; filter: blur(90px); z-index: 0; }
.b1 { width: 700px; height: 700px; top: -200px; left: -150px; background: rgba(168,85,247,.2); }
.b2 { width: 600px; height: 600px; bottom: -180px; right: -120px; background: rgba(255,143,171,.16); }

/* ── 标题 ── */
.header { position: relative; z-index: 1; text-align: center; padding: 28px 0 14px; }
.badge {
  display: inline-block; border: 1px solid rgba(168,85,247,.45); border-radius: 999px;
  padding: 5px 26px; font-size: 50px; letter-spacing: 4px; color: #C084FC; margin-bottom: 12px;
}
.title {
  font-family: "STKaiti","KaiTi",serif; font-size: 54px; font-weight: bold; letter-spacing: 8px;
  background: linear-gradient(135deg, #F0D27A 0%, #FF8FAB 45%, #C084FC 80%, #F0D27A 100%);
  background-size: 220% auto; -webkit-background-clip: text; color: transparent;
  animation: shimmer 5s linear infinite;
}
.subtitle { font-size: 18px; color: rgba(255,255,255,.48); letter-spacing: 5px; margin-top: 8px; }
@keyframes shimmer { 0%{background-position:0% center} 100%{background-position:220% center} }

/* ── 分割线 ── */
.sep {
  display: flex; align-items: center; gap: 16px;
  width: 1760px; margin: 10px auto 20px;
  position: relative; z-index: 1; color: #C084FC; font-size: 16px;
}
.sep-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(192,132,252,.6)); }
.sep-line.r { background: linear-gradient(270deg, transparent, rgba(192,132,252,.6)); }

/* ── 主体布局 ── */
.main {
  flex: 1; min-height: 0;
  display: flex; gap: 48px; align-items: flex-start;
  width: 1760px; margin: 0 auto; padding-bottom: 24px;
  position: relative; z-index: 1;
}

/* ── 左侧角色列 ── */
.char-col {
  width: 500px; 
  height: 750px;
  flex-shrink: 0;
  background: rgba(16,8,40,.95); border: 1px solid rgba(168,85,247,.22); border-radius: 24px;
  padding: 20px 20px 24px; text-align: center;
}
.char-wrap {
  position: relative; width: 310px; height: 360px; margin: 80px auto;
  display: flex; align-items: center; justify-content: center;
}
.halo {
  position: absolute; width: 240px; height: 240px; border-radius: 50%;
  background: radial-gradient(circle, rgba(100,180,255,.18) 0%, transparent 70%);
  animation: halo 3.5s ease-in-out infinite;
}
@keyframes halo { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.15);opacity:.85} }

/* ── 水滴人 SVG ── */
.char-svg {
  width: 240px; height: auto; position: relative; z-index: 1;
  filter: drop-shadow(0 0 10px rgba(100,180,255,0.4));
  animation: charFloat 3.8s ease-in-out infinite;
  transition: filter 0.5s ease;
}
/* 分数状态发光 */
.char-svg.state-normal  { filter: drop-shadow(0 0 12px rgba(168,85,247,.5)); }
.char-svg.state-happy   { filter: drop-shadow(0 0 20px rgba(168,85,247,.75)); }
.char-svg.state-excited { filter: drop-shadow(0 0 28px rgba(240,210,122,.85)) drop-shadow(0 0 14px rgba(255,143,171,.5)); }
.char-svg.state-low     { filter: drop-shadow(0 0 8px rgba(100,150,200,0.3)); }

/* 角色浮动 */
@keyframes charFloat {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-14px); }
}

/* 右臂挥手（transform-origin 对应 SVG 中右臂肩关节坐标 197,222） */
.arm-wave {
  transform-origin: 197px 222px;
  animation: armWave 2s ease-in-out infinite;
}
@keyframes armWave {
  0%, 100% { transform: rotate(0deg); }
  35%       { transform: rotate(-28deg); }
  70%       { transform: rotate(14deg); }
}

/* 眨眼（transform-box:fill-box 让 50% 50% 基于各自眼睛的包围盒） */
.char-eye { animation: eyeBlink 5s ease-in-out infinite; }
.char-eye + .char-eye { animation-delay: 0.1s; }
@keyframes eyeBlink {
  0%, 85%, 95%, 100% { transform: scaleY(1); }
  90%                 { transform: scaleY(0.06); }
}

/* 地面光环 */
.char-shadow-ring {
  position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%);
  width: 130px; height: 14px;
  background: radial-gradient(ellipse, rgba(100,180,255,.35), transparent);
  border-radius: 50%;
  animation: shadowPulse 3.8s ease-in-out infinite;
}
@keyframes shadowPulse {
  0%, 100% { opacity: .5; transform: translateX(-50%) scaleX(1); }
  50%       { opacity: .8; transform: translateX(-50%) scaleX(0.82); }
}

.char-name {
  font-family: "STKaiti","KaiTi",serif; font-size: 28px; font-weight: bold; margin-top: 10px;
  background: linear-gradient(135deg,#7EC8E8,#C084FC);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  margin-bottom: 25px;
}
.char-role { font-size: 15px; color: rgba(255,255,255,.5); letter-spacing: 2px; margin-top: 5px; }
.speech {
  background: rgba(100,180,255,.1); border: 1px solid rgba(100,180,255,.3); border-radius: 14px;
  padding: 12px 16px; font-size: 16px; color: rgba(255,255,255,.88);
  margin-top: 30px; line-height: 1.7; transition: opacity .3s;
}

/* ── 右侧分数列 ── */
.score-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 20px; }

.player-card {
  height: 200px; flex-shrink: 0;
  background: rgba(16,8,40,.95); border: 1px solid rgba(168,85,247,.22); border-radius: 24px;
  padding: 22px 36px; display: flex; justify-content: space-between; align-items: center;
}
.label { font-size: 30px; color: #C084FC; letter-spacing: 2px;margin-top: 30px;margin-bottom: 30px;}
.p-name { 
  font-family: "STKaiti", KaiTi, serif;
  font-size: clamp(26px,6vw,42px);
  background: linear-gradient(135deg, #F0D27A, #FF8FAB, #C084FC);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: .2em;
  font-weight: bold;
}
.p-work { 
  font-family: "STKaiti", KaiTi, serif;
  font-size: clamp(26px,6vw,42px);
  background: linear-gradient(135deg, #F0D27A, #FF8FAB, #C084FC);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: .2em;
  font-weight: bold;
}
.total-box { text-align: center; padding-left: 36px; border-left: 1px solid rgba(168,85,247,.2); }
.total-num {
  font-family: "STKaiti","KaiTi",serif; font-size: 96px; font-weight: 900; line-height: 1;
  background: linear-gradient(135deg,#F0D27A,#FF8FAB,#C084FC); background-size: 220% auto;
  -webkit-background-clip: text; color: transparent; animation: shimmer 5s linear infinite;
}
.total-sub { font-size: 14px; color: rgba(255,255,255,.38); margin-top: 4px; }

.score-grid { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 20px; }
.sc-card {
  height: 210px;
  background: rgba(16,8,40,.95); border: 1px solid rgba(168,85,247,.22); border-radius: 20px;
  padding: 20px 28px; display: flex; flex-direction: column; transition: border-color .3s, box-shadow .3s;
}
.sc-card.lit { border-color: rgba(168,85,247,.8); box-shadow: 0 0 30px rgba(168,85,247,.18); }
.sc-top { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.sc-icon { font-size: 32px; }
.sc-cat  { font-size: 22px; font-weight: bold; color: rgba(255,255,255,.9); }
.sc-num {
  font-size: 76px; font-weight: 900; text-align: center; flex: 1;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg,#F0D27A,#FF8FAB,#C084FC); background-size: 220% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  animation: shimmer 5s linear infinite;
}
.bar-wrap { height: 8px; background: rgba(255,255,255,.08); border-radius: 999px; margin-top: 10px; overflow: hidden; }
.bar { height: 100%; border-radius: 999px; background: linear-gradient(90deg,#A855F7,#FF8FAB,#F0D27A); transition: width .7s ease; }

@keyframes bump { 0%{transform:scale(1)} 40%{transform:scale(1.18)} 100%{transform:scale(1)} }
.sc-num.bump { animation: bump .5s ease, shimmer 5s linear infinite; }

/* ── 彩带 ── */
.cf-wrap { position: absolute; inset: 0; z-index: 200; pointer-events: none; }
.cf { position: absolute; border-radius: 3px; animation: fall linear forwards; }
@keyframes fall { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(105vh) rotate(720deg);opacity:0} }
</style>
