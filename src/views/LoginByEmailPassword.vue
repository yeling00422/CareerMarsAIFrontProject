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
        <form class="login-form" @submit.prevent="handleLogin">
          <div class="input-group email-input-group" ref="emailWrapper">
            <div class="email-code-wrapper">
              <span class="iconfont icon-youxiang" @click.stop="toggleEmailDropdown"></span>
              <span class="iconfont icon-vertical_line"></span>
              <input type="text" class="form-input" v-model="email" placeholder="请输入邮箱号" required />
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
            <span class="register-link-text" @click="register">注册账号</span>
            <span class="login-link-text">目前仅支持密码登录</span>
          </div>

          <div class="agreement-text">
            登录 即代表您阅读并同意
            <span class="link-highlight" @click="toDeal">[用户协议]</span>
            <span class="link-highlight" @click="toHide">[隐私政策]</span>
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
const emailList = Array.isArray(emailListModule) ? emailListModule : emailListModule.default;
import { getBackendApiURL } from '@/utils/index';

const api = axios.create({
  baseURL: getBackendApiURL(),
  headers: { 'Content-Type': 'application/json' },
});

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
    this.loadAnalysisData();
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
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
      if (!this.showEmailDropdown) return;
      const wrapper = this.$refs.emailWrapper;
      if (wrapper && !wrapper.contains(e.target)) {
        this.showEmailDropdown = false;
      }
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    loadAnalysisData() {
      this.testReportText = this.$route.query.testReportText;
      this.resumeText = this.$route.query.resumeText;
      this.positions = this.$route.query.positions;
    },

    register() {
      this.$router.push({
        path: '/register-by-email-code',
        query: {
          testReportText: this.testReportText,
          resumeText: this.resumeText,
          positions: this.positions,
        },
      });
    },

    loginByPhone() {
      this.$router.push({
        path: '/login-by-phone-password',
        query: {
          testReportText: this.testReportText,
          resumeText: this.resumeText,
          positions: this.positions,
        },
      });
    },

    toDeal() {},
    toHide() {},

    async handleLogin() {
      if (!this.email || !this.password) return alert('请填写完整信息');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email + this.selectedEmailSuffix)) {
        return alert('邮箱格式不正确，请输入正确的邮箱格式！');
      }
      try {
        const response = await api.post('/login/byEmailAndPassword', {
          email: this.email + this.selectedEmailSuffix,
          password: this.password,
        });
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
          alert(result.msg);
        }
      } catch (e) {
        alert('登录异常！请稍后重试！');
      }
    },
  }
};
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

.login-title { color: #53E4C7; }

.main-container {
  width: 80rem;
  height: 90rem;
  max-width: 120rem;
  margin: 0 auto;
  padding: 5rem 0;
  display: flex;
  justify-content: center;
}

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
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input-group:focus-within {
  border-color: #53E4C7;
  box-shadow: 0 0 1.5rem rgba(83, 228, 199, 0.3);
}

.email-input-group { position: relative; }

.email-code-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
}

.form-input {
  height: 100%;
  border: none;
  outline: none;
  padding: 0 1.5rem;
  font-size: 3rem;
  flex: 2;
}

.hint-right {
  text-align: right;
  margin-top: -1rem;
  margin-bottom: 3rem;
}

.login-link-text {
  color: #999999;
  font-size: 3rem;
  margin-left: -2rem;
}

.register-link-text {
  position: relative;
  margin-right: 27rem;
  color: #53E4C7;
  font-size: 3rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.register-link-text:hover { opacity: 0.75; }

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

.login-btn {
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

.login-btn:hover {
  transform: translateY(-0.3rem);
  box-shadow: 0 1rem 2.5rem rgba(83, 228, 199, 0.5);
}

.login-btn:active {
  transform: scale(0.97);
}

.login-select { margin-bottom: 5rem; }

.select-phone {
  display: inline-block;
  margin-left: 6rem;
  color: #999999;
  font-size: 5rem;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.2s;
}

.select-phone:hover { color: #53E4C7; }

.select-email {
  margin-left: 6rem;
  color: #53E4C7;
  font-size: 5rem;
  font-weight: bold;
  border-bottom: 0.5rem solid #53E4C7;
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
}

.iconfont { color: #999999; }

.icon-vertical_line { margin: 0 -1rem; }

.icon-yanjing {
  position: relative;
  font-size: 5rem;
  left: 10rem;
  color: #999999;
  cursor: pointer;
  transition: color 0.2s;
}

.icon-yanjing.icon-active { color: #53E4C7; }

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
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
  color: #000;
}

.email-item {
  padding: 2.5rem 2rem;
  display: flex;
  justify-content: space-between;
  font-size: 3rem;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.email-item:hover {
  background: #f0fffb;
  color: #53E4C7;
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
