<template>
  <div class="app">
    <div class="particles">
      <span v-for="i in 15" :key="i" class="particle" :class="'p' + i"></span>
    </div>
    <router-view/>
    <img src="./assets/img/上面固定栏.png" class="logo" />
  </div>
</template>

<script>
import axios from 'axios';
import { MessageBox } from 'element-ui';
export default {
  name: 'App',
  data() {
    return {
      pendingRequests: new Map(),   // ✅ 请求防重
      hasShownError: false,         // ✅ 弹窗防重
    };
  },

  created() {
    this.setupAxiosInterceptor();
    this.resetErrorStateOnRouteChange();
  },

  methods: {
    /** ✅ Axios 拦截器：防止刷新后出现两次弹窗 */
    setupAxiosInterceptor() {
      // 请求拦截
      axios.interceptors.request.use(config => {
        const key = `${config.url}_${JSON.stringify(config.params)}`;
        if (this.pendingRequests.has(key)) {
          return Promise.reject({ __CANCEL__: true });
        }
        this.pendingRequests.set(key, true);
        return config;
      });

      // 响应拦截
      axios.interceptors.response.use(
        response => {
          const key = `${response.config.url}_${JSON.stringify(response.config.params)}`;
          this.pendingRequests.delete(key);
          this.hasShownError = false; // ✅ 成功后重置
          return response;
        },
        error => {
          if (error.__CANCEL__) return Promise.reject(error);

          // ✅ 只弹一次 MessageBox
          if (!this.hasShownError) {
            this.hasShownError = true;
            MessageBox.confirm(
              '请求异常，是否重新加载？',
              '提示',
              {
                confirmButtonText: '重新加载',
                cancelButtonText: '返回首页',
                type: 'warning'
              }
            ).then(action => {
              if (action === 'confirm') {
                window.location.reload();
              }
            }).catch(() => {
              this.$router.push('/');
            });
          }
          return Promise.reject(error);
        }
      );
    },

    /** ✅ 路由变化时重置弹窗状态 */
    resetErrorStateOnRouteChange() {
      this.$router.afterEach(() => {
        this.hasShownError = false;
        this.pendingRequests.clear();
      });
    }
  }
};
</script>

<style>

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh; 
  background-image: url('./assets/img/第一页白背景.png');
  background-size: cover;
}

.logo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
}

.center-dialog {
  position: fixed;
  top: 40%;
  left: 5%;
  width: 90vw  !important;
}

@keyframes slideInDown {
  from { opacity: 0; transform: translateY(-4rem); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(4rem); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes cardGlow {
  0%, 100% { box-shadow: 0 0 1rem rgba(0, 245, 212, 0.2); }
  50%       { box-shadow: 0 0 3rem rgba(0, 245, 212, 0.6), 0 0 6rem rgba(0, 245, 212, 0.2); }
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