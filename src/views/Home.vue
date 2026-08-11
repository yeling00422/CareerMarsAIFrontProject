<template>
  <div class="home-page">
    <div class="mask-layer"></div>
    <!-- 科技粒子底层画布 -->
    <canvas ref="techCanvas" class="tech-bg"></canvas>

    <!-- 原有页面内容完全保留 -->
    <img src="../assets/img/灰色部分.png" class="background-img"/>
    <div class="button-section">
      <button class="free-analysis-btn" @click="goNext">免费分析<span class="iconfont icon-sanjiaoxing"></span></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
data() {
  return {
    canvasCtx: null,
    particleList: [],
    animationFrame: null,
    resetTimer: null, // 新增定时器标识

    // 可控扩散版：粒子可以移动，但不会大面积铺满
    particleCount: 100,
    lineDistance: 75,
    particleRadius: 2,
    particleSpeed: 0.2
  };
},
  mounted() {
    this.initTechCanvas();
    window.addEventListener('resize', this.resizeCanvas);
    // 每10秒重新生成粒子
    this.resetTimer = setInterval(() => {
      this.createParticles();
    }, 10000);
  },
  beforeDestroy() {
    // 销毁动画、监听，释放资源
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.resizeCanvas);
    // 销毁定时器
    clearInterval(this.resetTimer);
  },
  methods: {
    // 粒子背景初始化
    initTechCanvas() {
      const canvas = this.$refs.techCanvas;
      this.canvasCtx = canvas.getContext('2d');
      this.resizeCanvas();
      this.createParticles();
      this.renderAnimation();
    },
    resizeCanvas() {
      const canvas = this.$refs.techCanvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    },
    createParticles() {
      this.particleList = [];
      for (let i = 0; i < this.particleCount; i++) {
        this.particleList.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          speedX: (Math.random() - 0.5) * this.particleSpeed,
          speedY: (Math.random() - 0.5) * this.particleSpeed,
          radius: this.particleRadius
        });
      }
    },
   renderAnimation() {
      const ctx = this.canvasCtx;
      // 移除黑色填充，用透明清空画布，无任何底色遮挡
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 粒子移动 & 边界反弹
      this.particleList.forEach(p => {
        if (p.x < 0 || p.x > window.innerWidth) p.speedX *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.speedY *= -1;
        p.x += p.speedX;
        p.y += p.speedY;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#54a8ff';
        ctx.fill();
      });

      // 粒子连线
      for (let i = 0; i < this.particleList.length; i++) {
        const p1 = this.particleList[i];
        for (let j = i + 1; j < this.particleList.length; j++) {
          const p2 = this.particleList[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < this.lineDistance) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = 1 - dist / this.lineDistance;
            ctx.strokeStyle = `rgba(84, 168, 255, ${opacity * 0.4})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      this.animationFrame = requestAnimationFrame(this.renderAnimation);
    },


    // 原有跳转方法不变
    goNext() {
      this.$router.push('/upload-resume');
      // wx.openCustomerServiceChat({
      //   extInfo: {url: 'https://work.weixin.qq.com/kfid/kfcab814d9b6a83a653'},
      //   corpId: 'wwda70445f2269ae97',
      //   success(res) {
      //     console.log("咨询客服：",res);
      //   }
      // })
    }
  }
}
</script>

<style scoped>
.home-page {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

/* 科技背景画布：固定全屏垫底，不拦截鼠标点击 */
.tech-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2; /* 比遮罩大，悬浮在遮罩上方 */
  pointer-events: none;
}

.background-img {
  position: relative;
  width: 100%;
}

.button-section {
  position: relative; 
  top: -30rem; 
  display: flex;
  justify-content: center;
  align-items: center; 
}

.icon-sanjiaoxing{
  color: yellow;
  margin-left: 2rem;
}

.free-analysis-btn {
  background: #595959;
  width: 50rem;
  height: 10rem;
  border-radius: 5rem;
  font-size: 5rem;
  color: white;
  border: 0.5rem solid #53E4C7;
  animation: glowPulse 2.5s ease-in-out infinite;
  transition: transform 0.15s ease, background 0.2s;
  z-index: 3; /* 比按钮大，悬浮在按钮上方 */
}

.free-analysis-btn:active {
  transform: scale(0.96);
  background: #3d3d3d;
}

/* 按钮发光脉冲动画 */
@keyframes glowPulse {
  0% {
    box-shadow: 0 0 6px #53E4C7;
  }
  50% {
    box-shadow: 0 0 20px #53E4C7, 0 0 35px rgba(83, 228, 199, 0.4);
  }
  100% {
    box-shadow: 0 0 6px #53E4C7;
  }
}

.mask-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

</style>