<template>
  <div class="noResume-page">
    <div class="title-div">请填写您的<span class="title-green-text">个人信息</span></div>

    <div class="middle-container">
      <div class="name-div">
        <span class="name-text" >姓名</span>
        <input type="text" class="input-name" placeholder="   请填写姓名" v-model="formData.name">
      </div>
      <div class="educational-div">
        <span class="educational-text">最高学历</span>
        <select class="input-educational" placeholder="请选择学历" v-model="formData.educationalQualifications">
          <option value="" disabled selected aria-placeholder="">请选择最高学历</option>
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
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  name: 'NoResume',
  data() {
    return {
      isAgree: false, // 复选框勾选状态，默认未勾选
      showTip: false,  // 错误提示是否显示，默认隐藏
      resumeText: '',
      // 表单数据
      formData: {
        name: '张三',
        educationalQualifications: '本科',
        skill: 'Python',
        educationalExperience: '2018-2022 华东理工大学 计算机科学与技术专业',
        jobExperience: '2022-至今 腾讯公司 软件工程师'
      }
    }
  },
  methods: {
    // --- 其他逻辑 ---
    validateForm() {
      if (!this.isAgree) {
        alert('请先勾选同意服务条款及隐私协议');
        return false;
      }

      // 1. 基础非空校验
      const requiredFields = [
        { field: 'name', label: '姓名' },
        { field: 'educationalQualifications', label: '最高学历' },
        { field: 'skill', label: '专业技能' },
        { field: 'educationalExperience', label: '教育经历' },
        { field: 'jobExperience', label: '工作经历' }
      ];

      for (let item of requiredFields) {
        const value = this.formData[item.field];
        // 增加对 null 或 undefined 的判断
        if (value === null || value === undefined || String(value).trim() === '') {
          alert(`请填写${item.label}`);
          return false;
        }
      }

      const eduStatus = String(this.formData.educationalQualifications || '').trim();

      // 2. 定义合法的选项列表 (对应你 template 里的 option value)
      const validOptions = ['其他', '专科', '本科', '硕士', '博士'];

      // 3. 增强判断：
      // 如果为空、或者包含"未知"、或者不在合法列表中，则拦截
      if (!eduStatus || eduStatus.includes('未知') || !validOptions.includes(eduStatus)) {
        alert('请手动选择您的正确最高学历！');
        // 此时可以重置一下数据，让 select 框恢复默认
        this.formData.educationalQualifications = ''; 
        return false;
      }
      return true;
    },
    buildResumeText() {
      const f = this.formData;
      return `
    【姓名】${f.name}
    【最高学历】${f.educationalQualifications}
    【专业技能】${f.skill}
    【教育经历】${f.educationalExperience}
    【工作经历】${f.jobExperience}`.trim();
    },
    async handleNext() {
      if (!this.validateForm()) return;
      this.resumeText = this.buildResumeText();
      console.log("生成的简历文本：", this.resumeText);
      alert('正在分析解析的简历文本是否合法，请稍候。。。');
      const responseData = await api.post("/ai/judgment/resume", this.resumeText, {
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8'
        }
      });   
      const result = responseData.data;
      console.log("result:", result);
      if(result.code !== 200) {
        alert(result.msg || '简历信息有误！请重新输入选择正确的简历文件');
        return;
      }

      this.$router.push({
        path: '/analysis-resume',
        query: { resumeText: this.resumeText },
      });
    },
    handleReturn() {
      this.$router.push({
        path: '/upload-resume',
        query: { resumeText: this.resumeText },
      });
    },
  },
}

</script>

<style scoped>

.title-div{
  position: relative;
  top: 12rem;
  font-size: 6rem;
  color: #000;
  display: flex;
  justify-content: center;
  align-items: center;   
}

.title-green-text{
  color: #00F5D4;
}


.upload-container{
  position: relative;
  top: 10rem;
  left: 10rem;
  width: 80rem;
  height: 8rem;
  display: flex;
  justify-content: space-between;

}

.upload-img,
.upload-file,
.generate-template{
  width: 25rem;
  height: 8rem;
  border-radius: 2rem;
  background-color: #595959;
  display: flex;
  justify-content: center;
  align-self: center;
}

.icon-shangchuantupian,
.icon-shangchuanwenjian,
.icon-zidongshengcheng{
  font-size: 5rem;
  margin-right: 1rem;
  color: #fff;
  margin-top: 1rem;
}

.upload-text{
  font-size: 3rem;
  color: #00F5D4;
  margin-top: 1.5rem;
}

.middle-container{
  position: relative;
  top:18rem;
  left: 10rem;
  width: 80rem;
  height: auto;
  min-height: 100rem;
  background-color: #767676;
  border-radius: 5rem;
  padding: 8rem 2rem; 
  box-sizing: border-box; 
}

.name-text{
  position: relative;
  left: 5rem;
  font-size: 4rem;
  color: #AAAAAA;
}

.input-name{
  position: relative;
  left: 11rem;
  width: 55rem;
  height: 7rem;
  border-radius: 2rem;
  border: none;
}

.educational-div{
  margin-top: 5rem;
}

.input-educational{
  position: relative;
  left: 3rem;
  width: 56rem ;
  height: 8rem;
  border-radius: 2rem;
  border: none;
  padding-left: 2rem;
}

.educational-text{
  font-size: 4rem;
  color: #AAAAAA;
}

.skill-div{
  margin-top: 5rem;
}

.input-skill{
  position: relative;
  left: 3rem;
  width: 55rem;
  height: 7rem;
  border-radius: 2rem;
  border: none;
}

.skill-text{
  font-size: 4rem;
  color: #AAAAAA;
}

.educational-experience-div{
  position: relative;
  margin-top: 5rem;
}

.input-educational-experience{
  position: relative;
  left: 19rem;
  width: 55rem;
  height: auto;
  min-height: 20rem;
  border-radius: 2rem;
  border: none;
}

.educational-experience-text{
  position: absolute;
  top: 0rem;
  font-size: 4rem;
  color: #AAAAAA;
}

.job-experience-div{
  position: relative;
  margin-top: 5rem;
}

.input-job-experience{
  position: relative;
  left: 19rem;
  width: 55rem;
  height: auto;
  min-height: 20rem;  
  border-radius: 2rem;
  border: none;
}

.job-experience-text{
  position: absolute;
  top: 0rem;
  font-size: 4rem;
  color: #AAAAAA;
}

.hint-div{
  position: relative;
  left: 10rem;
  display: flex;
  top: 12rem;
  width: 78rem;
  margin-top: 10rem;
}

.hint-text{
  position: relative;
  left: 1rem;
  top: -4rem;
  font-size: 3.5rem;
  color: #000;
}

.service-text{
  color: #00F5D4;
  text-decoration: underline;
}

.privacy-text{
  color: #00F5D4;
  text-decoration: underline;
}

.btn-div{
  position: relative;
  top: 10rem;
  margin-left: 20rem;
}

/* 按钮：用 rem 调整尺寸和边距 */
.free-analysis-btn {
  background: #01F5D4;
  color: #595959;
  width: 60rem; 
  height: 8rem; 
  border: none;
  border-radius: 3rem; 
  font-size: 4rem; 

  display: flex;
  justify-content: center;  
  align-items: center;    
  /* margin-top: 4rem; */
  margin-bottom: 5rem;
}

.free-analysis-btn {
  background: #01F5D4;
  color: #595959;
  width: 60rem; 
  height: 8rem; 
  border: none;
  border-radius: 3rem; 
  font-size: 4rem; 

  display: flex;
  justify-content: center;  
  align-items: center;    
  /* margin-top: 4rem; */
  margin-bottom: 5rem;
}
.icon-sanjiaoxing {
  margin-left: 2rem;
  font-size: 4rem;
  color: yellow;
}

.custom-checkbox {
  width: 4rem !important;
  height: 4rem !important;
  min-width:4rem;
  min-height:4rem;

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

</style>