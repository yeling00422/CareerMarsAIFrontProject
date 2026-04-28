<template>
  <div class="home-page">
    <img src="../assets/img/灰色部分.png" class="background-img"/>
    <div class="button-section">
      <button class="free-analysis-btn" @click="goNext">
        免费分析<span class="iconfont icon-sanjiaoxing"></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    goNext() {
      this.$router.push('/upload-resume');
    }
  }
}
</script>

<style scoped>
@keyframes floatBubble {
  0%   { transform: translateY(0) scale(1); opacity: 0.7; }
  50%  { opacity: 0.3; }
  100% { transform: translateY(-120vh) scale(0.3); opacity: 0; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8rem); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 6rem rgba(0, 245, 212, 0.4); }
  50%       { box-shadow: 0 0 20rem rgba(0, 245, 212, 0.9), 0 0 40rem rgba(0, 245, 212, 0.3); }
}

.home-page {
  position: relative;
  overflow: hidden;
}

.particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  bottom: -5rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 245, 212, 0.9), rgba(0, 245, 212, 0.1));
  animation: floatBubble linear infinite;
}

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

.background-img {
  position: relative;
  width: 100%;
  z-index: 1;
}

.button-section {
  position: relative;
  top: -30rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  animation: fadeInUp 0.8s ease 0.3s both;
}

.icon-sanjiaoxing {
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
  border: none;
  cursor: pointer;
  animation: glowPulse 2.5s ease-in-out infinite;
  transition: transform 0.15s ease, background 0.2s;
}

.free-analysis-btn:active {
  transform: scale(0.96);
  background: #3d3d3d;
}
</style>
