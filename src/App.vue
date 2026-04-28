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

</style>