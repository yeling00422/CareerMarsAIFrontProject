<template>
  <div class="control-page">
    <div class="pwd-modal" v-if="!passAuth">
      <div class="pwd-box">
        <div class="pwd-title">评委登录页面</div>
        <input ref="pwdInput" v-model="account" @keyup.enter="checkAccAndPwd" class="pwd-input" type="text" placeholder="请输入账号">
        <input ref="pwdInput" v-model="password" @keyup.enter="checkAccAndPwd" class="pwd-input" type="text" placeholder="请输入密码">
        <div class="tip">{{tip}}</div>
        <button class="pwd-btn" @click="checkAccAndPwd">确认</button>
      </div>
    </div>
    <div class="bg-wrap">
      <div class="bg-grad"></div>
    </div>

    <div class="page">
      <div class="header">
        <div class="badge">✦ 毓秀杯-评委打分✦</div>
        <div class="welcome">{{ judge ? '欢迎：'+judge.name : '请登录' }}</div>
      </div>

      <div class="section" v-if="judge != null">
        <div class="table-head">
          <div>组名</div>
          <div>选手</div>
          <div>{{ judge.id=='admin' ? '得分' : '作品' }}</div>
          <div>{{ judge.id=='admin' ? '状态' : '得分' }}</div>
          <div>操作</div>
        </div>

        <div class="table-row-wrap" v-for="item in sortedList" :key="item.id" >
          <div class="table-row" v-if="judge.id != 'admin'">
            <div class="name">{{ item.groupName }}</div>
            <div>{{ item.name}}</div>
            <div>{{ item.work}}</div>
            <div v-show="judge.id === item.expertId1" >{{ item.expertScore1 || '未打分' }}</div>
            <div v-show="judge.id === item.expertId2" >{{ item.expertScore2 || '未打分' }}</div>
            <div v-show="judge.id === item.expertId3" >{{ item.expertScore3 || '未打分' }}</div>
            <div v-show="judge.id === item.expertId4" >{{ item.expertScore4 || '未打分' }}</div>
            <div v-show="judge.id === item.expertId5" >{{ item.expertScore5 || '未打分' }}</div>
            <div v-show="judge.id === item.volkswagenId1" >{{ item.volkswagenScore1 || '未打分' }}</div>
            <div v-show="judge.id === item.volkswagenId2" >{{ item.volkswagenScore2 || '未打分' }}</div>
            <div v-show="judge.id === item.volkswagenId3" >{{ item.volkswagenScore3 || '未打分' }}</div>
            <div v-show="judge.id === item.volkswagenId4" >{{ item.volkswagenScore4 || '未打分' }}</div>
            <div v-show="judge.id === item.volkswagenId5" >{{ item.volkswagenScore5 || '未打分' }}</div>
            <div v-show="judge.id === item.volkswagenId6" >{{ item.volkswagenScore6 || '未打分' }}</div>
            <div v-show="judge.id === item.volkswagenId7" >{{ item.volkswagenScore7 || '未打分' }}</div>
            <div v-show="judge.id === item.volkswagenId8" >{{ item.volkswagenScore8 || '未打分' }}</div>
            <div v-show="judge.id === item.volkswagenId9" >{{ item.volkswagenScore9 || '未打分' }}</div>
            <div v-show="judge.id === item.volkswagenId10" >{{ item.volkswagenScore10 || '未打分' }}</div>
            <div>
              <button class="btn-no-edit" v-show="item.status === 0">{{ '禁用' }}</button>
              <button class="btn-edit" v-show="item.status === 1" @click="toggleEdit(item)">{{ editId === item.id ? '取消' : '修改' }}</button>
            </div>
          </div>
          <div class="table-row" v-else>
            <div class="name">{{ item.groupName }}</div>
            <div>{{ item.name}}</div>
            <div>{{ item.endScore === null ? '待统计' : item.endScore }}</div>
            <div>
              <button class="btn-banned" v-show="item.status === 0" @click="changeStatus(item)">{{ '禁用' }}</button>
              <button class="btn-enable" v-show="item.status === 1" @click="changeStatus(item)">{{ '启用' }}</button>
            </div>
            <div>
              <button class="btn-edit" @click="toggleSearch(item)">{{ '查看' }}</button>
            </div>
          </div>

          <!-- 编辑区 -->
          <div class="edit-row" v-if="editId === item.id">
            <div class="edit-form">
              <div class="form-item" v-if="judge.id != 'admin'">
                <label class="lable-tip">参赛选手得分0-100</label>
                <input v-show="judge.id === item.expertId1" v-model.number="editForm.expertScore1" type="number" class="inp" min="0" max="100" placeholder="请输入0~100分数" @input="onScoreInput($event, 'expertScore1')">
                <input v-show="judge.id === item.expertId2" v-model.number="editForm.expertScore2" type="number" class="inp" min="0" max="100" placeholder="请输入0~100分数" @input="onScoreInput($event, 'expertScore2')">
                <input v-show="judge.id === item.expertId3" v-model.number="editForm.expertScore3" type="number" class="inp" min="0" max="100" placeholder="请输入0~100分数" @input="onScoreInput($event, 'expertScore3')">
                <input v-show="judge.id === item.expertId4" v-model.number="editForm.expertScore4" type="number" class="inp" min="0" max="100" placeholder="请输入0~100分数" @input="onScoreInput($event, 'expertScore4')">
                <input v-show="judge.id === item.expertId5" v-model.number="editForm.expertScore5" type="number" class="inp" min="0" max="100" placeholder="请输入0~100分数" @input="onScoreInput($event, 'expertScore5')">
                <input v-show="judge.id === item.volkswagenId1" v-model.number="editForm.volkswagenScore1" type="number" class="inp" min="0" max="100" placeholder="请输入0~100分数" @input="onScoreInput($event, 'volkswagenScore1')">
                <input v-show="judge.id === item.volkswagenId2" v-model.number="editForm.volkswagenScore2" type="number" class="inp" min="0" max="100" placeholder="请输入0~100分数" @input="onScoreInput($event, 'volkswagenScore2')">
                <input v-show="judge.id === item.volkswagenId3" v-model.number="editForm.volkswagenScore3" type="number" class="inp" min="0" max="100" placeholder="请输入0~100分数" @input="onScoreInput($event, 'volkswagenScore3')">
                <input v-show="judge.id === item.volkswagenId4" v-model.number="editForm.volkswagenScore4" type="number" class="inp" min="0" max="100" placeholder="请输入0~100分数" @input="onScoreInput($event, 'volkswagenScore4')">
                <input v-show="judge.id === item.volkswagenId5" v-model.number="editForm.volkswagenScore5" type="number" class="inp" min="0" max="100" placeholder="请输入0~100分数" @input="onScoreInput($event, 'volkswagenScore5')">
                <input v-show="judge.id === item.volkswagenId6" v-model.number="editForm.volkswagenScore6" type="number" class="inp" min="0" max="100" placeholder="请输入0~100分数" @input="onScoreInput($event, 'volkswagenScore6')">
                <input v-show="judge.id === item.volkswagenId7" v-model.number="editForm.volkswagenScore7" type="number" class="inp" min="0" max="100" placeholder="请输入0~100分数" @input="onScoreInput($event, 'volkswagenScore7')">
                <input v-show="judge.id === item.volkswagenId8" v-model.number="editForm.volkswagenScore8" type="number" class="inp" min="0" max="100" placeholder="请输入0~100分数" @input="onScoreInput($event, 'volkswagenScore8')">
                <input v-show="judge.id === item.volkswagenId9" v-model.number="editForm.volkswagenScore9" type="number" class="inp" min="0" max="100" placeholder="请输入0~100分数" @input="onScoreInput($event, 'volkswagenScore9')">
                <input v-show="judge.id === item.volkswagenId10" v-model.number="editForm.volkswagenScore10" type="number" class="inp" min="0" max="100" placeholder="请输入0~100分数" @input="onScoreInput($event, 'volkswagenScore10')">
              </div>
              <div class="form-item" v-else>
                <div class="score-detail-title">
                  <div class="judge-name-title">{{'评委' }}</div>
                  <div class="judge-score-title">{{'分数'}}</div>
                </div>
                <div class="score-detail">
                  <div class="judge-name">{{ item.expertName1 }}</div>
                  <div class="judge-score">{{ item.expertScore1 || '未打分'}}</div>
                </div>
                <div class="score-detail">
                  <div class="judge-name">{{ item.expertName2 }}</div>
                  <div class="judge-score">{{ item.expertScore2 || '未打分'}}</div>
                </div>
                <div class="score-detail">
                  <div class="judge-name">{{ item.expertName3 }}</div>
                  <div class="judge-score">{{ item.expertScore3 || '未打分'}}</div>
                </div>
                <div class="score-detail">
                  <div class="judge-name">{{ item.expertName4 }}</div>
                  <div class="judge-score">{{ item.expertScore4 || '未打分'}}</div>
                </div>
                <div class="score-detail">
                  <div class="judge-name">{{ item.expertName5 }}</div>
                  <div class="judge-score">{{ item.expertScore5 || '未打分'}}</div>
                </div>
                <div class="score-detail">
                  <div class="judge-name">{{ item.volkswagenName1 }}</div>
                  <div class="judge-score">{{ item.volkswagenScore1 || '未打分'}}</div>
                </div>
                <div class="score-detail">
                  <div class="judge-name">{{ item.volkswagenName2 }}</div>
                  <div class="judge-score">{{ item.volkswagenScore2 || '未打分'}}</div>
                </div>
                <div class="score-detail">
                  <div class="judge-name">{{ item.volkswagenName3 }}</div>
                  <div class="judge-score">{{ item.volkswagenScore3 || '未打分'}}</div>
                </div>
                <div class="score-detail">
                  <div class="judge-name">{{ item.volkswagenName4 }}</div>
                  <div class="judge-score">{{ item.volkswagenScore4 || '未打分'}}</div>
                </div>
                <div class="score-detail">
                  <div class="judge-name">{{ item.volkswagenName5 }}</div>
                  <div class="judge-score">{{ item.volkswagenScore5 || '未打分'}}</div>
                </div>
                <div class="score-detail">
                  <div class="judge-name">{{ item.volkswagenName6 }}</div>
                  <div class="judge-score">{{ item.volkswagenScore6 || '未打分'}}</div>
                </div>
                <div class="score-detail">
                  <div class="judge-name">{{ item.volkswagenName7 }}</div>
                  <div class="judge-score">{{ item.volkswagenScore7 || '未打分'}}</div>
                </div>
                <div class="score-detail">
                  <div class="judge-name">{{ item.volkswagenName8 }}</div>
                  <div class="judge-score">{{ item.volkswagenScore8 || '未打分'}}</div>
                </div>
                <div class="score-detail">
                  <div class="judge-name">{{ item.volkswagenName9 }}</div>
                  <div class="judge-score">{{ item.volkswagenScore9 || '未打分'}}</div>
                </div>
                <div class="score-detail">
                  <div class="judge-name">{{ item.volkswagenName10 }}</div>
                  <div class="judge-score">{{ item.volkswagenScore10 || '未打分'}}</div>
                </div>
              </div>
              <div class="action-row" v-show="judge.id != 'admin'">
                <button class="abtn reset" @click="cancelEdit">取消</button>
                <button class="abtn go" @click="saveEdit">保存</button>
              </div>
            </div>
          </div>
        </div>
        <div class="empty" v-if="list.length === 0">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { getAiURL } from '@/utils/index'

const api = axios.create({
  baseURL: getAiURL(),
  headers: { 'Content-Type': 'application/json' }
})

export default {
  data() {
    return {
      passAuth: false, // 是否通过口令校验
      account: '',
      password: '',
      tip: '',
      judge:null,
      list: [],
      msg: '就绪',
      editId: null,
      editForm: {},
      timer: null,
    }
  },
  computed: {
    // 倒序排名（分数高 → 低）
    sortedList() {
      return [...this.list].sort((a, b) => {
        let scoreA, scoreB;
        console.log(this);
        if (this.judge && this.judge.id === 'admin') {
          // admin：用getScore总分排序
          scoreA = a.endScore;
          scoreB = b.endScore;
        } else {
          // 普通评委：取当前评委对应的那一项分数
          const field = this.judge.id === a.expertId1 ? 'expertScore1'
            : this.judge.id === a.expertId2 ? 'expertScore2'
            : this.judge.id === a.expertId3 ? 'expertScore3'
            : this.judge.id === a.expertId4 ? 'expertScore4'
            : this.judge.id === a.expertId5 ? 'expertScore5'
            : this.judge.id === a.volkswagenId1 ? 'volkswagenScore1'
            : this.judge.id === a.volkswagenId2 ? 'volkswagenScore2'
            : this.judge.id === a.volkswagenId3 ? 'volkswagenScore3'
            : this.judge.id === a.volkswagenId4 ? 'volkswagenScore4'
            : this.judge.id === a.volkswagenId5 ? 'volkswagenScore5'
            : this.judge.id === a.volkswagenId6 ? 'volkswagenScore6'
            : this.judge.id === a.volkswagenId7 ? 'volkswagenScore7'
            : this.judge.id === a.volkswagenId8 ? 'volkswagenScore8'
            : this.judge.id === a.volkswagenId9 ? 'volkswagenScore9'
            : this.judge.id === a.volkswagenId10 ? 'volkswagenScore10'
            : null;
          scoreA = field ? a[field] : null;
          scoreB = field ? b[field] : null;
        }
        // null/未打分 统一当成 -1，排到最后
        scoreA = typeof scoreA === 'number' ? scoreA : -1;
        scoreB = typeof scoreB === 'number' ? scoreB : -1;
        return scoreB - scoreA;
      })
    },
  },
  methods: {
    startPolling() {
    // 先清除旧定时器，防止多个定时器叠加
      if(this.timer) clearInterval(this.timer)
      this.timer = setInterval(()=>{
        this.getList()
      }, 10000) // 10000ms = 10秒
    },
    stopPolling() {
      if(this.timer){
        clearInterval(this.timer)
        this.timer = null
      }
    },
    beforeDestroy() {
      this.stopPolling()
    },
    async getList() {
      try {
        const res = await api.post('/ai/yxb/current/endScore',this.judge)
        this.list = res.data.data || []
      } catch (e) {
        console.log(e)
      }
    },
    toggleEdit(item) {
      if (this.editId === item.id) {
        this.editId = null
        this.editForm = {}
      } else {
        this.editId = item.id
        this.editForm = { ...item }
      }
    },
    toggleSearch(item){
      console.log('查看',item)
      if (this.editId === item.id) {
        this.editId = null
        this.editForm = {}
      } else {
        this.editId = item.id
        this.editForm = { ...item }
      }
    },
    cancelEdit() {
      this.editId = null
      this.editForm = {}
    },
    async saveEdit() {
      try {
        console.log('this.editForm',this.editForm)
        console.log('score',this.editForm.score)
        this.editForm.score = Number(this.editForm.score)
        console.log('judge',this.judge)
        const res = await api.post('/ai/yxb/update/endScore', this.editForm)
        const result = res.data;
        if (result.code === 200) {
          alert('保存成功')
          this.getList()
          this.cancelEdit()
        }else{
          alert(result.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async checkAccAndPwd(){
      const data = {
        account: this.account,
        password: this.password
      }
      const res = await api.post('/ai/yxb/judges/login', data);
      const result = res.data;
      if (result.code === 200) {
        this.passAuth = true
        this.judge = result.data
        this.pwdTip = ''
        this.getList()
        this.startPolling()
      }else{
        this.tip = result.msg;
      }
    },
    getJudgeName(judgeId){
      const judge = this.list.find(item => item.id === judgeId);
      return judge ? judge.name : '';
    },
    onScoreInput(event, field) {
      let raw = parseFloat(event.target.value);
      if (isNaN(raw) || event.target.value === '') {
        this.editForm[field] = null;
        return;
      }
      const val = Math.min(100, Math.max(0, raw));
      this.editForm[field] = val;
    },
    async changeStatus(item){
      console.log('item', item)
      const res = await api.post('/ai/yxb/update/status',item)
      const result = res.data
      if (result.code === 200) {
        this.getList()
        alert('状态修改成功!')
      }else{
        alert(result.msg)
      }
    }
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

.page { position: relative; z-index: 1; }
.header {
  text-align: center; 
  margin-bottom: 20px; 
}
.badge {
  font-size: 20px;
  width:220px;
  margin: 0 auto;
  padding: 4px 16px; 
  border-radius: 99px;
  background: #FFDC57; 
  color: #000;
}

.welcome{
  font-size: 20px;
  width:320px;
  margin: 10px auto -20px;
  padding: 4px 16px; 
  border-radius: 99px;
  /* background: #fff;  */
  color: #fff;
}

.section {
  background:#21172D;
  border: 2px solid#DBA612;
  border-radius: 16px;
  padding: 16px; 
  margin-bottom: 16px;
}

.table-head,
.table-row {
  display: grid;
  grid-template-columns: 1.2fr 1.2fr 2fr 1.2fr 1fr;
  padding: 10px 0;
  text-align: center;
  align-items: center;
  font-size: 20px;
  color: #FFF8FF;
  font-weight: 100;
}
.table-head {
  font-weight: bold;
  color: #F5DE8E;
}
.table-row {
  background: linear-gradient(90deg, #fff 0 15px, transparent 0 15px);
  background: linear-gradient(90deg, #fff 0 15px, transparent 0 15px);
  background-size: 30px 1px;
  background-repeat: repeat-x;
}
.name { 
  text-align: center; 
  padding-left: 0; 
}

.btn-edit {
  background:#FFDB4B;
  color: #000;
  border: none;
  padding: 5px;
  border-radius: 1230px;
  width: 40px;
  font-size: 12px;
}

.btn-no-edit{
  background:grey;
  color: #fff;
  border: none;
  padding: 5px;
  border-radius: 1230px;
  width: 40px;
  font-size: 12px;
}

.btn-enable{
  background:green;
  color: #fff;
  border: none;
  padding: 5px;
  border-radius: 1230px;
  width: 40px;
  font-size: 12px;
}

.btn-banned{
  background:grey;
  color: #fff;
  border: none;
  padding: 5px;
  border-radius: 1230px;
  width: 40px;
  font-size: 12px;
}

.edit-row {
  padding: 0px;
  border-radius: 10px;
  margin: 10px 0;
}
.edit-form {
  max-width: 380px;
  margin: 0 auto;
}
.form-item { margin-bottom: 10px; }
.form-item label { display: block; margin-bottom: 6px; font-size: 14px; }
.inp {
  width: 100%; box-sizing: border-box;
  background: rgba(255,255,255,.07);
  border: 1px solid #DBA612;
  border-radius: 80px; padding: 10px; color: #fff;
}

.action-row { display: flex; gap: 10px; margin-top: 10px; }
.abtn { width: 100px; flex: 1; padding: 10px; border-radius: 80px; border: none; }

.lable-tip{
  font-size: 14px;
  color: #F5DE8E;
  text-align: center;
}
.go { 
  background: #FFDC57; 
  color: #000; }
.reset { background: rgba(255,255,255,.07); color: #fff; }

.empty { text-align: center; padding: 30px 0; color: #888; }

.statusbar {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: #100a1e; padding: 10px 20px;
  border-top: 1px solid rgba(168,85,247,.1);
  font-size: 12px; color: #C084FC;
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

.score-detail{
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  text-align: center;
  color: #fff;
  font-size: 20px;
  font-weight: 100;
}

.judge-name{
  width: 300px; 
}

.judge-score{
  width: 300px; 
}

.score-detail-title{
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  text-align: center;
  color: #F5DE8E;
  font-size: 26px;
}

.judge-name-title{
  width: 300px; 
}

.judge-score-title{
  width: 300px; 
}
</style>