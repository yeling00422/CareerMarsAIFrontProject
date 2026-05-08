<template>
  <div class="control-page">
    <div class="bg-wrap">
      <div class="bg-grad"></div>
      <div class="gblob" style="width:300px;height:300px;top:-80px;left:-60px;background:rgba(168,85,247,.3)"></div>
      <div class="gblob" style="width:250px;height:250px;bottom:-60px;right:-40px;background:rgba(255,143,171,.25)"></div>
    </div>

    <div class="page">
      <div class="header">
        <div class="badge">✦ 评委控制台 ✦</div>
        <div class="htitle">毓秀杯 · AI打分后台</div>
        <div class="hsub">填写信息并打分，大屏幕实时同步</div>
      </div>

      <div class="section">
        <div class="sec-title">选手信息</div>
        <select v-model="form.name" @change="autoSave" class="inp sel">
          <option value="">— 请选择选手 —</option>
          <option>一号选手</option>
          <option>二号选手</option>
          <option>三号选手</option>
          <option>四号选手</option>
          <option>五号选手</option>
          <option>六号选手</option>
          <option>七号选手</option>
          <option>八号选手</option>
          <option>九号选手</option>
          <option>十号选手</option>
        </select>
        <select v-model="form.work" @change="autoSave" class="inp sel">
          <option value="">— 请选择作品 —</option>
          <option>花木兰</option>
          <option>魔童闹海</option>
          <option>觉醒年代</option>
          <option>魔童降世</option>
          <option>疯狂动物城</option>
          <option>大圣归来</option>
          <option>觉醒年代</option>
          <option>长安三万里</option>
          <option>鬼妈妈</option>
          <option>we are the world</option>
        </select>
      </div>

      <div class="section">
        <div class="sec-title">评分项目（每项 0 ~ 5 星）</div>

        <div class="score-item" v-for="(item, idx) in items" :key="idx">
          <div class="item-header">
            <div class="item-label">{{ item.icon }} {{ item.name }}</div>
            <div class="item-cur">
              <span
                v-for="s in 5"
                :key="s"
                class="ic-star"
                :style="starStyle(idx, s)"
              >★</span>
              <span class="ic-num">{{ scores[idx] !== null ? scores[idx] : '—' }}</span>
            </div>
          </div>

          <div class="star-row">
            <span
              v-for="s in 5"
              :key="s"
              class="star-btn"
              :style="starStyle(idx, s)"
              @click="onStarClick(idx, s, $event)"
            >★</span>
            <input
              type="number"
              class="star-input"
              :value="scores[idx] !== null ? scores[idx] : ''"
              min="0" max="5" step="0.1"
              placeholder="0.0"
              @input="onScoreInput(idx, $event)"
            />
          </div>

          <div class="item-divider" v-if="idx < 3"></div>
        </div>
      </div>

      <div class="total-box">
        <div>
          <div class="total-label">综合总分</div>
          <div class="total-sub">满分 20 </div>
        </div>
        <div class="total-num">{{ total }}</div>
      </div>

      <div class="action-row">
        <button class="abtn abtn-go" @click="publish">✦ 发布到大屏幕</button>
        <button class="abtn abtn-reset" @click="resetAll">✕ 全部重置</button>
      </div>
    </div>

    <div class="statusbar">
      <div class="st-text">{{ statusText }}</div>
      <div class="st-hint">与大屏实时同步</div>
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

export default {
  name: 'Control',
  data() {
    return {
      form: { name: '', work: '' },
      scores: [null, null, null, null],
      items: [
        { icon: '🎬', name: '难度系数' },
        { icon: '🎙️', name: '作品完成率' },
        { icon: '💝', name: '发音吐字准确度' },
        { icon: '🎭', name: '角色还原度' }
      ],
      statusText: '⚡ 等待打分…'
    }
  },
  computed: {
    total() {
      const filled = this.scores.filter(s => s !== null)
      return filled.length > 0 ? filled.reduce((a, b) => a + b, 0) : '—'
    }
  },
  mounted() {
    this.loadFromLocal()
  },
  methods: {
    setScore(idx, val) {
      this.$set(this.scores, idx, val)
      this.autoSave()
    },
    starStyle(idx, s) {
      const score = this.scores[idx];
      const fill = score === null ? 0 : Math.min(100, Math.max(0, (score - (s - 1)) * 100));
      if (fill >= 100) return { color: '#F0D27A' };
      if (fill <= 0)   return { color: 'rgba(255,255,255,.18)' };
      return {
        background: `linear-gradient(90deg,#F0D27A ${fill.toFixed(1)}%,rgba(255,255,255,.18) ${fill.toFixed(1)}%)`,
        webkitBackgroundClip: 'text',
        webkitTextFillColor: 'transparent',
      };
    },
    onStarClick(idx, s, event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const frac = Math.max(0.1, Math.round((event.clientX - rect.left) / rect.width * 10) / 10);
      const val = Math.min(5, Math.round(((s - 1) + frac) * 10) / 10);
      this.setScore(idx, this.scores[idx] !== null && Math.abs(this.scores[idx] - val) < 0.05 ? null : val);
    },
    onScoreInput(idx, event) {
      const raw = parseFloat(event.target.value);
      if (isNaN(raw) || event.target.value === '') {
        this.setScore(idx, null);
      } else {
        this.setScore(idx, Math.min(5, Math.max(0, Math.round(raw * 10) / 10)));
      }
    },
    autoSave() {
      const total = this.scores.reduce((a, b) => a + (b === null ? 0 : b), 0)
      const data = {
        name: this.form.name.trim(),
        work: this.form.work.trim(),
        scores: [...this.scores],
        published: false,
        total: total,
        ts: Date.now()
      }
      try {
        localStorage.setItem('yuxiu_data', JSON.stringify(data))
      } catch (e) {}
    },
    async publish() {
      try {
          const dto = {
            name: this.form.name,
            work: this.form.work,
            score1: this.scores[0],
            score2: this.scores[1],
            score3: this.scores[2],
            score4: this.scores[3],
          }
          await api.post('/ai/yxb/insert/score', dto)
          alert('✅ 发布成功！大屏幕已同步')
          this.statusText = '✅ 已发布到大屏幕'
        } catch (err) {
          alert('❌ 发布失败')
          console.error(err)
        }
    },
    async resetAll() {
       try {
        const dto = {
          name: '',
          work: '',
          score1: null,
          score2: null,
          score3: null,
          score4: null,
        }
        await api.post('/ai/yxb/insert/score', dto)

        this.form.name = ''
        this.form.work = ''
        this.scores = [null, null, null, null]
        localStorage.removeItem('yuxiu_data')

        alert('✅ 已全部重置')
        this.statusText = '⚡ 已重置'
      } catch (err) {
        alert('❌ 重置失败')
      }
    },
    loadFromLocal() {
      try {
        const d = JSON.parse(localStorage.getItem('yuxiu_data') || 'null')
        if (d) {
          this.form.name = d.name || ''
          this.form.work = d.work || ''
          if (d.scores) {
            this.scores = d.scores.map(item => item === undefined ? null : item)
          }
        }
      } catch (e) {}
    }
  }
}
</script>

<style scoped>
.control-page {
  min-height: 100vh;
  background: #0F0A1E;
  color: #FFF8FF;
  padding: 20px 16px 70px;
  position: relative;
  z-index: 1;
}

.bg-wrap {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.bg-grad {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 60% at 15% 20%, rgba(168,85,247,.15), transparent 60%),
              radial-gradient(ellipse 70% 70% at 85% 80%, rgba(255,143,171,.12), transparent 60%),
              #0F0A1E;
}

.gblob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: .28;
}

.page {
  position: relative;
  z-index: 2;
}

.header {
  text-align: center;
  margin-bottom: 22px;
}

.badge {
  display: inline-block;
  background: linear-gradient(135deg, rgba(168,85,247,.2), rgba(255,143,171,.2));
  border: 1px solid rgba(168,85,247,.4);
  border-radius: 999px;
  padding: 4px 16px;
  font-size: 20px;
  letter-spacing: .4em;
  color: #C084FC;
  margin-bottom: 8px;
}

.htitle {
  font-family: "STKaiti", KaiTi, serif;
  font-size: clamp(26px,6vw,42px);
  background: linear-gradient(135deg, #F0D27A, #FF8FAB, #C084FC);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: .2em;
  font-weight: bold;
}

.hsub {
  font-size: 12px;
  color: rgba(255,255,255,.35);
  letter-spacing: .4em;
  margin-top: 4px;
}

.section {
  background: rgba(26,16,53,.97);
  border: 1px solid rgba(168,85,247,.22);
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 14px;
}

.sec-title {
  font-size: 15px;
  letter-spacing: .5em;
  color: #C084FC;
  opacity: .7;
  margin-bottom: 12px;
}

.inp {
  width: 100%;
  background: rgba(255,255,255,.07);
  border: 1.5px solid rgba(168,85,247,.25);
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  padding: 10px 14px;
  outline: none;
  margin-bottom: 10px;
}

.inp:focus { border-color: #C084FC; }
.inp::placeholder { color: rgba(255,255,255,.22); }
select.inp { -webkit-appearance: none; appearance: none; cursor: pointer; }
select.inp option { background: #1a1035; color: #fff; }

.score-item { margin-bottom: 16px; }
.item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.item-label { font-size: 15px; font-weight: bold; color: #FFF8FF; }
.item-cur { display: flex; align-items: center; gap: 4px; }
.ic-star { font-size: 20px; line-height: 1; }
.ic-star-on  { color: #F0D27A; }
.ic-star-off { color: rgba(255,255,255,.2); }
.ic-num { font-size: 20px; font-weight: 900; background: linear-gradient(135deg, #F0D27A, #FF8FAB); -webkit-background-clip: text; color: transparent; margin-left: 6px; min-width: 38px; text-align: right; }

.item-divider { height: 1px; background: rgba(168,85,247,.1); margin: 16px 0; }

.star-row { display: flex; gap: 10px; align-items: center; justify-content: center; padding: 10px 0 4px; }
.star-btn {
  font-size: 44px;
  line-height: 1;
  cursor: pointer;
  transition: transform .15s;
  padding: 4px 6px;
  user-select: none;
}
.star-btn:hover { transform: scale(1.18); }

.star-input {
  width: 62px;
  background: rgba(255,255,255,.07);
  border: 1.5px solid rgba(168,85,247,.3);
  border-radius: 10px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  padding: 6px 8px;
  outline: none;
  text-align: center;
  margin-left: 6px;
}
.star-input:focus { border-color: #C084FC; }
.star-input::-webkit-outer-spin-button,
.star-input::-webkit-inner-spin-button { -webkit-appearance: none; }

.total-box {
  background: linear-gradient(135deg, rgba(168,85,247,.12), rgba(255,143,171,.08));
  border: 1.5px solid rgba(192,132,252,.28);
  border-radius: 16px;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.total-label { font-size: 12px; letter-spacing: .4em; color: #C084FC; }
.total-num { font-size: 44px; font-weight: 900; background: linear-gradient(135deg, #F0D27A, #FF8FAB, #C084FC); -webkit-background-clip: text; color: transparent; }

.action-row { display: flex; gap: 10px; }
.abtn { flex: 1; padding: 14px; border: none; border-radius: 14px; font-size: 15px; font-weight: bold; cursor: pointer; }
.abtn-go { background: linear-gradient(135deg, #A855F7, #FF8FAB); color: #fff; }
.abtn-reset { background: rgba(255,255,255,.07); border: 1.5px solid rgba(255,255,255,.12); color: rgba(255,255,255,.55); }

.statusbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(10,8,24,.96);
  border-top: 1px solid rgba(168,85,247,.2);
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  z-index: 10;
}
.st-text { color: #C084FC; }
.st-hint { color: rgba(255,255,255,.2); }
</style>