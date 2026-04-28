<template>
  <div class="noResume-page">
    <div class="title-div">请填写您的<span class="title-green-text">个人信息</span></div>

    <div class="middle-container">
      <div class="name-div">
        <span class="name-text">姓名</span>
        <input type="text" class="input-name" placeholder="   请填写姓名" v-model="formData.name">
      </div>
      <div class="educational-div">
        <span class="educational-text">最高学历</span>
        <select class="input-educational" v-model="formData.educationalQualifications">
          <option value="" disabled selected>请选择最高学历</option>
          <option value="其他">其他</option>
          <option value="专科">专科</option>
          <option value="本科">本科</option>
          <option value="硕士">硕士</option>
          <option value="博士">博士</option>
        </select>
      </div>
      <div class="skill-div">
        <span class="skill-text">专业技能</span>
        <input type="text" class="input-skill" placeholder="   请填写专业技能" v-model="formData.skill">
      </div>
      <div class="educational-experience-div">
        <span class="educational-experience-text">教育经历</span>
        <textarea class="input-educational-experience" placeholder="  请填写教育经历" v-model="formData.educationalExperience"></textarea>
      </div>
      <div class="job-experience-div">
        <span class="job-experience-text">工作经历</span>
        <textarea class="input-job-experience" placeholder="  请填写工作经历" v-model="formData.jobExperience"></textarea>
      </div>
    </div>

    <div class="hint-div">
      <input type="checkbox" class="custom-checkbox" id="agree-check" v-model="isAgree">
      <p class="hint-text">我已阅读并同意<span class="service-text">服务条款</span>和<span class="privacy-text">隐私设置</span>。我理解我填写的简历数据将被用于AI分析和职业匹配。</p>
    </div>

    <div class="btn-div">
      <button class="free-analysis-btn" @click="handleReturn">返回上一步：上传简历<span class="iconfont icon-sanjiaoxing"></span></button>
      <button class="free-analysis-btn" @click="handleNext">下一步：解析个人信息<span class="iconfont icon-sanjiaoxing"></span></button>
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
  name: 'NoResume',
  data() {
    return {
      isAgree: false,
      resumeText: '',
      formData: {
        name: '张三',
        educationalQualifications: '本科',
        skill: 'Python',
        educationalExperience: '2018-2022 华东理工大学 计算机科学与技术专业',
        jobExperience: '2022-至今 腾讯公司 软件工程师'
      }
    };
  },
  methods: {
    validateForm() {
      if (!this.isAgree) {
        alert('请先勾选同意服务条款及隐私协议');
        return false;
      }
      const requiredFields = [
        { field: 'name', label: '姓名' },
        { field: 'educationalQualifications', label: '最高学历' },
        { field: 'skill', label: '专业技能' },
        { field: 'educationalExperience', label: '教育经历' },
        { field: 'jobExperience', label: '工作经历' }
      ];
      for (const item of requiredFields) {
        const value = this.formData[item.field];
        if (value === null || value === undefined || String(value).trim() === '') {
          alert(`请填写${item.label}`);
          return false;
        }
      }
      const validOptions = ['其他', '专科', '本科', '硕士', '博士'];
      const eduStatus = String(this.formData.educationalQualifications || '').trim();
      if (!eduStatus || !validOptions.includes(eduStatus)) {
        alert('请手动选择您的正确最高学历！');
        this.formData.educationalQualifications = '';
        return false;
      }
      return true;
    },

    buildResumeText() {
      const f = this.formData;
      return `【姓名】${f.name}\n【最高学历】${f.educationalQualifications}\n【专业技能】${f.skill}\n【教育经历】${f.educationalExperience}\n【工作经历】${f.jobExperience}`;
    },

    async handleNext() {
      if (!this.validateForm()) return;
      this.resumeText = this.buildResumeText();
      alert('正在分析解析的简历文本是否合法，请稍候。。。');
      const responseData = await api.post('/ai/judgment/resume', this.resumeText, {
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
      });
      const result = responseData.data;
      if (result.code !== 200) {
        alert(result.msg || '简历信息有误！请重新输入选择正确的简历文件');
        return;
      }
      this.$router.push({ path: '/analysis-resume', query: { resumeText: this.resumeText } });
    },

    handleReturn() {
      this.$router.push({ path: '/upload-resume', query: { resumeText: this.resumeText } });
    },
  },
};
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(3rem); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.title-div {
  position: relative;
  top: 12rem;
  font-size: 6rem;
  color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeInUp 0.5s ease both;
}

.title-green-text { color: #00F5D4; }

.middle-container {
  position: relative;
  top: 18rem;
  left: 10rem;
  width: 80rem;
  height: auto;
  min-height: 100rem;
  background-color: #767676;
  border-radius: 5rem;
  padding: 8rem 2rem;
  box-sizing: border-box;
  animation: fadeInUp 0.6s ease 0.1s both;
}

.name-text { position: relative; left: 5rem; font-size: 4rem; color: #AAAAAA; }

.input-name {
  position: relative;
  left: 11rem;
  width: 55rem;
  height: 7rem;
  border-radius: 2rem;
  border: none;
  transition: box-shadow 0.2s ease;
}

.input-name:focus,
.input-skill:focus { outline: none; box-shadow: 0 0 1rem rgba(0, 245, 212, 0.5); }

.educational-div { margin-top: 5rem; }

.educational-text { font-size: 4rem; color: #AAAAAA; }

.input-educational {
  position: relative;
  left: 3rem;
  width: 56rem;
  height: 8rem;
  border-radius: 2rem;
  border: none;
  padding-left: 2rem;
  transition: box-shadow 0.2s ease;
}

.input-educational:focus { outline: none; box-shadow: 0 0 1rem rgba(0, 245, 212, 0.5); }

.skill-div { margin-top: 5rem; }

.skill-text { font-size: 4rem; color: #AAAAAA; }

.input-skill {
  position: relative;
  left: 3rem;
  width: 55rem;
  height: 7rem;
  border-radius: 2rem;
  border: none;
}

.educational-experience-div { position: relative; margin-top: 5rem; }

.educational-experience-text { position: absolute; top: 0rem; font-size: 4rem; color: #AAAAAA; }

.input-educational-experience {
  position: relative;
  left: 19rem;
  width: 55rem;
  height: auto;
  min-height: 20rem;
  border-radius: 2rem;
  border: none;
  transition: box-shadow 0.2s ease;
}

.input-educational-experience:focus,
.input-job-experience:focus { outline: none; box-shadow: 0 0 1rem rgba(0, 245, 212, 0.5); }

.job-experience-div { position: relative; margin-top: 5rem; }

.job-experience-text { position: absolute; top: 0rem; font-size: 4rem; color: #AAAAAA; }

.input-job-experience {
  position: relative;
  left: 19rem;
  width: 55rem;
  height: auto;
  min-height: 20rem;
  border-radius: 2rem;
  border: none;
}

.hint-div {
  position: relative;
  left: 10rem;
  display: flex;
  top: 12rem;
  width: 78rem;
  margin-top: 10rem;
  animation: fadeInUp 0.6s ease 0.2s both;
}

.hint-text { position: relative; left: 1rem; top: -4rem; font-size: 3.5rem; color: #000; }

.service-text,
.privacy-text { color: #00F5D4; text-decoration: underline; }

.btn-div {
  position: relative;
  top: 10rem;
  margin-left: 20rem;
  animation: fadeInUp 0.6s ease 0.25s both;
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
  box-shadow: 0 0 2.5rem rgba(1, 245, 212, 0.5);
}

.free-analysis-btn:active { transform: scale(0.97); }

.icon-sanjiaoxing { margin-left: 2rem; font-size: 4rem; color: yellow; }

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
