<template>
  <div class="loginByEmailPassword-page">
    <div class="title-section">
      <div class="title"><span class="login-title">登录</span>查看分析结果</div>
    </div>

    <div class="main-container">
      <div class="login-card">
        <div class="login-select">
          <span class="select-phone" @click="loginByPhone">手机号登录</span>
          <span class="select-email">邮箱登录</span>
        </div>
        <form  class="login-form" @submit.prevent="handleLogin">
          <div class="input-group email-input-group" ref="emailWrapper">
            <div class="email-code-wrapper">
              <span class="iconfont icon-youxiang" @click.stop="toggleEmailDropdown"></span>

              <span class="iconfont icon-vertical_line"></span>
              <input
                type="text"
                class="form-input"
                v-model="email"
                placeholder="请输入邮箱号"
                required
              />
              <input
                type="text"
                class="selected-email-suffix"
                v-model="selectedEmailSuffix"
                @focus="showEmailDropdown = true"
                @click.stop
              />
            </div>

            <transition name="fade">
              <div v-show="showEmailDropdown" class="email-dropdown">
                <div
                  v-for="item in filteredEmailList"
                  :key="item.email_suffix"
                  class="email-item"
                  :class="{ active: item.email_suffix === selectedEmailSuffix }"
                  @click="selectEmailSuffix(item)"
                >
                  <span class="email-name">{{ item.email_name }}</span>
                  <span class="email-suffix">{{ item.email_suffix }}</span>
                </div>
              </div>
            </transition>
          </div>

          <div class="input-group">
            <div class="input-icon-wrapper">
              <span class="iconfont icon-mima"></span>
              <span class="iconfont icon-vertical_line"></span>
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                v-model="password"
                placeholder="请输入密码"
              />
            <span class="iconfont icon-yanjing" :class="{ 'icon-active': showPassword }" @click="togglePasswordVisibility"></span>
            </div>
          </div>
          
          

          <div class="hint-right">
            <span class="register-link-text" @click="register"> 注册账号</span>
            <span class="login-link-text"> 目前仅支持密码登录</span>
          </div>

          <div class="agreement-text">
            登录 即代表您阅读并同意
            <span class="link-highlight" @click="toDeal"> [用户协议] </span>
            <span class="link-highlight" @click="toHide"> [隐私政策] </span>
          </div>

          <button class="login-btn">登录</button>

        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import emailListModule from '@/utils/email';
const emailList = Array.isArray(emailListModule)
  ? emailListModule
  : emailListModule.default;
import { getBackendApiURL } from '@/utils/index';

const api = axios.create({
  baseURL: getBackendApiURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default {
  name: 'LoginByEmailPassword',
  data() {
    return {
      selectedEmailSuffix: '@qq.com',
      showEmailDropdown: false,
      emailDataList: emailList,
      email: '',
      password: '',
      countdown: 60,
      timer: null, 
      testReportText: '',  
      resumeText: '',  
      positions: [],
      showPassword: false,
      userInfo: null,
    };
  },
  computed: {
    filteredEmailList() {
      const query = this.selectedEmailSuffix.replace('@', '').toLowerCase();
      return this.emailDataList.filter(item =>
        item.email_name.toLowerCase().includes(query) ||
        item.email_suffix.toLowerCase().includes(query)
      );
    }  
},
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.loadAnalysisData(); // ← 在这里调用！
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    if (this.timer) clearInterval(this.timer); // 记得销毁组件时清理定时器
  },
  methods: {
    toggleEmailDropdown() {
      this.showEmailDropdown = !this.showEmailDropdown;
    },
    selectEmailSuffix(item) {
      this.selectedEmailSuffix = item.email_suffix;
      this.showEmailDropdown = false;
    },
    handleClickOutside(e) {
      // 1. 如果下拉框本来就没开，直接跳出，啥也不干
      if (!this.showEmailDropdown) return;
      // 2. 只有当点击的不是下拉框内部，且 ref 确实存在时才关闭
      const wrapper = this.$refs.emailWrapper; 
      if (wrapper && !wrapper.contains(e.target)) {
        this.showEmailDropdown = false;
      }
    },
    togglePasswordVisibility(){
      this.showPassword = !this.showPassword
    },
    loadAnalysisData(){
      this.testReportText = this.$route.query.testReportText;
      this.resumeText = this.$route.query.resumeText;
      this.positions = this.$route.query.positions;
    },
    // 补上模板中引用了但没定义的方法
    register() { 
      console.log('点击了注册'); 
      this.$router.push({
        path: '/register-by-email-code',
        query: { 
          testReportText: this.testReportText,
          resumeText: this.resumeText,
          positions: this.positions,
        },
      });
    },
    loginByPhone(){
      this.$router.push({
        path: '/login-by-phone-password',
        query: { 
          testReportText: this.testReportText,
          resumeText: this.resumeText,
          positions: this.positions,
        },
      });
    },
    loginByPhone(){
      this.$router.push({
        path: '/login-by-phone-password',
        query: { 
          testReportText: this.testReportText,
          resumeText: this.resumeText,
          positions: this.positions,
        },
      });
    },
    toDeal() {
       console.log('点击了用户协议'); 
      },
    toHide() { console.log('点击了隐私政策'); },
    async handleLogin() {
      console.log("handleLogin 方法被调用"); // 添加调试信息
      if (!this.email || !this.password) return alert('请填写完整信息');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email + this.selectedEmailSuffix)) {
        return alert('邮箱格式不正确，请输入正确的邮箱格式！');
      }

      try {
        const API_PATH = "/login/byEmailAndPassword";
        const emailData = {
          email: this.email + this.selectedEmailSuffix,
          password: this.password,
        }
        console.log("emailData", emailData);
        const response = await api.post(API_PATH, emailData);
        console.log("response", response);
        const result = response.data;
        if (result.code === 200) {
          alert('登录成功');
          this.$router.push({
            path: '/login-success',
            query: { 
              testReportText: this.testReportText,
              resumeText: this.resumeText,
              positions: this.positions,
              userInfo: JSON.stringify(result.data),
            },
          });
        } else {
          console.log("result", result);
          alert(result.msg);
        }
      } catch (err) {
        console.error(err);
        alert('登录异常！请稍后重试！');
      }
    },
    // toDeal() { window.open(`${window.location.origin}/deal`); },
    // toHide() { window.open(`${window.location.origin}/hide`); }
  }
}
</script>

<style scoped>

.title-section {
  margin-top: 18rem;
  margin-bottom: 6rem;
}

.title {
  font-size: 8rem; /* 稍微缩小原10rem以平衡视觉 */
  font-weight: 900;
  color: #333;
  text-align: center;
  line-height: 1.2;
}

.login-title {
  color: #53E4C7;
}

/* 主内容区 */
.main-container {
  width: 80rem;
  height: 90rem;
  max-width: 120rem;
  margin: 0 auto;
  padding: 5rem 0;
  display: flex;
  justify-content: center;
}

/* 登录卡片 */
.login-card {
  width: 65rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 3rem;
  padding: 8rem 5rem;
  box-shadow: 0 2rem 5rem rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1rem);
}

/* 输入框通用样式 */
.input-group {
  position: relative;
  display: flex;
  align-items: center;
  height: 10rem;
  border: 0.5rem solid #e0e0e0;
  border-radius: 1rem;
  background: #fff;
  margin-bottom: 5rem;
  padding: 0 2rem;
  transition: all 0.3s;
}

.input-group:focus-within {
  border-color: #53E4C7;
  box-shadow: 0 0 1rem rgba(83, 228, 199, 0.2);
}

.email-input-group {
  position: relative;
}

.email-code-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  /* justify-content: space-between;  */
}

.form-input {
  height: 100%;
  border: none;
  outline: none;
  padding: 0 1.5rem;
  font-size: 3rem;
  flex: 2;
}

/* 文本链接 */
.hint-right {
  text-align: right;
  margin-top: -1rem;
  margin-bottom: 3rem;
}

.login-link-text {
  color: #999999;
  font-size: 3rem;
  text-decoration: none;
  margin-left:-2rem;
}

.register-link-text {
  position: relative;
  margin-right: 27rem;
  color: #53E4C7;
  font-size: 3rem;
  text-decoration: none;
}

.agreement-text {
  text-align: center;
  font-size: 2.5rem;
  color: #999;
  margin-top: 8rem;
  margin-bottom: 3rem;
  line-height: 1.5;
}

.link-highlight {
  color: #53E4C7;
  cursor: pointer;
}

/* 提交按钮 */
.login-btn {
  width: 90%;
  height: 8rem;
  background: #53E4C7;
  color: white;
  border: none;
  border-radius: 1rem;
  font-size: 3rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 2rem;
  margin-left: 3.5rem;
}

.login-btn:hover {
  transform: translateY(-1rem);
  box-shadow: 0 1rem 2rem rgba(83, 228, 199, 0.4);
}

.login-select{
  margin-bottom: 5rem;
}


.select-phone {
  display: inline-block; /* 关键：让下划线完整显示 */
  margin-left: 6rem;
  color: #999999;
  font-size: 5rem;
  font-weight: bold;
}

.select-email{
  margin-left: 6rem;
  color: #53E4C7;
  font-size: 5rem;
  font-weight: bold;
  border-bottom: 0.5rem solid #53E4C7; /* 用主色，更明显 */
  padding-bottom: 0.5rem; /* 减少内边距，让下划线更贴近文字 */
  margin-bottom: 2rem;
}

.iconfont{
  color: #999999;
}

.icon-vertical_line{
  margin: 0 -1rem; 
}

.icon-yanjing{
  position: relative;
  font-size: 5rem;
  left: 10rem;
  color: #999999;
}

.icon-yanjing.icon-active {
  color: #53E4C7;
}

.selected-email-suffix {
  min-width: 10rem;        
  width: auto;
  text-align: right;        
  margin-left: -18rem;         
  background: transparent;
  border: none;
  outline: none;
  font-size: 3.5rem;
  color: #53E4C7;
}

.email-dropdown {
  position: absolute;
  top: 105%;
  left: 0;
  width: 100%;
  height: 25rem;
  max-height: 25rem;
  overflow-y: auto;
  background: #fff;
  border: 1rem solid #ddd;
  border-radius: 1rem;
  z-index: 1000;
  box-shadow: 0 1rem 2rem rgba(0,0,0,0.1);
  color: #000;
}


.email-item {
  padding: 2.5rem 2rem; /* 增加点击区域 */
  display: flex;
  justify-content: space-between;
  font-size: 3rem;
  color: #333; 
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.email-item:hover {
  background: #f0fffb;
  color: #53E4C7;
}

</style>