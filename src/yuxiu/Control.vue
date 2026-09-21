<template>
  <div class="control-page">
    <div class="pwd-modal" v-if="!passAuth">
      <div class="pwd-box">
        <div class="pwd-title">🔐 大屏控制台口令验证</div>
        <input ref="pwdInput" v-model="inputPwd" @keyup.enter="checkPwd" class="pwd-input" type="text" placeholder="请输入访问口令">
        <div class="tip">{{pwdTip}}</div>
        <button class="pwd-btn" @click="checkPwd">确认</button>
      </div>
    </div>
    <div class="bg-wrap">
      <div class="bg-grad"></div>
    </div>
    <div class="page">
      <div class="header">
        <div class="badge">✦ 大屏控制台 ✦</div>
        <div class="htitle">毓秀杯 · AI打分后台</div>
        <div class="hsub">填写信息并打分，大屏幕实时同步</div>
      </div>
      <div class="section">
        <div class="head-title">参赛信息</div>
        <select v-model="form.groupName" @change="autoSave" class="group-select">
          <option value="">— 请选择组别 —</option>
          <option v-for="item in groupData" :key="item.groupName" :value="item.groupName">{{ item.groupName }}</option>
        </select>
        <div class="work-name" v-show="form.groupName">
          {{ currentGroup ? currentGroup.workName : '— 请选择组别 —' }}
        </div>
      </div>

      <div class="score-radar" v-show="form.groupName">
        <div class="semi-left">
          <svg class="score-semicircle" viewBox="0 0 760 400" preserveAspectRatio="xMidYMid meet">
            <g>
              <path class="sector-bg" :d="getSectorPath(0)"/>
              <path v-if="getSectorValuePath(scoreItems1[0].value, 0)" class="sector-first" :d="getSectorValuePath(scoreItems1[0].value, 0)"/>
              <text class="sector-score" :x="getTextPosition(0).x" :y="getTextPosition(0).y + 28">{{ formatScore(scoreItems1[0].value) }}分</text>
              <text class="sector-label" :x="getTextPosition(0).x" :y="getTextPosition(0).y - 28">难度系数</text>
            </g>
            <g>
              <path class="sector-bg" :d="getSectorPath(1)"/>
              <path v-if="getSectorValuePath(scoreItems1[1].value, 1)" class="sector-second" :d="getSectorValuePath(scoreItems1[1].value, 1)"/>
              <text class="sector-score" :x="getTextPosition(1).x" :y="getTextPosition(1).y + 28">{{ formatScore(scoreItems1[1].value) }}分</text>
              <text class="sector-label" :x="getTextPosition(1).x" :y="getTextPosition(1).y - 28">作品完成率</text>
            </g>
            <g>
              <path class="sector-bg" :d="getSectorPath(2)"/>
              <path v-if="getSectorValuePath(scoreItems1[2].value, 2)" class="sector-three" :d="getSectorValuePath(scoreItems1[2].value, 2)"/>
              <text class="sector-score" :x="getTextPosition(2).x" :y="getTextPosition(2).y + 28">{{ formatScore(scoreItems1[2].value) }}分</text>
              <text class="sector-label" :x="getTextPosition(2).x" :y="getTextPosition(2).y - 28">发音吐字准确度</text>
            </g>
            <g>
              <path class="sector-bg" :d="getSectorPath(3)"/>
              <path v-if="getSectorValuePath(scoreItems1[3].value, 3)" class="sector-four" :d="getSectorValuePath(scoreItems1[3].value, 3)"/>
              <text class="sector-score" :x="getTextPosition(3).x" :y="getTextPosition(3).y + 28">{{ formatScore(scoreItems1[3].value) }}分</text>
              <text class="sector-label" :x="getTextPosition(3).x" :y="getTextPosition(3).y - 28">角色还原度</text>
            </g>
            <text class="center-small" x="380" y="280">得分</text>
            <text class="center-total" x="380" y="380">{{ this.total1 }}</text>
          </svg>
          <div class="stu-name">{{ currentGroup ? currentGroup.value[0] : '' }}</div>
          <div class="sec-title">评分项目(每项0 - 5分)</div>
          <div class="score-item">
            <div class="item-label">📖 难度系数</div>
            <input type="number" class="score-input" :value="scores1[0] !== null ? scores1[0] : ''" min="0" max="5" step="0.1" placeholder="0.0" @input="onScoreInput1(0, $event)"/>
          </div>
          <div class="score-item">
            <div class="item-label">🎬 作品完成率</div>
            <input type="number" class="score-input" :value="scores1[1] !== null ? scores1[1] : ''" min="0" max="5" step="0.1" placeholder="0.0" @input="onScoreInput1(1, $event)"/>
          </div>
          <div class="score-item">
            <div class="item-label">🎤 发音吐字准确度</div>
            <input type="number" class="score-input" :value="scores1[2] !== null ? scores1[2] : ''" min="0" max="5" step="0.1" placeholder="0.0" @input="onScoreInput1(2, $event)"/>
          </div>
          <div class="score-item">
            <div class="item-label">🎭 角色还原度</div>
            <input type="number" class="score-input" :value="scores1[3] !== null ? scores1[3] : ''" min="0" max="5" step="0.1" placeholder="0.0" @input="onScoreInput1(3, $event)"/>
          </div>
        </div>
        <div class="semi-right" v-show="hasTwoPlayer">
          <svg class="score-semicircle" viewBox="0 0 760 400" preserveAspectRatio="xMidYMid meet">
            <g>
              <path class="sector-bg" :d="getSectorPath(0)"/>
              <path v-if="getSectorValuePath(scoreItems2[0].value, 0)" class="sector-first" :d="getSectorValuePath(scoreItems2[0].value, 0)"/>
              <text class="sector-score" :x="getTextPosition(0).x" :y="getTextPosition(0).y + 28">{{ formatScore(scoreItems2[0].value) }}分</text>
              <text class="sector-label" :x="getTextPosition(0).x" :y="getTextPosition(0).y - 28">难度系数</text>
            </g>
            <g>
              <path class="sector-bg" :d="getSectorPath(1)"/>
              <path v-if="getSectorValuePath(scoreItems2[1].value, 1)" class="sector-second" :d="getSectorValuePath(scoreItems2[1].value, 1)"/>
              <text class="sector-score" :x="getTextPosition(1).x" :y="getTextPosition(1).y + 28">{{ formatScore(scoreItems2[1].value) }}分</text>
              <text class="sector-label" :x="getTextPosition(1).x" :y="getTextPosition(1).y - 28">作品完成率</text>
            </g>
            <g>
              <path class="sector-bg" :d="getSectorPath(2)"/>
              <path v-if="getSectorValuePath(scoreItems2[2].value, 2)" class="sector-three" :d="getSectorValuePath(scoreItems2[2].value, 2)"/>
              <text class="sector-score" :x="getTextPosition(2).x" :y="getTextPosition(2).y + 28">{{ formatScore(scoreItems2[2].value) }}分</text>
              <text class="sector-label" :x="getTextPosition(2).x" :y="getTextPosition(2).y - 28">发音吐字准确度</text>
            </g>
            <g>
              <path class="sector-bg" :d="getSectorPath(3)"/>
              <path v-if="getSectorValuePath(scoreItems2[3].value, 3)" class="sector-four" :d="getSectorValuePath(scoreItems2[3].value, 3)"/>
              <text class="sector-score" :x="getTextPosition(3).x" :y="getTextPosition(3).y + 28">{{ formatScore(scoreItems2[3].value) }}分</text>
              <text class="sector-label" :x="getTextPosition(3).x" :y="getTextPosition(3).y - 28">角色还原度</text>
            </g>
            <text class="center-small" x="380" y="280">得分</text>
            <text class="center-total" x="380" y="380">{{ this.total2 }}</text>
          </svg>
          <div class="stu-name">{{ currentGroup ? currentGroup.value[1] : '' }}</div>
          <div class="sec-title">评分范围(每项0~5分)</div>
          <div class="score-item">
            <div class="item-label">📖 难度系数</div>
            <input type="number" class="score-input" :value="scores2[0] !== null ? scores2[0] : ''" min="0" max="5" step="0.1" placeholder="0.0" @input="onScoreInput2(0, $event)"/>
          </div>
          <div class="score-item">
            <div class="item-label">🎬 作品完成率</div>
            <input type="number" class="score-input" :value="scores2[1] !== null ? scores2[1] : ''" min="0" max="5" step="0.1" placeholder="0.0" @input="onScoreInput2(1, $event)"/>
          </div>
          <div class="score-item">
            <div class="item-label">🎤 发音吐字准确度</div>
            <input type="number" class="score-input" :value="scores2[2] !== null ? scores2[2] : ''" min="0" max="5" step="0.1" placeholder="0.0" @input="onScoreInput2(2, $event)"/>
          </div>
          <div class="score-item">
            <div class="item-label">🎭 角色还原度</div>
            <input type="number" class="score-input" :value="scores2[3] !== null ? scores2[3] : ''" min="0" max="5" step="0.1" placeholder="0.0" @input="onScoreInput2(3, $event)"/>
          </div>
        </div>
      </div>
      <div class="total-box">
        <div>
          <div class="group-avg-score">组别平均分</div>
        </div>
        <div class="total-num">{{ form.groupName ? total : '-' }}</div>
     </div>
      
      <div class="action-row">
        <button class="abtn abtn-go" @click="publish">✦ 发布到大屏幕</button>
        <button class="abtn abtn-reset" @click="resetAll">✕ 全部重置</button>
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

export default {
  name: 'Control',
  data() {
    return {
      passAuth: false, // 是否通过口令校验
      inputPwd: '',
      pwdTip: '',
      pwdCode: '职涯星', // 这里改成你的真实口令
      form: { groupName: '', work: '' },
      scores1: [null, null, null, null],
      scores2: [null, null, null, null],
      statusText: '⚡ 等待打分…',
      // studentList:[],
      groupData: [
        { groupName: '第一组', workName: '花木兰', value: ["南茉","潘虹"] },
        { groupName: '第二组', workName: '魔童闹海', value: ["李蓓"] },
        { groupName: '第三组', workName: '觉醒年代', value: ["陆友达","阳智博"] },
        { groupName: '第四组', workName: '魔童降世', value: ["徐子媛","刘子涵"] },
        { groupName: '第五组', workName: '疯狂动物城', value: ["柯丽妮"] },
        { groupName: '第六组', workName: '大圣归来', value: ["欧书茗","阮明俊"] },
        { groupName: '第七组', workName: '长安三万里', value: ["苏哲"] },
        { groupName: '第八组', workName: '鬼妈妈', value: ["刘芳君"] },
        { groupName: '第九组', workName: 'we are the world', value: ["张三","李四"] },
        { groupName: '第十组', workName: '小美人鱼', value: ["王五","赵六"] },
      ],
      // 四个评分项目
      scoreItems1: [
        { name: '难度系数', value: null },
        { name: '作品完成率', value: null },
        { name: '发音准确度', value: null },
        { name: '角色还原度', value: null },
      ],
      scoreItems2: [
        { name: '难度系数', value: null },
        { name: '作品完成率', value: null },
        { name: '发音准确度', value: null },
        { name: '角色还原度', value: null },
      ],

    }
  },
  computed: {
    total1() {
      const filled = this.scores1.filter(s => s !== null)
      return filled.length > 0
        ? Math.round(filled.reduce((a, b) => a + b, 0) * 10) / 10
        : '—'
    },
    total2() {
      const filled = this.scores2.filter(s => s !== null)
      return filled.length > 0
        ? Math.round(filled.reduce((a, b) => a + b, 0) * 10) / 10
        : '—'
    },
    total() {
      const arr = []
      if(this.total1 !== '—') arr.push(this.total1)
      if(this.total2 !== '—') arr.push(this.total2)
      if(arr.length === 0) return '—'
      const avg = arr.reduce((s, v) => s + v, 0) / arr.length
      return Math.round(avg * 10) / 10
    },
    currentGroup() {
      return this.groupData.find(g => g.groupName === this.form.groupName)    
    },
    hasTwoPlayer() {
      if (!this.currentGroup) return false
      return this.currentGroup.value.length > 1
    }
  },
  watch: {
    'form.groupName'(newVal, oldVal) {
      // 组别切换，清空两套选手分数
      this.scores1 = [null, null, null, null]
      this.scores2 = [null, null, null, null]
      this.scoreItems1.forEach(item => item.value = null)
      this.scoreItems2.forEach(item => item.value = null)
      // 清空作品选择
      if(this.currentGroup){
        this.form.work = this.currentGroup.workName
      }else{
        this.form.work = ''
      }
      this.autoSave()
    }
  },
  methods: {
    // 左侧选手打分
    onScoreInput1(idx, event) {
      const raw = parseFloat(event.target.value);
      if (isNaN(raw) || event.target.value === '') {
        this.$set(this.scores1, idx, null);
        this.scoreItems1[idx].value = null;
      } else {
        // 强制限制0~5
        const val = Math.min(5, Math.max(0, Math.round(raw * 10) / 10));
        this.$set(this.scores1, idx, val);
        this.scoreItems1[idx].value = val;
      }
      this.autoSave();
    },
    // 右侧选手打分
    onScoreInput2(idx, event) {
      const raw = parseFloat(event.target.value);
      if (isNaN(raw) || event.target.value === '') {
        this.$set(this.scores2, idx, null);
        this.scoreItems2[idx].value = null;
      } else {
        const val = Math.min(5, Math.max(0, Math.round(raw * 10) / 10));
        this.$set(this.scores2, idx, val);
        this.scoreItems2[idx].value = val;
      }
      this.autoSave();
    },
    autoSave() {
      const total1 = this.scores1.reduce((a, b) => a + (b === null ? 0 : b), 0)
      const total2 = this.scores2.reduce((a, b) => a + (b === null ? 0 : b), 0)
      const data = {
        groupName: this.form.groupName.trim(),
        work: this.form.work.trim(),
        scores1: [...this.scores1],
        scores2: [...this.scores2],
        published: false,
        total1: total1,
        total2: total2,
        ts: Date.now()
      }

    },
    async publish() {
      const stu1 = {
        name: this.currentGroup.value[0] || '',
        groupName: this.form.groupName,
        work: this.form.work,
        score1: this.scores1[0],
        score2: this.scores1[1],
        score3: this.scores1[2],
        score4: this.scores1[3],
        total: this.total1,
      }
      const studentList = [stu1]
      const stu2Name = this.currentGroup.value[1]
      if (stu2Name) {
        const stu2 = {
          name: stu2Name,
          groupName: this.form.groupName,
          work: this.form.work,
          score1: this.scores2[0],
          score2: this.scores2[1],
          score3: this.scores2[2],
          score4: this.scores2[3],
          total: this.total2,
        }
        studentList.push(stu2)
      }
      console.log('发布到大屏幕的学生列表:', studentList)
      try {
        await api.post('/ai/yxb/insert/score', studentList)
        alert('✅ 发布成功！大屏幕已同步')
        this.statusText = '✅ 已发布到大屏幕'
      } catch (err) {
        alert('❌ 发布失败')
        console.error(err)
      }
    },
    async resetAll() {
      try {
        const res = await api.get('/ai/yxb/reset/all')
        const result = res.data
        if (result.code === 200) {
          alert('✅ 重置成功！大屏幕已同步')
          this.form.groupName = ''
          this.form.work = ''
          this.scores1 = [null, null, null, null]
          this.scores2 = [null, null, null, null]
          this.scoreItems1.forEach(item => item.value = null)
          this.scoreItems2.forEach(item => item.value = null)
          this.total1 = '—'
          this.total2 = '—'
          this.statusText = '✅ 已重置'
        } else {
          alert('❌ 重置失败')
        }
      } catch (err) {
        alert('❌ 重置失败')
      }
    },
    getSectorPath(index) {
      const cx = 380;
      const cy = 380;
      const outerR = 380;
      const innerR = 220;
      const gap = 3;
      const sectorAngle = (180 - gap * 3) / 4;
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
    checkPwd(){
      if(this.inputPwd === this.pwdCode){
        this.passAuth = true
        this.pwdTip = ''
      }else{
        this.pwdTip = '❌ 口令错误，请重新输入'
        this.inputPwd = ''
      }
    },
  }

}
</script>

<style scoped>
.control-page {
  padding: 15px;
  position: relative;
  z-index: 1;
}
.bg-wrap {
  position: fixed;
  inset: 0;
}
.bg-grad {
  position: absolute;
  inset: 0;
  background-image: url('../assets/img/毓秀杯背景.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.page {
  position: relative;
  z-index: 2;
}
.header {
  text-align: center;
  margin-top: -10px;
  margin-bottom: 20px;

}
.badge {
  display:flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: 200px;
  height: 40px;
  font-size: 20px;
  color: #000;
  margin-bottom: 10px;
  background: #FEDC57;
  border-radius: 40px;
}
.htitle {
  font-size: 30px;
  color: #FEDA45;
  letter-spacing: 1px;
  font-weight: bold;
}
.hsub {
  font-size: 15px;
  color: #D9D4D5;
  letter-spacing: 1px;
  margin-top: 4px;
}
.section {
  background:#21172D;
  border: 2px solid #DBA612;
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 20px;
}
.head-title{
  font-size: 15px;
  color:#FDDF76;
  margin-bottom: 12px;
  text-align: center;
  letter-spacing: 1px;
}
.group-select {
  width: 100%;
  height: 50px;
  background: #3F342B;
  border: 1.5px solid rgba(168,85,247,.25);
  border-radius: 12px;
  color: #F4D775;
  font-size: 20px;
  padding: 10px 14px;
  margin-bottom: 10px;
  text-align-last: center;
}

select.group-select { 
  appearance: none;
}

.work-name{
  display:flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  height: 50px;
  color:#F4D775;
  margin-top: 0px;
  margin-bottom: 0px;
  text-align: center;
  letter-spacing: 1px;
  background: #3F342B;
  border: 1.5px solid rgba(168,85,247,.25);
  border-radius: 12px;
}

.stu-name{
  font-size: 24px;
  color:#fff;
  margin-top: -20px;
  margin-bottom: 20px;
  text-align: center;
  letter-spacing: 1px;
}
.sec-title {
  font-size: 14px;
  color:#fff;
  margin-bottom: 12px;
  text-align: center;
  letter-spacing: 1px;
}

.score-item { 
  margin-bottom: 16px; 
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-label { 
  font-size: 18px; 
  color: #F4D775;
  margin-bottom:10px;
  text-align: center;
}
.score-input {
  width: 80px;
  background: #21172D;
  border: 1px solid  #DBA612;
  border-radius: 50px;
  color: #fff;
  font-size: 25px;
  padding: 6px 8px;
  text-align: center;  
  display:flex;
  align-items: center;
  justify-content: center;
}

.total-box {
  background: #21172D;
  border: 2px solid  #DBA612;
  border-radius: 25px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.group-avg-score { 
  font-size: 30px; 
  letter-spacing: 2px; 
  color: #F3CF2F; 
}
.total-num { 
  font-size: 44px; 
  font-weight: 900; 
  color: #F3CF2F; 
}
.action-row { 
  display: flex; 
  gap: 10px; 
  margin-bottom: 20px;
}
.abtn { 
  flex: 1; 
  padding: 14px; 
  border: none; 
  border-radius: 50px; 
  font-size: 18px; 
  font-weight: bold; 
}
.abtn-go { 
  background: #F3D356;
  border: 2px solid  #DBA612;
  color: #000; 
}
.abtn-reset { 
  background: #21172D; 
  border: 1.5px solid #000; 
  color: #fff; 
}

.score-radar {
  display: flex;
  gap:20px;
  margin-bottom:20px;
  height: auto;
  justify-content: center;
  flex-wrap: wrap;
}
.semi-left, .semi-right {
  margin-top: 30px;
  width: calc(50% - 10px);
  max-width: 180px;
  flex:1;
}
.score-semicircle {
  width:100%;
}

.sector-first {
  fill: #F6DD7D;
}
.sector-second {
  fill: #F5D313;
}
.sector-three {
  fill: #F2AC14;
}
.sector-four {
  fill: #EF7611;
}
.sector-score {
  font-size:16px;
  text-anchor:middle;
}
.sector-label {
  font-size:14px;
  text-anchor:middle;
}
.center-small {
  font-size:50px;
  text-anchor:middle;
}
.center-total {
  fill:#F0D27A;
  font-size:100px;
  font-weight:bold;
  text-anchor:middle;
}


/* 口令弹窗样式 */
.pwd-modal{
  position: fixed;
  inset:0;
  background:rgba(0,0,0,0.85);
  z-index:9999;
  display:flex;
  align-items:center;
  justify-content:center;
}
.pwd-box{
  background:#21172D;
  border:2px solid #DBA612;
  border-radius:20px;
  padding:30px;
  width:350px;
  text-align:center;
}
.pwd-title{
  font-size:24px;
  color:#FEDA45;
  margin-bottom:20px;
}
.pwd-input{
  width:100%;
  box-sizing:border-box;
  height:50px;
  background:#3F342B;
  border:1.5px solid #DBA612;
  border-radius:12px;
  color:#fff;
  font-size:20px;
  padding:0 15px;
  margin-bottom:12px;
}
.tip{
  height:24px;
  color:#ff7777;
  margin-bottom:12px;
  font-size:20px;
}
.pwd-btn{
  width:100%;
  height:48px;
  background:#F3D356;
  border:none;
  border-radius:12px;
  font-size:20px;
  font-weight:bold;
  color:#000;
}
/* 锁定页面，禁止点击底层内容 */
.lockPage {
  pointer-events: none;
}
</style>