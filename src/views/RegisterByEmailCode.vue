<template>
  <div class="registerByEmailCode-page">
    <div class="title-section">
      <!-- <div class="title"><span class="login-title">注册</span>账号</div> -->
    </div>

    <div class="main-container">
      <div class="login-card">
        <form  class="login-form" @submit.prevent="handleRegister">
          <div class="register-select">
            <span class="select-phone" @click="registerByPhone">手机号注册</span>
            <span class="select-email">邮箱注册</span>
          </div>
          <div class="input-group email-input-group" ref="emailWrapper">
            <div class="email-code-wrapper">
              <span class="iconfont icon-youxiang"></span>
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

          <div class="input-group code-input-group">
            <div class="input-icon-wrapper">
              <span class="iconfont icon-mima"></span>
              <span class="iconfont icon-vertical_line"></span>
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input"
                v-model="confirmPassword"
                placeholder="请输入确认密码"
              />
              <span class="iconfont icon-yanjing" :class="{ 'icon-active': showConfirmPassword }" @click="toggleConfirmPasswordVisibility"></span>
            </div>
          </div>

          <div class="input-group code-input-group">
            <div class="input-icon-wrapper">
              <span class="iconfont icon-a-jinghao2"></span>
              <span class="iconfont icon-vertical_line"></span>
              <input
                type="text"
                class="form-input"
                v-model="code"
                placeholder="请输入验证码"
              />
            </div>
            <button
                type="button"
                class="send-code-btn"
                @click.stop="sendVerificationCode"
                :disabled="isSendingCode"
              >
                {{ btnText }}
            </button>
          </div>

          <div class="hint-right">
            <span class="login-link-text" @click="login"> 返回登录</span>
          </div>

          <button class="register-btn">注册</button>

        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import countryList from '@/utils/countryCode';
import { getBackendApiURL } from '@/utils/index';
import emailListModule from '@/utils/email';
const emailList = Array.isArray(emailListModule)
  ? emailListModule
  : emailListModule.default;

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
  name: 'RegisterByEmailCode',
  data() {
    return {
      // ✅ 新增
    selectedEmailSuffix: '@qq.com',
    showEmailDropdown: false,
    emailDataList: emailList,

      email: '',
      password: '',
      confirmPassword: '',
      code: '',
      isSendingCode: false,
      countdown: 60,
      countryDataList: countryList, 
      timer: null, 
      testReportText: '',  
      resumeText: '',  
      positions: [],
      showPassword: false,
      showConfirmPassword: false,
    };
  },
  computed: {
    filteredEmailList() {
      const query = this.selectedEmailSuffix.replace('@', '').toLowerCase();
      return this.emailDataList.filter(item =>
        item.email_name.toLowerCase().includes(query) ||
        item.email_suffix.toLowerCase().includes(query)
      );
    },
    btnText() {
      return this.isSendingCode ? `${this.countdown}s后重发` : '发送验证码';
    },
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
    const wrapper = this.$refs.emailWrapper;
    if (wrapper && !wrapper.contains(e.target)) {
      this.showEmailDropdown = false;
    }
  },

    togglePasswordVisibility(){
      this.showPassword = !this.showPassword
    },        
    toggleConfirmPasswordVisibility(){
      this.showConfirmPassword = !this.showConfirmPassword
    },
    registerByPhone() {
      this.$router.push({
        path: '/register-by-phone-code',
        query: { 
          testReportText: this.testReportText,
          resumeText: this.resumeText,
          positions: this.positions,
        },
      });
    },
    // 点击其他地方隐藏国家列表
    handleClickOutside(event) {
      if (!this.$refs.countryListContainer.contains(event.target)) {
        this.showCountryList = false;
      }
    },
    loadAnalysisData(){
      this.testReportText = this.$route.query.testReportText;
      this.resumeText = this.$route.query.resumeText;
      this.positions = this.$route.query.positions;
    },
    // 补上模板中引用了但没定义的方法
    login() {
      console.log('点击了返回登录'); 
      this.$router.push({
        path: '/login-by-email-password',
        query: { 
          testReportText: this.testReportText,
          resumeText: this.resumeText,
          positions: this.positions,
        },
      });
      },    
    toDeal() { console.log('点击了用户协议'); },
    toHide() { console.log('点击了隐私政策'); },
    startTimer() {
      this.isSendingCode = true;
      this.countdown = 60;
      this.timer = setInterval(() => {
        if (this.countdown > 1) {
          this.countdown--;
        } else {
          this.stopTimer();
        }
      }, 1000);
    },

    stopTimer() {
      clearInterval(this.timer);
      this.timer = null;
      this.isSendingCode = false;
    },
    
    async sendVerificationCode() {
      if (!this.email){
        alert('请输入邮箱!');
        return;
      } 
      console.log("this.email", this.email);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email + this.selectedEmailSuffix)) {
        return alert('邮箱格式不正确，请输入正确的邮箱格式！');
      }
      try {
        const API_PATH = "/register/sendRegCodeByEmail";
        const emailData = {
          email: this.email + this.selectedEmailSuffix,
        }
        console.log("emailData", emailData);
        const response = await api.get(API_PATH, {
            params: emailData
        });
        const result = response.data;
        console.log("result", result);
        if (result.code === 200) {
          this.startTimer();
          alert("验证码发送成功!");
        } else {
          alert(result.msg);
        }
      } catch (err) {
        alert('网络请求失败，请稍后再试');
      }
    },
    async handleRegister() {
      console.log("handleRegister 方法被调用"); // 添加调试信息
      if (!this.email || !this.code) return alert('请填写完整信息');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email + this.selectedEmailSuffix)) {
        return alert('邮箱格式不正确，请输入正确的邮箱格式！');
      }
      try {
        const API_PATH = "/register/byEmailAndCode";
        const emailData = {
          email: this.email + this.selectedEmailSuffix,
          code: this.code,
          password: this.password,
          confirmPassword: this.confirmPassword,
        }
        console.log("emailData", emailData);
        const response = await api.post(API_PATH,emailData);
        console.log("response", response);

        const result = response.data;
        if (result.code === 200) {
          console.log("result", result);
          alert('注册成功');
        } else {
          console.log("result", result);
          alert(result.msg);
        }
      } catch (err) {
        console.error(err);
        alert('注册异常');
      }
    },
    // toDeal() { window.open(`${window.location.origin}/deal`); },
    // toHide() { window.open(`${window.location.origin}/hide`); }
  }
}
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(4rem); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.title-section {
  margin-top: 18rem;
  margin-bottom: 6rem;
  animation: fadeInUp 0.5s ease both;
}

.title {
  font-size: 8rem;
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
  height: 110rem;
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
  animation: fadeInUp 0.6s ease 0.1s both;
  transition: box-shadow 0.3s ease;
}

.login-card:hover {
  box-shadow: 0 2rem 5rem rgba(0, 0, 0, 0.1), 0 0 3rem rgba(83, 228, 199, 0.2);
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

.form-input {
  height: 100%;
  border: none;
  outline: none;
  padding: 0 1.5rem;
  font-size: 3rem;
}

/* 验证码按钮 */
.send-code-btn {
  position: absolute;
  height: 7rem;
  width: 16rem;
  background: linear-gradient(90deg, #53E4C7, #3ecfb5, #53E4C7);
  background-size: 200% auto;
  color: white;
  border: none;
  border-radius: 1rem;
  font-size: 2.5rem;
  right: 2rem;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
  animation: shimmer 3s linear infinite;
}

.send-code-btn:not(:disabled):hover {
  transform: translateY(-0.2rem);
  box-shadow: 0 0.5rem 1.5rem rgba(83, 228, 199, 0.5);
}

.send-code-btn:disabled {
  background: #ccc;
  animation: none;
  cursor: not-allowed;
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
}

.register-link-text {
  position: relative;
  margin-right: 40rem;
  color: #53E4C7;
  font-size: 3rem;
  text-decoration: none;
}

.agreement-text {
  text-align: center;
  font-size: 2.5rem;
  color: #999;
  margin-top: 12rem;
  margin-bottom: 3rem;
  line-height: 1.5;
}

.link-highlight {
  color: #53E4C7;
  cursor: pointer;
}

/* 提交按钮 */
.register-btn {
  width: 90%;
  height: 8rem;
  background: linear-gradient(90deg, #53E4C7, #3ecfb5, #53E4C7);
  background-size: 200% auto;
  color: white;
  border: none;
  border-radius: 1rem;
  font-size: 3rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 2rem;
  margin-left: 3.5rem;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
  animation: shimmer 3s linear infinite;
}

.register-btn:hover {
  transform: translateY(-0.3rem);
  box-shadow: 0 1rem 2.5rem rgba(83, 228, 199, 0.5);
}

.register-btn:active {
  transform: scale(0.97);
}

.register-select{
  /* margin-top: 5rem; */
  margin-bottom: 8rem;
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
  left: 9.5rem;
  color: #999999;
}

.icon-yanjing.icon-active {
  color: #53E4C7;
}


.email-code-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 1rem;
}

.selected-email-suffix {
  position: relative;
  text-align: right;
  border: none;
  outline: none;
  right: 32rem;
  font-size: 3.5rem;
  color: #53E4C7;
   background: transparent;
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
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  font-size: 3rem;
  cursor: pointer;
}

.email-item:hover {
  background: #f0fffb;
  color: #53E4C7;
}

.email-item.active {
  color: #53E4C7;
  font-weight: bold;
}

@keyframes floatBubble {
  0%   { transform: translateY(0) scale(1); opacity: 0.7; }
  50%  { opacity: 0.3; }
  100% { transform: translateY(-120vh) scale(0.3); opacity: 0; }
}
.particles { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.particle { position: absolute; bottom: -5rem; border-radius: 50%; background: radial-gradient(circle, rgba(0, 245, 212, 0.9), rgba(0, 245, 212, 0.1)); animation: floatBubble linear infinite; }
.p1  { width:2rem;   height:2rem;   left:5%;  animation-duration:7s;  animation-delay:0s;   }
.p2  { width:3rem;   height:3rem;   left:15%; animation-duration:9s;  animation-delay:1s;   }
.p3  { width:1.5rem; height:1.5rem; left:25%; animation-duration:6s;  animation-delay:2s;   }
.p4  { width:4rem;   height:4rem;   left:35%; animation-duration:11s; animation-delay:0.5s; }
.p5  { width:2rem;   height:2rem;   left:45%; animation-duration:8s;  animation-delay:3s;   }
.p6  { width:3.5rem; height:3.5rem; left:55%; animation-duration:10s; animation-delay:1.5s; }
.p7  { width:1.5rem; height:1.5rem; left:65%; animation-duration:7s;  animation-delay:4s;   }
.p8  { width:2.5rem; height:2.5rem; left:75%; animation-duration:9s;  animation-delay:2s;   }
.p9  { width:3rem;   height:3rem;   left:85%; animation-duration:6s;  animation-delay:0.8s; }
.p10 { width:2rem;   height:2rem;   left:92%; animation-duration:8s;  animation-delay:3.5s; }
.p11 { width:4.5rem; height:4.5rem; left:10%; animation-duration:12s; animation-delay:2.5s; }
.p12 { width:1.8rem; height:1.8rem; left:30%; animation-duration:7.5s;animation-delay:5s;   }
.p13 { width:2.5rem; height:2.5rem; left:50%; animation-duration:9.5s;animation-delay:1s;   }
.p14 { width:3rem;   height:3rem;   left:70%; animation-duration:8.5s;animation-delay:4.5s; }
.p15 { width:2rem;   height:2rem;   left:88%; animation-duration:7s;  animation-delay:6s;   }
</style>