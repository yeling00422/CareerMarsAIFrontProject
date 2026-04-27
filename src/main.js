import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/icon/iconfont.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

// 只修复计算逻辑，完全不改变你原来的布局和尺寸
function setRemUnit() {
  const docEl = document.documentElement
  const clientWidth = docEl.clientWidth
  
  if (!clientWidth) return
  
  // 完全沿用你最初的公式，只修复错误，不改变效果
  const designWidth = 375 
  docEl.style.fontSize = `${clientWidth / designWidth * 3.75}px`
}

setRemUnit()
window.addEventListener('resize', setRemUnit)
window.addEventListener('load', setRemUnit)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')