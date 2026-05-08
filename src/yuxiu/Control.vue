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
        <input
          v-model="form.name"
          @input="autoSave"
          class="inp"
          placeholder="选手姓名 / 编号…"
          maxlength="20"
        />
        <input
          v-model="form.work"
          @input="autoSave"
          class="inp"
          placeholder="作品名称…"
          maxlength="30"
        />
      </div>

      <div class="section">
        <div class="sec-title">评分项目（每项 0 ~ 20 分）</div>

        <div class="score-item" v-for="(item, idx) in items" :key="idx">
          <div class="item-header">
            <div class="item-label">{{ item.icon }} {{ item.name }}</div>
            <div class="item-cur">{{ scores[idx] !== null ? scores[idx] : '—' }}</div>
          </div>

          <div class="sbgrid">
            <button
              v-for="n in 21"
              :key="n"
              class="sbt"
              :class="{ active: scores[idx] === n - 1 }"
              @click="handleScoreClick(idx, n - 1)"
            >
              {{ n - 1 }}
            </button>
          </div>

          <div class="fine-row">
            <button class="ftb" @click="adj(idx, -1)">－</button>
            <span class="ft-hint">微调 ±1</span>
            <button class="ftb" @click="adj(idx, 1)">＋</button>
          </div>

          <div class="item-divider" v-if="idx < 3"></div>
        </div>
      </div>

      <div class="total-box">
        <div>
          <div class="total-label">综合总分</div>
          <div class="total-sub">满分 80 分</div>
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
    handleScoreClick(idx, val) {
      this.setScore(idx, val)
    },
    adj(idx, d) {
      let cur = this.scores[idx]
      if (cur === null) cur = 10
      cur = Math.max(0, Math.min(20, cur + d))
      this.setScore(idx, cur)
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

.score-item { margin-bottom: 16px; }
.item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.item-label { font-size: 15px; font-weight: bold; color: #FFF8FF; }
.item-cur { font-size: 28px; font-weight: 900; background: linear-gradient(135deg, #F0D27A, #FF8FAB); -webkit-background-clip: text; color: transparent; }

.item-divider { height: 1px; background: rgba(168,85,247,.1); margin: 16px 0; }

.sbgrid { display: flex; flex-wrap: wrap; gap: 6px; }
.sbt {
  width: calc((100% - 10*6px)/11);
  min-width: 34px;
  padding: 9px 0;
  border: 1.5px solid rgba(168,85,247,.2);
  border-radius: 10px;
  background: rgba(168,85,247,.07);
  color: rgba(255,255,255,.6);
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
}
.sbt:hover { border-color: #C084FC; background: rgba(168,85,247,.22); color: #fff; }
.sbt.active { border-color: #FF8FAB; background: linear-gradient(135deg, rgba(255,143,171,.25), rgba(168,85,247,.2)); color: #FFB3C6; }

.fine-row { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
.ftb { width: 38px; height: 38px; border-radius: 50%; border: 1.5px solid rgba(168,85,247,.3); background: rgba(168,85,247,.1); color: #C084FC; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.ft-hint { font-size: 11px; color: rgba(255,255,255,.25); }

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