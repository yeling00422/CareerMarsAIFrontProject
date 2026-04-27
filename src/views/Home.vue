<template>
  <div class="home-page">
    <img src="../assets/img/灰色部分.png" class="background-img"/>
    <div class="button-section">
      <button class="free-analysis-btn" @click="goNext">免费分析<span class="iconfont icon-sanjiaoxing"></span></button>
    </div>
  </div>
</template>

<script scoped>

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
}

</style>