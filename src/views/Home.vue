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
  border: 0.5rem solid #53E4C7;
  animation: glowPulse 2.5s ease-in-out infinite;
  transition: transform 0.15s ease, background 0.2s;
}

.free-analysis-btn:active {
  transform: scale(0.96);
  background: #3d3d3d;
}

</style>
