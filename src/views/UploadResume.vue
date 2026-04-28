<template>
  <div class="uploadResume-page">
    <div class="particles">
      <span v-for="i in 15" :key="i" class="particle" :class="'p' + i"></span>
    </div>
    <div class="title-div">请上传您的<span class="title-green-text">简历</span></div>

    <input type="file" ref="imageInput" accept="image/*" style="display: none" @change="handleImageChange">
    <input type="file" ref="pdfInput" accept=".pdf" style="display: none" @change="handlePdfChange">
    <input type="file" ref="docxInput" accept=".docx" style="display: none" @change="handleDocxChange">

    <div class="upload-container">
      <div class="upload-img" @click="triggerImageUpload">
        <span class="iconfont icon-shangchuantupian"></span>
        <span class="upload-text">上传简历图片</span>
      </div>
      <div class="upload-file" @click="triggerPdfUpload">
        <span class="iconfont icon-shangchuanwenjian"></span>
        <span class="upload-text">上传pdf文件</span>
      </div>
      <div class="generate-template" @click="triggerDocxUpload">
        <span class="iconfont icon-zidongshengcheng"></span>
        <span class="upload-text">上传docx文件</span>
      </div>
    </div>

    <div class="resume-content">
      <span class="identification-text">识别出的简历文本:</span>
      <textarea class="resume-text" v-model="resumeText" readonly></textarea>
    </div>

    <div class="hint-div">
      <input type="checkbox" class="custom-checkbox" id="agree-check" v-model="isAgree">
      <p class="hint-text">我已阅读并同意<span class="service-text">服务条款</span>和<span class="privacy-text">隐私设置</span>。我理解我的简历数据将被用于AI分析和职业匹配。</p>
    </div>

    <div class="btn-div">
      <button class="free-analysis-btn" @click="handleNoResume">没有简历<span class="iconfont icon-sanjiaoxing"></span></button>
      <button class="free-analysis-btn" @click="handleNext">下一步：解析简历文件<span class="iconfont icon-sanjiaoxing"></span></button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getAiURL } from '@/utils/index';

const api = axios.create({
  baseURL: getAiURL(),
  headers: { 'Content-Type': 'application/json' },
});

export default {
  name: 'UploadResume',
  data() {
    return {
      isAgree: false,
      resumeText: null,
    };
  },
  methods: {
    triggerImageUpload() { this.$refs.imageInput.click(); },
    triggerPdfUpload()   { this.$refs.pdfInput.click(); },
    triggerDocxUpload()  { this.$refs.docxInput.click(); },

    async handleImageChange(event) {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) { alert('只能上传图片文件!'); }
      if (file.size > 5 * 1024 * 1024)    { alert('图片大小不能超过 5MB'); }
      if (file) await this.uploadFile(file, '/ai/parse/image');
      event.target.value = '';
    },

    async handlePdfChange(event) {
      const file = event.target.files[0];
      if (!file.type.endsWith('application/pdf')) { alert('只能上传PDF文件!'); }
      if (file) await this.uploadFile(file, '/ai/parse/pdf');
      event.target.value = '';
    },

    async handleDocxChange(event) {
      const file = event.target.files[0];
      if (!file.type.endsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        alert('只能上传DOCX文件!');
      }
      if (file) await this.uploadFile(file, '/ai/parse/docx');
      event.target.value = '';
    },

    async uploadFile(file, url) {
      this.resumeText = '';
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await api.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const result = response.data;
        if (result.code === 200 || result.code === 0) {
          this.resumeText = result.data;
          alert('解析成功，已自动填充简历信息');
        } else {
          this.resumeText = '';
          alert(result.msg || '解析失败');
        }
      } catch (error) {
        this.resumeText = '';
        alert('网络错误，请检查后端服务是否开启');
      }
    },

    validateForm() {
      if (!this.isAgree) {
        alert('请先勾选同意服务条款及隐私协议');
        return false;
      }
      if (!this.resumeText || this.resumeText.trim() === '') {
        alert('请先上传简历文件');
        return false;
      }
      return true;
    },

    async handleNext() {
      if (!this.validateForm()) return;
      alert('正在分析解析的简历文本是否合法，请稍候。。。');
      const requestData = await api.post('/ai/judgment/resume', this.resumeText, {
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
      });
      const result = requestData.data;
      if (result.code !== 200) {
        alert(result.msg || '简历信息有误！请重新输入选择正确的简历文件');
        return;
      }
      this.$router.push({ path: '/analysis-resume', query: { resumeText: this.resumeText } });
    },

    handleNoResume() {
      this.$router.push('/no-resume');
    }
  }
};
</script>

<style scoped>
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

.title-div {
  position: relative;
  top: 15rem;
  margin-left: 30rem;
  font-size: 6rem;
  color: #000;
  margin-bottom: 10rem;
  animation: slideInDown 0.6s ease both;
}

.title-green-text { color: #00F5D4; }

.upload-container {
  position: relative;
  top: 10rem;
  left: 10rem;
  width: 80rem;
  height: 8rem;
  display: flex;
  justify-content: space-between;
  animation: fadeInUp 0.7s ease 0.2s both;
}

.upload-img,
.upload-file,
.generate-template {
  width: 25rem;
  height: 8rem;
  border-radius: 2rem;
  background-color: #595959;
  display: flex;
  justify-content: center;
  align-self: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  animation: cardGlow 3s ease-in-out infinite;
}

.upload-img:hover,
.upload-file:hover,
.generate-template:hover {
  transform: translateY(-0.5rem) scale(1.04);
  background-color: #6a6a6a;
  box-shadow: 0 0 4rem rgba(0, 245, 212, 0.7), 0 0.8rem 2rem rgba(0, 0, 0, 0.3);
}

.upload-img:active,
.upload-file:active,
.generate-template:active {
  transform: scale(0.97);
}

.icon-shangchuantupian,
.icon-shangchuanwenjian,
.icon-zidongshengcheng {
  font-size: 5rem;
  margin-right: 1rem;
  color: #fff;
  margin-top: 1rem;
}

.upload-text {
  font-size: 3rem;
  color: #00F5D4;
  margin-top: 1.5rem;
}

.hint-div {
  position: relative;
  left: 10rem;
  display: flex;
  top: 20rem;
  width: 78rem;
  margin-top: 10rem;
  animation: fadeInUp 0.7s ease 0.5s both;
}

.hint-text {
  position: relative;
  left: 1rem;
  top: -4rem;
  font-size: 3.5rem;
  color: #000;
}

.service-text,
.privacy-text {
  color: #00F5D4;
  text-decoration: underline;
}

.btn-div {
  position: relative;
  top: 18rem;
  margin-left: 20rem;
  animation: fadeInUp 0.7s ease 0.6s both;
}

.free-analysis-btn {
  background: linear-gradient(90deg, #01F5D4, #00c9aa, #01F5D4);
  background-size: 200% auto;
  color: #595959;
  width: 60rem;
  height: 8rem;
  border: none;
  border-radius: 3rem;
  font-size: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5rem;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
  animation: shimmer 3s linear infinite;
}

.free-analysis-btn:hover {
  transform: translateY(-0.3rem);
  box-shadow: 0 0 3rem rgba(0, 245, 212, 0.6), 0 0.6rem 1.5rem rgba(0, 0, 0, 0.2);
}

.free-analysis-btn:active {
  transform: scale(0.96);
}

.icon-sanjiaoxing {
  margin-left: 2rem;
  font-size: 4rem;
  color: yellow;
}

.custom-checkbox {
  width: 4rem !important;
  height: 4rem !important;
  min-width: 4rem;
  min-height: 4rem;
  appearance: none;
  border: 0.3rem solid #000;
  border-radius: 0.8rem;
}

.custom-checkbox:checked::after {
  content: "";
  position: absolute;
  top: 1rem;
  left: 2.5rem;
  width: 1.2rem;
  height: 2.5rem;
  border-right: 0.4rem solid #01F5D4;
  border-bottom: 0.4rem solid #01F5D4;
  transform: rotate(45deg);
}

.resume-content {
  position: relative;
  left: 10rem;
  top: 20rem;
  height: 30rem;
  width: 80rem;
  margin-bottom: 20rem;
  animation: fadeInUp 0.7s ease 0.4s both;
}

.identification-text {
  position: relative;
  top: 0rem;
  left: 0rem;
  font-size: 4rem;
  color: #000;
}

.resume-text {
  height: 30rem;
  width: 80rem;
  background-color: #fff;
  border: 0.5rem solid #000;
  padding: 2rem;
  font-size: 3rem;
  color: #000;
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
