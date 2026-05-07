<template>
  <div class="yuxiu-screen-page">
    <!-- 背景层 -->
    <div class="bg-wrap">
      <div class="bg-grad"></div>
      <canvas id="stars"></canvas>
      <div class="dotgrid"></div>
      <div class="gblob" style="width:480px;height:480px;top:-140px;left:-90px;background:rgba(168,85,247,.18);animation-duration:8s;opacity:.32"></div>
      <div class="gblob" style="width:380px;height:380px;bottom:-90px;right:-70px;background:rgba(255,143,171,.16);animation-duration:10s;animation-delay:-4s;opacity:.28"></div>
    </div>

    <!-- 彩屑特效 -->
    <div class="cf-wrap" id="cfWrap"></div>

    <!-- 主舞台 -->
    <div class="stage">
      <div class="header">
        <div class="h-badge">✦ 毓秀杯电影配音交流赛 · 第一期 · 2026 ✦</div>
        <div class="h-title">以声会友 深入人心</div>
        <div class="h-sub">AI 智能评委 · 实时评分大屏</div>
      </div>
      <div class="dv"><div class="dv-gem"></div></div>

      <div class="main">
        <!-- AI评委角色 -->
        <div class="char-col">
          <div class="char-card">
            <div class="char-stage">
              <span class="fstar" style="top:6px;left:6px;font-size:13px;animation-duration:2.4s">⭐</span>
              <span class="fstar" style="top:16px;right:4px;font-size:10px;animation-duration:3.1s;animation-delay:-.7s">✨</span>
              <span class="fstar" style="bottom:32px;left:2px;font-size:11px;animation-duration:2.8s;animation-delay:-1.3s">💫</span>
              <span class="fstar" style="top:52px;right:-2px;font-size:9px;animation-duration:2s;animation-delay:-.4s">🌟</span>
              
              <svg viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg" class="char-svg">
                <defs>
                  <radialGradient id="bG" cx="50%" cy="40%"><stop offset="0%" stop-color="#FFE8F0"/><stop offset="100%" stop-color="#FFD0E8"/></radialGradient>
                  <radialGradient id="fG" cx="45%" cy="35%"><stop offset="0%" stop-color="#FFF0F5"/><stop offset="100%" stop-color="#FFD6E8"/></radialGradient>
                  <radialGradient id="hG" cx="50%" cy="30%"><stop offset="0%" stop-color="#7C3AED"/><stop offset="60%" stop-color="#5B21B6"/><stop offset="100%" stop-color="#3B0764"/></radialGradient>
                  <radialGradient id="dG" cx="50%" cy="20%"><stop offset="0%" stop-color="#C084FC"/><stop offset="100%" stop-color="#7C3AED"/></radialGradient>
                  <filter id="gl"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                  <filter id="sh"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="rgba(124,58,237,.28)"/></filter>
                </defs>
                <ellipse cx="110" cy="252" rx="55" ry="7" fill="rgba(124,58,237,.16)"/>
                <ellipse cx="110" cy="210" rx="52" ry="45" fill="url(#dG)" filter="url(#sh)"/>
                <path d="M68,195 Q90,185 110,188 Q130,185 152,195 L148,230 Q130,242 110,244 Q90,242 72,230 Z" fill="#A855F7" opacity=".38"/>
                <text x="88" y="222" font-size="12" fill="#F0D27A" opacity=".9">✦</text>
                <text x="118" y="215" font-size="10" fill="#FFB3C6" opacity=".9">✦</text>
                <text x="100" y="236" font-size="8" fill="#C084FC" opacity=".8">✦</text>
                <path d="M72,185 Q48,195 44,215 Q50,220 56,215 Q62,200 78,192 Z" fill="url(#bG)"/>
                <circle cx="44" cy="218" r="10" fill="url(#bG)"/>
                <path d="M36,212 Q34,205 38,204" stroke="#FFB3C6" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <path d="M40,210 Q38,202 42,201" stroke="#FFB3C6" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <path d="M44,210 Q44,202 47,202" stroke="#FFB3C6" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <path d="M148,185 Q172,195 176,215 Q170,220 164,215 Q158,200 142,192 Z" fill="url(#bG)"/>
                <circle cx="176" cy="218" r="10" fill="url(#bG)"/>
                <line x1="176" y1="208" x2="176" y2="170" stroke="#C9A84C" stroke-width="3" stroke-linecap="round"/>
                <polygon points="176,148 181,164 198,164 184,174 189,190 176,180 163,190 168,174 154,164 171,164" fill="#F0D27A" stroke="#C9A84C" stroke-width="1.5" filter="url(#gl)"/>
                <rect x="100" y="155" width="20" height="18" rx="8" fill="url(#bG)"/>
                <ellipse cx="110" cy="130" rx="52" ry="54" fill="url(#fG)" filter="url(#sh)"/>
                <ellipse cx="110" cy="105" rx="52" ry="38" fill="url(#hG)"/>
                <path d="M58,115 Q42,125 44,148 Q52,150 58,140 Q60,128 65,120 Z" fill="url(#hG)"/>
                <path d="M162,115 Q178,125 176,148 Q168,150 162,140 Q160,128 155,120 Z" fill="url(#hG)"/>
                <path d="M64,125 Q30,120 22,145 Q18,162 28,170 Q38,165 36,155 Q38,138 60,138 Z" fill="url(#hG)"/>
                <path d="M156,125 Q190,120 198,145 Q202,162 192,170 Q182,165 184,155 Q182,138 160,138 Z" fill="url(#hG)"/>
                <path d="M52,122 Q44,112 50,108 Q56,112 52,122 Z" fill="#FF8FAB"/>
                <path d="M52,122 Q60,112 66,108 Q62,114 52,122 Z" fill="#FFB3C6"/>
                <circle cx="52" cy="122" r="4" fill="#FF8FAB"/>
                <path d="M168,122 Q160,112 154,108 Q158,114 168,122 Z" fill="#FF8FAB"/>
                <path d="M168,122 Q176,112 182,108 Q176,112 168,122 Z" fill="#FFB3C6"/>
                <circle cx="168" cy="122" r="4" fill="#FF8FAB"/>
                <path d="M72,100 Q78,82 95,80 Q100,92 90,98 Z" fill="url(#hG)"/>
                <path d="M95,80 Q105,74 115,74 Q118,86 108,92 Z" fill="url(#hG)"/>
                <path d="M115,74 Q128,76 136,84 Q128,94 120,92 Z" fill="url(#hG)"/>
                <path d="M136,84 Q148,94 148,106 Q138,108 134,100 Z" fill="url(#hG)"/>
                <ellipse cx="90" cy="132" rx="14" ry="15" fill="white"/>
                <ellipse cx="90" cy="134" rx="10" ry="11" fill="#7C3AED"/>
                <ellipse cx="90" cy="135" rx="7" ry="8" fill="#3B0764"/>
                <circle cx="85" cy="130" r="3.5" fill="white"/>
                <circle cx="93" cy="133" r="1.5" fill="white"/>
                <path d="M76,125 Q83,120 104,124" stroke="#3B0764" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <line x1="78" y1="126" x2="74" y2="121" stroke="#3B0764" stroke-width="2" stroke-linecap="round"/>
                <line x1="84" y1="122" x2="81" y2="117" stroke="#3B0764" stroke-width="2" stroke-linecap="round"/>
                <line x1="91" y1="121" x2="90" y2="116" stroke="#3B0764" stroke-width="2" stroke-linecap="round"/>
                <line x1="98" y1="122" x2="99" y2="118" stroke="#3B0764" stroke-width="2" stroke-linecap="round"/>
                <ellipse cx="130" cy="132" rx="14" ry="15" fill="white"/>
                <ellipse cx="130" cy="134" rx="10" ry="11" fill="#7C3AED"/>
                <ellipse cx="130" cy="135" rx="7" ry="8" fill="#3B0764"/>
                <circle cx="125" cy="130" r="3.5" fill="white"/>
                <circle cx="133" cy="133" r="1.5" fill="white"/>
                <path d="M116,124 Q137,120 144,125" stroke="#3B0764" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <line x1="118" y1="125" x2="115" y2="120" stroke="#3B0764" stroke-width="2" stroke-linecap="round"/>
                <line x1="124" y1="121" x2="122" y2="116" stroke="#3B0764" stroke-width="2" stroke-linecap="round"/>
                <line x1="131" y1="120" x2="130" y2="115" stroke="#3B0764" stroke-width="2" stroke-linecap="round"/>
                <line x1="138" y1="122" x2="140" y2="118" stroke="#3B0764" stroke-width="2" stroke-linecap="round"/>
                <path d="M78,118 Q88,113 100,116" stroke="#5B21B6" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <path d="M120,116 Q132,113 142,118" stroke="#5B21B6" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <ellipse cx="76" cy="148" rx="13" ry="8" fill="#FFB3C6" opacity=".55"/>
                <ellipse cx="144" cy="148" rx="13" ry="8" fill="#FFB3C6" opacity=".55"/>
                <circle cx="110" cy="148" r="3" fill="#FFB3C6" opacity=".7"/>
                <g id="mouth"><path d="M96,158 Q110,170 124,158" stroke="#FF8FAB" stroke-width="3" fill="none" stroke-linecap="round"/></g>
                <circle cx="58" cy="132" r="6" fill="#FFD6E0"/><circle cx="58" cy="132" r="4" fill="#C084FC"/>
                <circle cx="162" cy="132" r="6" fill="#FFD6E0"/><circle cx="162" cy="132" r="4" fill="#C084FC"/>
                <path d="M80,88 Q95,76 110,74 Q125,76 140,88" stroke="#F0D27A" stroke-width="2" fill="none"/>
                <circle cx="110" cy="74" r="6" fill="#F0D27A" filter="url(#gl)"/>
                <circle cx="90" cy="80" r="4" fill="#FFB3C6"/>
                <circle cx="130" cy="80" r="4" fill="#FFB3C6"/>
                <text x="105" y="71" font-size="8" fill="#fff" text-anchor="middle">★</text>
                <path d="M90,166 Q110,175 130,166" stroke="#C084FC" stroke-width="2" fill="none" stroke-linecap="round"/>
                <circle cx="110" cy="172" r="4" fill="#F0D27A"/>
              </svg>
              <div class="char-glow"></div>
            </div>
            <div class="char-name">小秀 · AI评委</div>
            <div class="char-role">毓秀杯 · 智能打分官</div>
            <div class="speech" id="speech">你好呀～我是小秀！<br>准备为选手们认真打分！✨</div>
          </div>
        </div>

        <!-- 评分区域 -->
        <div class="score-col">
          <div class="cb">
            <div>
              <div class="cb-lbl">当前选手 / 作品</div>
              <div class="cb-name" id="cb-name">— 等待选手 —</div>
              <div class="cb-work" id="cb-work"></div>
            </div>
            <div style="text-align:right">
              <div class="total-lbl">综合总分 / 80</div>
              <div class="total-score" id="total-score">—</div>
            </div>
          </div>

          <div class="items-grid" id="items-grid"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'YuxiuScreen',
  data() {
    return {
      prevTs: null,
      CATS: [
        { key:'c0', icon:'🎬', name:'影视内涵' },
        { key:'c1', icon:'🎙️', name:'语音语调' },
        { key:'c2', icon:'💝', name:'情感表达' },
        { key:'c3', icon:'🎭', name:'角色还原度' }
      ],
      SPEECH_BY: [
        [72, 80, '哇哦！！满分级别！小秀超级感动！🌟✨🎉'],
        [60, 72, '太棒了！这位选手实力超强！👏💫'],
        [48, 60, '不错哦！继续努力会更棒！😊💪'],
        [0, 48, '加油加油！下次一定会更好！💕']
      ],
      SPEECH_IDLE: [
        '你好呀～我是小秀！准备为选手们认真打分！✨',
        '小秀的耳朵竖起来啦！认真听，认真评！👂✨',
        '毓秀杯加油！每一位选手都很棒！💕',
        '配音是一门艺术，小秀会仔细欣赏的～🎭',
        '小秀一直在认真听哦！公正是第一位的！⚖️✨'
      ]
    }
  },
  mounted() {
    this.initStars();
    this.initScoreCards();
    this.startPoll();
    this.startIdleSpeech();
  },
  methods: {
    // 初始化星空背景
    initStars() {
      const cv = document.getElementById('stars');
      const ctx = cv.getContext('2d');
      const resize = () => {
        cv.width = window.innerWidth;
        cv.height = window.innerHeight;
      };
      resize();
      window.addEventListener('resize', resize);

      const stars = Array.from({ length: 120 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.2 + Math.random() * 0.8,
        a: Math.random(),
        da: (0.5 - Math.random()) * 0.018
      }));

      const frame = () => {
        ctx.clearRect(0, 0, cv.width, cv.height);
        stars.forEach(s => {
          s.a = Math.max(0, Math.min(1, s.a + s.da));
          if (s.a <= 0 || s.a >= 1) s.da *= -1;
          ctx.beginPath();
          ctx.arc(s.x * cv.width, s.y * cv.height, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,160,255,${s.a * 0.5})`;
          ctx.fill();
        });
        requestAnimationFrame(frame);
      };
      frame();
    },

    // 初始化评分卡片
    initScoreCards() {
      const grid = document.getElementById('items-grid');
      this.CATS.forEach(cat => {
        const d = document.createElement('div');
        d.className = 'si-card';
        d.id = 'card-' + cat.key;
        d.innerHTML = `
          <div class="cc tl"></div>
          <div class="cc br"></div>
          <div>
            <div class="si-icon">${cat.icon}</div>
            <div class="si-name">${cat.name}</div>
          </div>
          <div>
            <div class="si-empty" id="empty-${cat.key}">未评分</div>
            <div class="si-num" id="num-${cat.key}" style="display:none">—</div>
            <div class="si-unit" id="unit-${cat.key}" style="display:none">分 / 20</div>
          </div>
          <div class="si-bar-wrap">
            <div class="si-bar" id="bar-${cat.key}"></div>
          </div>
        `;
        grid.appendChild(d);
      });
    },

    // 设置AI对话气泡
    setSpeech(txt) {
      const el = document.getElementById('speech');
      el.style.opacity = '0';
      setTimeout(() => {
        el.innerHTML = txt;
        el.style.opacity = '1';
      }, 200);
    },

    // 更新AI嘴巴动画
    updateMouth(score) {
      const m = document.getElementById('mouth');
      if (score === null || score === undefined) {
        m.innerHTML = '<path d="M96,158 Q110,170 124,158" stroke="#FF8FAB" stroke-width="3" fill="none" stroke-linecap="round"/>';
      } else if (score >= 72) {
        m.innerHTML = '<path d="M92,154 Q110,172 128,154" stroke="#FF8FAB" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="110" cy="162" rx="12" ry="8" fill="#FFB3C6" opacity=".3"/>';
      } else if (score >= 60) {
        m.innerHTML = '<path d="M94,156 Q110,170 126,156" stroke="#FF8FAB" stroke-width="3" fill="none" stroke-linecap="round"/>';
      } else {
        m.innerHTML = '<path d="M98,162 Q110,158 122,162" stroke="#FF8FAB" stroke-width="3" fill="none" stroke-linecap="round"/>';
      }
    },

    // 彩屑特效
    confetti() {
      const w = document.getElementById('cfWrap');
      w.innerHTML = '';
      const cols = ['#FF8FAB', '#C084FC', '#F0D27A', '#67E8F9', '#A3E635', '#FB923C', '#818CF8'];
      for (let i = 0; i < 80; i++) {
        const d = document.createElement('div');
        d.className = 'cf';
        const c = cols[Math.floor(Math.random() * cols.length)];
        d.style.cssText = `left:${Math.random() * 100}%;background:${c};width:${4 + Math.random() * 8}px;height:${6 + Math.random() * 10}px;rotate:${Math.random() * 360}deg;animation-duration:${1.8 + Math.random() * 2.2}s;animation-delay:${Math.random() * 0.6}s`;
        w.appendChild(d);
      }
      setTimeout(() => (w.innerHTML = ''), 4200);
    },

    // 数据轮询
    poll() {
      let data = null;
      try {
        data = JSON.parse(localStorage.getItem('yuxiu_data') || 'null');
      } catch (e) {}

      if (!data || !data.published) {
        document.getElementById('cb-name').textContent = '— 等待选手 —';
        document.getElementById('cb-work').textContent = '';
        document.getElementById('total-score').textContent = '—';
        this.CATS.forEach(cat => {
          document.getElementById('empty-'+cat.key).style.display = 'block';
          document.getElementById('num-'+cat.key).style.display = 'none';
          document.getElementById('unit-'+cat.key).style.display = 'none';
          document.getElementById('bar-'+cat.key).style.width = '0%';
          document.getElementById('card-'+cat.key).classList.remove('lit');
        });
        this.updateMouth(null);
        return;
      }

      const changed = data.ts !== this.prevTs;
      if (changed) this.prevTs = data.ts;

      document.getElementById('cb-name').textContent = data.name || '— 未知选手 —';
      document.getElementById('cb-work').textContent = data.work ? '《'+data.work+'》' : '';

      let total = 0;
      let cnt = 0;
      this.CATS.forEach((cat, i) => {
        // 修复：去掉 ?. 兼容旧版Vue
        let v = null;
        if (data.scores && data.scores[i] !== undefined) {
          v = data.scores[i];
        }
        
        const emEl = document.getElementById('empty-'+cat.key);
        const numEl = document.getElementById('num-'+cat.key);
        const utEl = document.getElementById('unit-'+cat.key);
        const barEl = document.getElementById('bar-'+cat.key);
        const cardEl = document.getElementById('card-'+cat.key);

        if (v !== null && v !== undefined) {
          emEl.style.display = 'none';
          numEl.style.display = 'block';
          utEl.style.display = 'block';
          const prev = numEl.dataset.prev;
          numEl.textContent = v;

          if (changed && prev !== String(v)) {
            numEl.classList.remove('bump');
            numEl.offsetWidth;
            numEl.classList.add('bump');
          }

          numEl.dataset.prev = String(v);
          barEl.style.width = (v / 20 * 100) + '%';
          cardEl.classList.add('lit');
          total += v;
          cnt++;
        } else {
          emEl.style.display = 'block';
          numEl.style.display = 'none';
          utEl.style.display = 'none';
          barEl.style.width = '0%';
          cardEl.classList.remove('lit');
        }
      });

      const tEl = document.getElementById('total-score');
      if (cnt > 0) {
        const t = (data.total !== undefined && data.total !== null) ? data.total : total;
        const prevT = tEl.dataset.prev;
        tEl.textContent = t;

        if (changed && prevT !== String(t)) {
          tEl.classList.remove('bump');
          tEl.offsetWidth;
          tEl.classList.add('bump');
        }

        tEl.dataset.prev = String(t);
        this.updateMouth(t);

        if (changed) {
          const f = this.SPEECH_BY.find((item) => {
            return t >= item[0] && t <= item[1];
          });
          if (f) this.setSpeech(f[2]);
          if (t >= 72) this.confetti();
        }
      } else {
        tEl.textContent = '—';
        this.updateMouth(null);
      }
    },

    // 启动轮询
    startPoll() {
      this.poll();
      setInterval(() => this.poll(), 500);
    },

    // 空闲随机台词
    startIdleSpeech() {
      setInterval(() => {
        let data = null;
        try {
          data = JSON.parse(localStorage.getItem('yuxiu_data') || 'null');
        } catch (e) {}
        if (!data || !data.published) {
          this.setSpeech(this.SPEECH_IDLE[Math.floor(Math.random() * this.SPEECH_IDLE.length)]);
        }
      }, 7000);
    }
  }
};
</script>

<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --pink:#FF8FAB;--pink2:#FFB3C6;
  --gold:#C9A84C;--gold2:#F0D27A;
  --purple:#A855F7;--purple2:#C084FC;
  --bg:#0F0A1E;
  --font:"PingFang SC","Microsoft YaHei","微软雅黑","Hiragino Sans GB",sans-serif;
  --font-title:"STKaiti","KaiTi","楷体","STSong","SimSun","宋体",serif;
}
/* html,body{width:100%;height:100%;overflow:hidden;background:var(--bg);font-family:var(--font)
} */
.bg-wrap{position:fixed;inset:0;z-index:0;overflow:hidden}
.bg-grad{position:absolute;inset:0;
  background:radial-gradient(ellipse 90% 60% at 10% 10%,rgba(168,85,247,.22) 0%,transparent 55%),
    radial-gradient(ellipse 70% 70% at 90% 90%,rgba(255,143,171,.16) 0%,transparent 55%),
    radial-gradient(ellipse 50% 50% at 50% 50%,rgba(34,211,238,.06) 0%,transparent 65%),#0F0A1E}
.dotgrid{position:absolute;inset:0;
  background-image:radial-gradient(circle,rgba(168,85,247,.13) 1px,transparent 1px);
  background-size:44px 44px;animation:gridMove 28s linear infinite}
@keyframes gridMove{from{background-position:0 0}to{background-position:44px 44px}}
.gblob{position:absolute;border-radius:50%;filter:blur(70px);animation:bF ease-in-out infinite alternate}
@keyframes bF{from{transform:translate(0,0) scale(1)}to{transform:translate(20px,-30px) scale(1.08)}}
canvas#stars{position:absolute;inset:0;width:100%;height:100%}
.stage{position:fixed;inset:0;z-index:10;display:flex;flex-direction:column;align-items:center;padding:16px 28px 14px}
.header{text-align:center;margin-bottom:10px;animation:popIn .8s cubic-bezier(.34,1.56,.64,1) both}
@keyframes popIn{from{opacity:0;transform:scale(.85) translateY(-16px)}to{opacity:1;transform:scale(1) translateY(0)}}
.h-badge{display:inline-block;background:linear-gradient(135deg,rgba(168,85,247,.2),rgba(255,143,171,.2));border:1px solid rgba(168,85,247,.4);border-radius:999px;padding:3px 16px;font-size:11px;letter-spacing:.5em;color:var(--purple2);margin-bottom:5px}
.h-title{font-family:var(--font-title);font-size:clamp(28px,5vw,62px);font-weight:bold;background:linear-gradient(135deg,var(--gold2) 0%,var(--pink) 50%,var(--purple2) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:.2em;line-height:1.1}
.h-sub{font-size:clamp(10px,1.3vw,13px);color:rgba(255,255,255,.32);letter-spacing:.45em;margin-top:3px}
.dv{width:min(560px,86vw);height:1px;background:linear-gradient(90deg,transparent,rgba(192,132,252,.45),rgba(240,210,122,.45),rgba(192,132,252,.45),transparent);margin:7px auto 12px;position:relative}
.dv-gem{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:7px;height:7px;background:var(--gold2);rotate:45deg;box-shadow:0 0 7px var(--gold)}
.main{display:flex;gap:22px;align-items:flex-start;width:100%;flex:1;min-height:0}
.char-col{flex:0 0 clamp(160px,21vw,270px);display:flex;flex-direction:column;align-items:center;animation:popIn .9s cubic-bezier(.34,1.56,.64,1) .1s both}
.char-card{background:linear-gradient(155deg,rgba(26,16,53,.97),rgba(15,10,30,.99));border:1px solid rgba(168,85,247,.3);border-radius:22px;padding:18px 14px 14px;text-align:center;box-shadow:0 0 36px rgba(168,85,247,.1),inset 0 1px 0 rgba(255,255,255,.04);position:relative;overflow:hidden;width:100%}
.char-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(192,132,252,.6),transparent)}
.char-stage{position:relative;width:clamp(120px,16vw,210px);height:clamp(140px,19vw,250px);margin:0 auto 8px}
.char-glow{position:absolute;bottom:6px;left:50%;transform:translateX(-50%);width:70%;height:18px;border-radius:50%;background:radial-gradient(ellipse,rgba(168,85,247,.45) 0%,transparent 70%);animation:glowP 2.5s ease-in-out infinite alternate}
@keyframes glowP{from{opacity:.4;transform:translateX(-50%) scaleX(1)}to{opacity:1;transform:translateX(-50%) scaleX(1.2)}}
.fstar{position:absolute;animation:fF ease-in-out infinite alternate;pointer-events:none;line-height:1}
@keyframes fF{from{transform:translate(0,0) rotate(0deg);opacity:.7}to{transform:translate(4px,-10px) rotate(18deg);opacity:1}}
.char-svg{width:100%;height:100%;display:block;filter:drop-shadow(0 0 16px rgba(168,85,247,.4))}
.char-name{font-family:var(--font-title);font-size:clamp(14px,2vw,22px);font-weight:bold;background:linear-gradient(135deg,var(--pink),var(--purple2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:.2em;margin-bottom:2px}
.char-role{font-size:10px;color:rgba(255,255,255,.32);letter-spacing:.38em;margin-bottom:8px}
.speech{background:linear-gradient(135deg,rgba(168,85,247,.1),rgba(255,143,171,.07));border:1px solid rgba(168,85,247,.2);border-radius:12px;padding:9px 11px;font-size:clamp(10px,1.2vw,12px);color:rgba(255,255,255,.72);line-height:1.65;text-align:left;min-height:44px;position:relative;transition:opacity .4s}
.speech::before{content:'💬';position:absolute;top:-9px;left:10px;font-size:14px}
.score-col{flex:1;min-width:0;display:flex;flex-direction:column;gap:11px}
.cb{background:linear-gradient(135deg,rgba(26,16,53,.97),rgba(15,10,30,.99));border:1px solid rgba(201,168,76,.3);border-radius:16px;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;position:relative;overflow:hidden;animation:popIn .9s cubic-bezier(.34,1.56,.64,1) .15s both}
.cb::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.5),transparent)}
.cb-lbl{font-size:10px;letter-spacing:.5em;color:var(--gold);opacity:.62;margin-bottom:2px}
.cb-name{font-family:var(--font-title);font-size:clamp(16px,2.6vw,32px);color:#fff;letter-spacing:.2em;font-weight:bold}
.cb-work{font-size:clamp(10px,1.3vw,14px);color:rgba(255,255,255,.38);letter-spacing:.22em;margin-top:1px}
.total-lbl{font-size:10px;letter-spacing:.5em;color:var(--gold);opacity:.62;margin-bottom:1px;text-align:right}
.total-score{font-size:clamp(30px,5.5vw,68px);font-weight:900;background:linear-gradient(135deg,var(--gold2),var(--pink),var(--purple2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;text-align:right;letter-spacing:.03em;transition:all .4s}
.total-score.bump{animation:sBump .55s cubic-bezier(.34,1.56,.64,1)}
@keyframes sBump{0%,100%{transform:scale(1)}50%{transform:scale(1.22)}}
.total-max{font-size:11px;color:rgba(255,255,255,.2);text-align:right;letter-spacing:.2em}
.items-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:11px;flex:1}
.si-card{background:linear-gradient(155deg,rgba(26,16,53,.97),rgba(15,10,30,.99));border:1px solid rgba(168,85,247,.18);border-radius:16px;padding:14px 16px;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;transition:border-color .5s,box-shadow .5s;animation:popIn .9s cubic-bezier(.34,1.56,.64,1) both}
.si-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(192,132,252,.4),transparent);opacity:0;transition:opacity .5s}
.si-card.lit{border-color:rgba(168,85,247,.52);box-shadow:0 0 22px rgba(168,85,247,.1)}
.si-card.lit::before{opacity:1}
.si-card:nth-child(1){animation-delay:.18s}.si-card:nth-child(2){animation-delay:.26s}.si-card:nth-child(3){animation-delay:.34s}.si-card:nth-child(4){animation-delay:.42s}
.cc{position:absolute;width:11px;height:11px;border-color:rgba(168,85,247,.22);border-style:solid}
.cc.tl{top:6px;left:6px;border-width:1px 0 0 1px}.cc.br{bottom:6px;right:6px;border-width:0 1px 1px 0}
.si-icon{font-size:clamp(16px,2.2vw,26px);margin-bottom:4px}
.si-name{font-size:clamp(11px,1.5vw,15px);font-weight:700;color:rgba(255,255,255,.82);letter-spacing:.1em;margin-bottom:7px}
.si-num{font-size:clamp(32px,5.5vw,70px);font-weight:900;background:linear-gradient(135deg,var(--gold2),var(--pink));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;transition:all .4s;letter-spacing:.02em}
.si-num.bump{animation:sBump .55s cubic-bezier(.34,1.56,.64,1)}
.si-unit{font-size:clamp(10px,1.2vw,13px);color:rgba(255,255,255,.28);letter-spacing:.18em;margin-top:1px}
.si-empty{font-size:clamp(14px,2.2vw,26px);color:rgba(168,85,247,.22);letter-spacing:.08em}
.si-bar-wrap{height:4px;background:rgba(255,255,255,.05);border-radius:999px;margin-top:9px;overflow:hidden}
.si-bar{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--purple),var(--pink),var(--gold2));transition:width .7s cubic-bezier(.34,1.56,.64,1);width:0%}
.cf-wrap{position:fixed;inset:0;z-index:200;pointer-events:none;overflow:hidden}
.cf{position:absolute;border-radius:2px;animation:cfF linear forwards}
@keyframes cfF{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(105vh) rotate(720deg);opacity:0}}


.logo {
  display: none !important;
}
</style>