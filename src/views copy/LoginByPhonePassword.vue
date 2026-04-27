<template>
  <div class="home-container">
    <div class="head-container">
      <img src="../assets/img/上面固定栏.png" class="logo" alt="CareerMars"/>
    </div>

    <div class="title-section">
      <div class="title"><span class="login-title">登录</span>查看分析结果</div>
    </div>

    <div class="main-container">
      <div class="login-card">
        <div class="login-select">
          <span class="select-phone">手机号登录</span>
          <span class="select-email" @click="loginByEmail">邮箱登录</span>
        </div>
        <form  class="login-form" @submit.prevent="handleLogin">
          <div class="input-group phone-input-group" ref="phoneGroup">
            <div class="phone-code-wrapper">
              <span class="iconfont icon-shouji" @click.stop="togglePhoneCodeDropdown"></span>
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
                required
              />
            </div>

            <transition name="fade">
              <div v-if="showPhoneCodeDropdown" class="phone-code-dropdown">
                <div v-for="item in filteredCountryList"
                  :key="item.country_code"
                  class="phone-code-item"
                  :class="{ active: item.phone_code === selectedPhoneCode }"
                  @click="selectPhoneCode(item)">
                  <span class="country-name">{{ item.chinese_name }}</span>
                  <span class="country-code">{{ item.phone_code }}</span>
                </div>
              </div>
            </transition>
          </div>

          <div class="input-group code-input-group">
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
            <span class="login-link-text" @click="login"> 验证码登录</span>
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
import countryList from '@/utils/countryCode';
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
  name: 'Home',
  data() {
    return {
      phone: '',
      password: '',
      selectedPhoneCode: '+86',
      selectedCountryCode: 'CN',
      showPhoneCodeDropdown: false,
      countdown: 60,
      countryDataList: countryList, 
      timer: null, 
      analysisResultData: null,
      interviewScore: null,
      expectationPosition: null,
      resume: null,
      showPassword: false,
    };
  },
  computed: {
    // 搜索过滤国家列表
    filteredCountryList() {
      const query = this.selectedPhoneCode.replace('+', '').toLowerCase();
      return this.countryDataList.filter(item => 
        item.chinese_name.includes(query) || 
        item.phone_code.includes(query)
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
    togglePasswordVisibility(){
      this.showPassword = !this.showPassword
    },
    loadAnalysisData(){
      this.analysisResultData = this.$route.query.analysisResultData;
      this.interviewScore = this.$route.query.interviewScore;
      this.expectationPosition = this.$route.query.expectationPosition;
      this.resume = this.$route.query.resume;

      console.log("login-by-phone-password-questions:",this.analysisResultData);
      console.log("login-by-phone-password-userAnswers:",this.interviewScore);
      console.log("login-by-phone-password-expectationPosition:",this.expectationPosition);
      console.log("login-by-phone-password-resume:",this.resume);
    },
    // 补上模板中引用了但没定义的方法
    register() { 
      console.log('点击了注册'); 
      this.$router.push({
        path: '/register-by-phone-code',
        query: { 
          analysisResultData: this.analysisResultData, 
          interviewScore: this.interviewScore, 
          expectationPosition: this.expectationPosition,
          resume: this.resume 
        },
      });
    },
    login() {
      console.log('点击了验证码登录'); 
      this.$router.push({
        path: '/login-by-phone-code',
        query: { 
          analysisResultData: this.analysisResultData,
          interviewScore: this.interviewScore, 
          expectationPosition: this.expectationPosition,
          resume: this.resume 
        },
      });
    },
    loginByEmail(){
      console.log("点击了邮箱登录");
      this.$router.push({
        path: '/login-by-email-password',
        query: { 
          analysisResultData: this.analysisResultData, // 将数据转为字符串传递
          interviewScore: this.interviewScore, // 将数据转为字符串传递
          expectationPosition: this.expectationPosition, // 将数据转为字符串传递
          resume: this.resume // 将数据转为字符串传递
        },
      });
    },
    toDeal() { console.log('点击了用户协议'); },
    toHide() { console.log('点击了隐私政策'); },
    togglePhoneCodeDropdown() {
      this.showPhoneCodeDropdown = !this.showPhoneCodeDropdown;
    },
    selectPhoneCode(item) {
      this.selectedPhoneCode = item.phone_code;
      this.selectedCountryCode = item.country_code;
      this.showPhoneCodeDropdown = false;
    },
    handleClickOutside(e) {
      // 1. 如果下拉框本来就没开，直接跳出，啥也不干
      if (!this.showPhoneCodeDropdown) return;
      // 2. 只有当点击的不是下拉框内部，且 ref 确实存在时才关闭
      const wrapper = this.$refs.phoneGroup; 
      if (wrapper && !wrapper.contains(e.target)) {
        this.showPhoneCodeDropdown = false;
      }
    },
    
    async handleLogin() {
      console.log("handleLogin 方法被调用"); // 添加调试信息
      if (!this.phone || !this.password) return alert('请填写完整信息');
      try {
        const countryNum = this.selectedPhoneCode.replace('+', '');
        const API_PATH = "/login/byPhoneAndPassword";
        const phoneData = {
          phone: this.phone,
          countryNum: countryNum,
          countryCode: this.selectedCountryCode,
          password: this.password,
        }
        console.log("countryNum", countryNum);
        console.log("phoneData", phoneData);
        const response = await api.post(API_PATH, phoneData);
        console.log("response", response);

        const result = response.data;
        if (result.code === 200) {
          console.log("result", result);
          alert('登录成功');
          this.$router.push({
            path: '/analysis-result',
            query: { 
              analysisResultData: this.analysisResultData, // 将数据转为字符串传递
              interviewScore: this.interviewScore, // 将数据转为字符串传递
              expectationPosition: this.expectationPosition, // 将数据转为字符串传递
              resume: this.resume // 将数据转为字符串传递
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
/* 基础容器 */
.home-container {
  width: 100vw;
  min-height: 100vh;
  height: auto;
  background-image: url('../assets/img/第一页白背景.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  left: 0;
}

.head-container {
  height: 10rem;
}

.logo {
  display: block;
  width: 100%;
  height: auto;
}

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
  /* width: 100%; */
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

.phone-code-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
}

.selected-phone-code {
  width: 7rem;
  border: none;
  outline: none;
  font-size: 3rem;
  color: #999999;
  font-weight: 500;
}

.form-input {
  height: 100%;
  border: none;
  outline: none;
  padding: 0 1.5rem;
  font-size: 3rem;
}

/* 验证码按钮 */
.send-code-btn {
  flex-shrink: 0; /* 防止被压缩 */
  height: 7rem;
  width: 18rem;
  background: #53E4C7;
  color: white;
  border: none;
  border-radius: 1rem;
  font-size: 2.5rem;
  margin: 0 2rem;
}

.send-code-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 下拉列表 */
.phone-code-dropdown {
  position: absolute;
  top: 105%;
  left: 0;
  width: 100%;
  max-height: 25rem;
  overflow-y: auto;
  background: white;
  border: 1rem solid #ddd;
  border-radius: 1rem;
  z-index: 1000;
  box-shadow: 0 1rem 2rem rgba(0,0,0,0.1);
}

.phone-code-item {
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  font-size: 3rem;
  cursor: pointer;
}

.phone-code-item:hover {
  background: #f0fffb;
}

.phone-code-item.active {
  color: #53E4C7;
  font-weight: bold;
}

/* 文本链接 */
.hint-right {
  text-align: right;
  margin-top: -1rem;
  margin-bottom: 3rem;
}

.login-link-text {
  color: #53E4C7;
  font-size: 3rem;
  text-decoration: none;
  margin-left:10rem;
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
  margin-bottom: 2rem;
}


.select-phone {
  display: inline-block; /* 关键：让下划线完整显示 */
  margin-left: 6rem;
  color: #53E4C7;
  font-size: 5rem;
  font-weight: bold;
  border-bottom: 0.5rem solid #53E4C7; /* 用主色，更明显 */
  padding-bottom: 0.5rem; /* 减少内边距，让下划线更贴近文字 */
  margin-bottom: 2rem;
}

.select-email{
  margin-left: 6rem;
  color: #999999;
  font-size: 5rem;
  font-weight: bold;
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
</style>