<template>
  <div class="control-page">
    <div class="pwd-modal" v-if="!passAuth">
      <div class="pwd-box">
        <div class="pwd-title">用户登录</div>
        <div class="input-group phone-input-group" ref="phoneGroup">
          <div class="phone-code-wrapper">
            <input
              type="text"
              class="selected-phone-code"
              v-model="selectedPhoneCode"
              @focus="showPhoneCodeDropdown = true"
              @click.stop
            >
            <span class="iconfont icon-vertical_line"></span>
            <input
              type="tel"
              class="form-input"
              v-model="phone"
              placeholder="请输入手机号"
              @keyup.enter="toLogin"
            />
          </div>
          <transition name="fade">
            <div v-if="showPhoneCodeDropdown" class="phone-code-dropdown">
              <div
                v-for="item in filteredCountryList"
                :key="item.country_code"
                class="phone-code-item"
                :class="{ active: item.phone_code === selectedPhoneCode }"
                @click="selectPhoneCode(item)"
              >
                <span class="country-name">{{ item.chinese_name }}</span>
                <span class="country-code">{{ item.phone_code }}</span>
              </div>
            </div>
          </transition>
        </div>
        <div class="code-wrap">
          <input v-model="code" @keyup.enter="toLogin" class="pwd-input" type="text" placeholder="请输入验证码">
          <button
            class="code-btn"
            :class="{disabledBtn: codeCountDown>0}"
            @click="getCode"
            :disabled="codeCountDown>0"
          >
            {{ codeCountDown > 0 ? `${codeCountDown}s` : '获取验证码' }}
          </button>
        </div>
        <div class="tip">{{tip}}</div>
        <button class="pwd-btn" @click="toLogin">登录</button>
      </div>
    </div>

    <!-- 编辑信息弹窗 -->
    <div class="edit-modal" v-if="showEditModal" @click.self="showEditModal=false">
      <div class="edit-box">
        <div class="edit-title">编辑个人信息</div>
        <div class="edit-avatar-wrap">
          <div class="user-head-img">
            <img :src="tempUserData.headImg" alt="头像"/>
            <input ref="avatarInput" type="file" accept="image/*" style="display:none" @change="onAvatarChange"/>
          </div>
          <button class="edit-avatar-btn" @click="$refs.avatarInput.click()">更换头像</button>
        </div>
        <div class="edit-input-wrap">
          <label class="nick-name-lable">昵称</label>
          <input class="edit-input" v-model="tempUserData.nickName" placeholder="输入昵称"/>
        </div>
        <div class="edit-btn-row">
          <button class="edit-cancel-btn" @click="showEditModal=false">取消</button>
          <button class="edit-save-btn" @click="saveUserInfo">保存</button>
        </div>
      </div>
    </div>

    <div class="bg-wrap">
      <div class="bg-grad"></div>
    </div>
    <div class="page">
      <div class="header">
        <div class="htitle">毓秀杯-第二期 · 人气榜</div>
        <div class="htip">请给中意的选手投上一票吧～</div>
        <div class="tip-info"></div>
        <div class="user-info" v-if="this.userData!=null">
          <div class="user-head-img" @click="showUserMenu = !showUserMenu">
            <img :src="this.userData.headImg" alt="用户头像" />
          </div>
          <div class="user-menu" v-if="showUserMenu">
            <div class="menu-item" @click="openEdit">编辑信息</div>
            <div class="menu-item" @click="handleLogout">退出登录</div>
          </div>
          <div class="user-nick-name">{{ this.userData.nickName }}</div>
          <div class="user-vote-count">剩余票数：<span class="user-vote-count-number">{{ this.userData.voteCount }}</span></div>
        </div>
      </div>

      <div class="vote-info">
        <div class="vote-item" v-for="(item, index) in voteList" :key="index">
          <div class="vote-item-head">
            <img :src="item.headImage" alt="选手头像" />
          </div>
          <div class="vote-item-text">
            <div class="vote-item-group">{{ item.groupName }}</div>
            <div class="vote-item-name">{{ item.name }}</div>
            <div class="vote-item-work">《{{ item.work }}》</div>
          </div>
          <div class="vote-item-number">{{ item.voteNumber }}</div>
          <button class="abtn-vote" @click="updateVote(index)">投票</button>
        </div>
      </div>

      <div class="vote-record">
        <div class="vote-record-title">投票记录</div>
        <div class="vote-record-list">
          <div class="vote-record-item" v-for="(item, index) in voteRecordList" :key="index">
            <div>{{ item.userName + '在' + item.createTime + '投票给了' + item.voteName }}</div>
          </div>
        </div>
      </div>

      <div class="bullet-screen-wrap">
        <div class="bullet-screen-list"></div>
      </div>
      <div class="bullet-screen">
        <input class="bullet-screen-input" type="text" v-model="danmu" placeholder="请输入弹幕内容">
      </div>
      <div class="action-row">
        <button class="abtn-go" @click="sendDanmu">✦发送弹幕</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import countryList from '@/utils/countryCode';
import { getAiURL,getBackendApiURL } from '@/utils/index';

const api = axios.create({
  baseURL: getAiURL(),
  headers: { 'Content-Type': 'application/json' },
});
const backendApi = axios.create({
  baseURL: getBackendApiURL(),
  headers: { 'Content-Type': 'application/json' },
});

export default {
  name: 'User',
  data() {
    return {
      passAuth: false, // 是否通过口令校验
      phone: '',
      code: '',
      tip: '',
      selectedPhoneCode: '+86',
      selectedCountryCode: 'CN',
      showPhoneCodeDropdown: false,
      countryDataList: countryList,
      codeCountDown: 0, // 倒计时数字
      voteList: [],
      voteRecordList:[],
      timer: null,
      danmu: '',
      userData: null,
      showUserMenu: false,
      showEditModal: false,
      tempUserData: {},
    }
  },
  mounted() {
    const cacheUser = localStorage.getItem('yxb_user_data');
    if (cacheUser) {
      try {
        this.userData = JSON.parse(cacheUser);
        this.passAuth = true;
      } catch (e) {
        localStorage.removeItem('yxb_user_data');
      }
    }
    this.getVoteList()
    this.startPolling()
    document.addEventListener('click', this.handleClickOutside);
    // 点击页面空白关闭下拉菜单
    document.addEventListener('click', this.closeUserMenu);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('click', this.closeUserMenu);
    this.stopPolling();
  },
  computed: {
    filteredCountryList() {
      const query = this.selectedPhoneCode.replace('+', '').toLowerCase();
      return this.countryDataList.filter(item =>
        item.chinese_name.includes(query) ||
        item.phone_code.includes(query)
      );
    }
  },
  methods: {
    closeUserMenu(e) {
      if(!this.showUserMenu) return
      const dom = document.querySelector('.user-info')
      if(dom && !dom.contains(e.target)){
        this.showUserMenu = false
      }
    },
    async getCode() {
      if(this.codeCountDown > 0) return
      if(!this.phone){
        this.tip = '请输入手机号'
        return
      }
      const countryNum = this.selectedPhoneCode.replace('+', '');
      const data = {
        phone: this.phone,
        countryCode: this.selectedCountryCode,
        countryNum: countryNum
      }
      try {
        const res = await api.post('/ai/yxb/send/code', data);
        console.log('res', res);
        const result = res.data;
        console.log('result', result);
        if (result.code === 200) {
          this.tip = '验证码发送成功'
          this.codeCountDown = 60
          const timer = setInterval(() => {
            this.codeCountDown -= 1
            if(this.codeCountDown <= 0) {
              clearInterval(timer)
            }
          }, 1000)
        } else {
          this.tip = result.msg;
        }
      } catch (err) {
        this.tip = '请求异常'
        console.error(err)
      }
    },
    togglePhoneCodeDropdown() {
      this.showPhoneCodeDropdown = !this.showPhoneCodeDropdown;
    },
    selectPhoneCode(item) {
      this.selectedPhoneCode = item.phone_code;
      this.selectedCountryCode = item.country_code;
      this.showPhoneCodeDropdown = false;
    },
    handleClickOutside(e) {
      if (!this.showPhoneCodeDropdown) return;
      const wrapper = this.$refs.phoneGroup;
      if (wrapper && !wrapper.contains(e.target)) {
        this.showPhoneCodeDropdown = false;
      }
    },
    async toLogin(){
      const countryNum = this.selectedPhoneCode.replace('+', '');
      const data = {
        phone: this.phone,
        code: this.code,
        countryCode: this.selectedCountryCode,
        countryNum: countryNum
      }
      const res = await api.post('/ai/yxb/user/login', data);
      const result = res.data;
      console.log('result', result);
      if (result.code === 200) {
        this.passAuth = true
        this.userData = result.data
        this.tip = ''
        localStorage.setItem('yxb_user_data', JSON.stringify(this.userData))
        this.getVoteList()
        this.getVoteRecordList()
        this.startPolling()
      }else{
        this.tip = result.msg;
      }
    },
    handleLogout() {
      this.logout()
      this.showUserMenu = false
    },
    logout() {
      this.passAuth = false
      this.userData = null
      localStorage.removeItem('yxb_user_data')
      this.stopPolling()
    },
    // 打开编辑弹窗
    openEdit(){
      this.showUserMenu = false
      this.tempUserData = {...this.userData}
      this.showEditModal = true
    },
    async saveUserInfo(){
      const res = await api.post('/ai/yxb/update/user', this.tempUserData);
      const result = res.data;
      if(result.code !== 200){
        alert(result.msg)
        return
      }
      this.userData = {...this.tempUserData}
      localStorage.setItem('yxb_user_data', JSON.stringify(this.userData))
      this.showEditModal = false
      alert('信息更新成功！')
    },
    async onAvatarChange(e) {
      const file = e.target.files[0]
      if (!file) return
      // 构造formData传给后端上传接口
      const formData = new FormData()
      formData.append('file', file)
      try {
        const res = await backendApi.post('/upload/uploadImage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        const result = res.data
        if(result.code === 200) {
          // 更新临时头像
          this.tempUserData.headImg = result.data;
          alert('头像上传成功！')
        } else {
          alert(result.msg || '上传失败')
        }
      } catch(err) {
        console.error(err)
        alert('图片上传请求异常')
      }
    },
    startPolling() {
      if(this.timer) clearInterval(this.timer)
      this.timer = setInterval(()=>{
        this.getVoteList();
        this.getVoteRecordList();
      }, 10000)
    },
    stopPolling() {
      if(this.timer){
        clearInterval(this.timer)
        this.timer = null
      }
    },
    async getVoteList() {
      try {
        if(this.userData == null){
          this.userData = this.$route.params.userData;
          console.log('userData',this.userData)
        }
        const { data } = await api.get('/ai/yxb/current/vote');
        if (Array.isArray(data.data)) {
          const filtered = data.data;
          this.voteList = filtered.sort((a, b) => {
            const sa = a.voteNumber === -1 ? -999 : a.voteNumber;
            const sb = b.voteNumber === -1 ? -999 : b.voteNumber;
            return sb - sa;
          }).map((item, realIndex)=>{
            return {
              ...item,
              realRank: realIndex + 1
            }
          });
          this.voteListOffset = 0;
        }
      } catch (e) {}
    },
    async getVoteRecordList() {
      try {
        const res = await api.get('/ai/yxb/current/vote/record');
        const result = res.data;
        if(result.code == 200){
          this.voteRecordList = result.data;
        }else{
          alert(result.msg)
        }
      } catch (e) {}
    },
    async updateVote(index) {
      if (this.userData == null) {
        alert('请先登录!')
        return;
      }
      try {
        const req = {
          item: this.voteList[index],
          userData: this.userData
        }
        console.log('req',req)
        const res = await api.post('/ai/yxb/update/vote',req)
        const result = res.data;
        console.log('result',result)
        if (result.code === 200) {
          this.userData = result.data;
          localStorage.setItem('yxb_user_data', JSON.stringify(this.userData))
          alert('投票成功!')
          this.getVoteList()
        }else{
          alert(result.msg)
        }
      } catch (e) {
        alert('投票失败!')
      }
    },
    async sendDanmu(){
      if (this.userData == null) {
        alert('请先登录!')
        return;
      }
      if(this.danmu == ''){
        alert('请输入弹幕内容!')
        return;
      }
      if(this.danmu.length > 50){
        alert('弹幕内容不能超过50个字!')
        return;
      }
      try {
        const req = {
          id: this.userData.id,
          context: this.danmu
        }
        console.log('req',req)
        const res = await api.post('/ai/yxb/send/danmu',req)
        const result = res.data;
        console.log('result',result)
        if (result.code === 200) {
          alert('发送成功!');
          this.danmu='';
        }else{
          alert(result.msg)
        }
      } catch (e) {
        alert('发送失败!')
      }
    }
  }
}
</script>

<style scoped>
.user-vote-count{
  font-size: 20px;
  color: #fff;
}
.user-vote-count-number{
  color: #FEDA45;
}
.user-head-img {
  width: 50px;
  height: 50px;
  margin: 5px auto;
  cursor: pointer;
  position: relative;
}
.user-head-img img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #FEDA45;
}
.user-nick-name{
  text-align: center;
  font-size: 20px;
  color: #fff;
}
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
  font-size: 25px;
  color: #FEDA45;
  letter-spacing: 1px;
  font-weight: bold;
  margin-bottom: 10px;
}
.htip{
  font-size: 15px;
  color: #fff;
  font-weight: 100;
}
.vote-info {
  background: #21172D;
  border: 2px solid #DBA612;
  border-radius: 25px;
  margin-bottom: 20px;
  min-height: 250px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding:20px 0px;
}
.vote-item {
  width: calc(50% - 20px);
  min-width: 120px;
  text-align: center;
  color: #fff;
  font-size: 15px;
}
.vote-item-head {
  width: 100px;
  height: 100px;
  margin: 15px auto;
}
.vote-item-head img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #FEDA45;
}
.vote-item-text {
  min-height: 100px;
}
.vote-item-group {
  font-size: 15px;
  margin-bottom: 6px;
}
.vote-item-name {
  font-size: 15px;
  margin-bottom: 6px;
}
.vote-item-work {
  font-size: 14px;
  line-height: 1.3;
  margin-bottom: 4px;
}
.vote-item-number {
  color: #FEDA45;
  font-size: 24px;
  margin: 0px 0px 5px;
}
.abtn-vote {
  border-radius: 20px;
  background: #FEDA45;
  border: none;
  padding: 5px 14px;
  font-size: 14px;
  font-weight: bold;
  color: #000;
  width: 80px;
  margin: 0 auto 10px;
  align-self: center;
}
.bullet-screen {
  background: #21172D;
  border: 2px solid  #DBA612;
  border-radius: 25px;
  margin-bottom: 20px;
}
.bullet-screen-input{
  width: 99%;
  font-size: 20px;
  height: 50px;
  background: transparent;
  border: none;
  border-radius: 25px;
  color: #fff;
  text-align: center;
}
.action-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.abtn-go {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 50px;
  font-size: 18px;
  font-weight: bold;
  background: #F3D356;
  border: 2px solid  #DBA612;
  color: #000;
}
.vote-record {
  background: #21172D;
  border: 2px solid #DBA612;
  border-radius: 25px;
  margin-bottom: 20px;
  padding: 20px;
}
.vote-record-title {
  font-size: 22px;
  color: #FEDA45;
  text-align: center;
  margin-bottom: 16px;
  font-weight: bold;
}
.vote-record-list {
  max-height: 180px;
  overflow-y: auto;
}
.vote-record-item {
  color: #fff;
  font-size: 15px;
  padding: 8px 0;
  text-align: center;
  border-bottom: 1px solid rgba(254, 218, 69, 0.2);
}
/* 滚动条美化，适配深色背景 */
.vote-record-list::-webkit-scrollbar {
  width: 4px;
}
.vote-record-list::-webkit-scrollbar-thumb {
  background-color: #FEDA45;
  border-radius: 4px;
}
.vote-record-list::-webkit-scrollbar-track {
  background: transparent;
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
.phone-input-group {
  position: relative;
  width:100%;
  margin-bottom:12px;
}
.phone-code-wrapper {
  display: flex;
  align-items: center;
  width:100%;
}
.selected-phone-code {
  width: 60px;
  height: 48px;
  border-radius: 12px 0 0 12px;
  border:1.5px solid #DBA612;
  border-right: none;
  font-size: 16px;
  color: #fff;
  background:#3F342B;
  text-align: center;
  /* 新增 修复苹果手机高度不一致 */
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  -webkit-appearance: none;
  vertical-align: middle;
}
.form-input {
  flex:1;
  height:48px; 
  background:#3F342B;
  border:1.5px solid #DBA612;
  border-left: none;
  color:#fff;
  font-size:18px;
  padding:0 10px;
  border-radius:0 12px 12px 0;
  box-sizing: border-box;
  margin:0;
  -webkit-appearance: none;
  vertical-align: middle;
}
.phone-code-dropdown {
  position: absolute;
  top: 105%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: #3F342B;
  border:1.5px solid #DBA612;
  border-radius:12px;
  z-index: 10000;
}
.phone-code-item {
  padding:10px 15px;
  display:flex;
  justify-content:space-between;
  color:#fff;
  cursor:pointer;
}
.phone-code-item:hover {
  background:#504436;
}
.phone-code-item.active {
  color:#FEDA45;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.icon-vertical_line{
  margin: 0 -10px;
  color: #FEDA45;
  font-size: 20px;
}
.code-wrap{
  display: flex;
  align-items: center;
  gap: 0px;
  margin-bottom:12px;
  width: 100%;
}
.pwd-input{
  flex: 1;
  box-sizing:border-box;
  height:48px;
  background:#3F342B;
  border:1.5px solid #DBA612;
  border-radius:12px 0 0 12px;
  color:#fff;
  font-size:18px;
  padding:0 15px;
}
.code-btn{
  width: 100px;
  height: 48px;
  background: #F3D356;
  border: 1.5px solid #DBA612;
  border-left: none;
  border-radius: 0 12px 12px 0;
  color: #000;
  font-size: 14px;
  text-align: center;
  line-height: 48px;
  cursor: pointer;
}
.code-btn.disabledBtn{
  background:#777 !important;
  color:#fff !important;
  cursor: not-allowed;
}
.user-info {
  position: relative;
}
.user-menu{
  position:absolute;
  width:150px;
  height:100px;
  top:60px;
  left:50%;
  transform: translateX(-50%);
  background:#21172D;
  border:2px solid #DBA612;
  border-radius:12px;
  z-index:99;
  overflow:hidden;
  font-size:20px;
}
.menu-item{
  padding:10px 20px;
  color:#fff;
  cursor:pointer;
  white-space: nowrap;
}
.menu-item:hover{
  background:#3F342B;
}
.menu-item + .menu-item{
  border-top:1px solid rgba(254,218,69,0.2);
}
.edit-modal{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.85);
  z-index:99;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
}
.edit-box{
  background:#21172D;
  border:2px solid #DBA612;
  border-radius:20px;
  padding:30px;
  width:340px;
  text-align:center;
}
.edit-title{
  font-size:24px;
  color:#FEDA45;
  margin-bottom:20px;
}
.edit-avatar-wrap{
  margin-bottom:20px;
}
.edit-avatar-btn{
  margin-top:8px;
  border:none;
  background:#F3D356;
  color:#000;
  border-radius:12px;
  padding:6px 12px;
  cursor:pointer;
}
.edit-input-wrap{
  text-align:left;
  color:#FEDA45;
  margin-bottom:20px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.edit-input-wrap label{
  display:block;
  margin-bottom:6px;
}
.edit-input{
  width:80%;
  box-sizing:border-box;
  height:44px;
  background:#3F342B;
  border:1.5px solid #DBA612;
  border-radius:12px;
  color:#fff;
  padding:0 12px;
}
.edit-btn-row{
  display:flex;
  gap:12px;
}
.edit-cancel-btn,.edit-save-btn{
  flex:1;
  height:44px;
  border-radius:12px;
  border:none;
  font-weight:bold;
  cursor:pointer;
}
.edit-cancel-btn{
  background:#777;
  color:#fff;
}
.edit-save-btn{
  background:#F3D356;
  color:#000;
}
.nick-name-lable{
  font-size:20px;
}

.country-name{
  font-size:18px;
}

.country-code{
  font-size:18px;
}
</style>
