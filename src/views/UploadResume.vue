<template>
  <div class="uploadResume-page">
    <div class="title-div">请      
      <span class="upload-resume"  @click="triggerUpload"><span class="iconfont icon-shangchuanwenjian"></span>上传简历</span>
      或填写您的<span class="title-green-text">个人信息</span></div>
    <input type="file" ref="imageInput" accept="image/*,.pdf,.docx,.doc" style="display: none" @change="handleChange">
    
    <div class="middle-container">
      <div class="name-div">
        <span class="name-text" >姓名</span>
        <input type="text" class="input-name" placeholder="   请填写姓名" v-model="formData.name">
      </div>

      <div class="date-div">
        <span class="date-text" >出生日期</span>
        <input type="date" class="input-date" placeholder="   请选择出生日期" v-model="formData.date">
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
      <div class="school-div">
        <span class="school-text" >毕业院校</span>
        <input type="text" class="input-school" placeholder="   请输入毕业院校" v-model="formData.school">
      </div>
      <div class="educational-time-div">
        <span class="educational-time-text" >毕业时间</span>
        <input type="month" class="input-educational-time" placeholder="   请选择毕业时间" v-model="formData.educationalTime">
      </div>


      <div class="skill-div">
        <span class="skill-text">专业技能</span>
        <!-- <input type="text" class="input-skill" placeholder="   请填写专业技能" v-model="formData.skill"> -->
        <textarea class="input-skill" placeholder="  请填写专业技能" v-model="formData.skill"></textarea>
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
      <p class="hint-text">我已阅读并同意<span class="service-text">服务条款</span>和<span class="privacy-text">隐私设置</span>。我理解我的简历数据将被用于AI分析和职业匹配。</p>      
    </div>


    <div class="btn-div">
      <button class="free-analysis-btn" @click="handleNext">下一步<span class="iconfont icon-sanjiaoxing"></span></button>
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
  name: 'UploadResume',
  data() {
    return {
      isAgree: false, 
      showTip: false,  // 错误提示是否显示，默认隐藏
      constellation: '', // 新增：当前星座
      formData: {
        name: '',
        date: '', 
        educationalQualifications: '',
        school: '', 
        educationalTime: '', 
        skill: '',
        educationalExperience: '',
        jobExperience: ''
      }
    }
  },
  watch: {
    'formData.date'(val) {
      if (!val) {
        this.constellation = '';
        return;
      }
      // val格式 yyyy-MM-dd
      const [year, month, day] = val.split('-').map(Number);
      this.constellation = this.getConstellation(month, day);
    }
  },
  methods: {
    // 根据年月日获取星座
    getConstellation(month, day) {
      if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '水瓶座';
      if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return '双鱼座';
      if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '白羊座';
      if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '金牛座';
      if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return '双子座';
      if ((month === 6 && day >= 21) || (month === 7 && day <= 20)) return '巨蟹座';
      if ((month === 7 && day >= 21) || (month === 8 && day <= 20)) return '狮子座';
      if ((month === 8 && day >= 21) || (month === 9 && day <= 20)) return '处女座';
      if ((month === 9 && day >= 21) || (month === 10 && day <= 20)) return '天秤座';
      if ((month === 10 && day >= 21) || (month === 11 && day <= 21)) return '天蝎座';
      if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return '射手座';
      return '摩羯座'; // 12.22-1.19
    },


    // --- 1. 触发选择框 ---
    triggerUpload() { this.$refs.imageInput.click(); },

    async handleChange(event) {
      const file = event.target.files[0];
      if (file) await this.uploadFile(file, "ai/parse/resume/file");
      event.target.value = ''; 
    },
    async uploadFile(file, url) {
      alert('正在解析简历，请稍候。。。');
      const formData = new FormData();
      formData.append('file', file); // ✅ 参数名必须是 file
      try {
        const response = await api.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const result = response.data;
        if (result.code === 200 || result.code === 0) {
          const data = result.data;
          // 逐个回填表单
          this.formData.name = data.name || '';
          this.formData.date = data.date || '';
          this.formData.educationalQualifications = data.educationalQualifications || '';
          this.formData.school = data.school || '';
          this.formData.educationalTime = data.educationalTime || '';
          this.formData.skill = data.skill || '';
          this.formData.educationalExperience = data.educationalExperience || '';
          this.formData.jobExperience = data.jobExperience || '';
          alert('解析成功，已自动填充表单信息');
        } else {
          alert(result.msg || '解析失败');
        }
      } catch (error) {
        console.error("上传失败详情：", error);
        alert('网络错误，请检查后端服务是否开启');
      }
    },

    validateForm() {
      if (!this.formData.name || this.formData.name.trim() === '') {
        alert('请填写姓名！');
        return false;
      }
      if (!this.formData.date || this.formData.date.trim() === '') {
        alert('请选择出生日期！');
        return false;
      }
      if (!this.formData.educationalQualifications || this.formData.educationalQualifications.trim() === '') {
        alert('请选择最高学历！');
        return false;
      }
      if (!this.formData.school || this.formData.school.trim() === '') {
        alert('请填写毕业院校！');
        return false;
      }
      if (!this.formData.educationalTime || this.formData.educationalTime.trim() === '') {
        alert('请填写毕业时间！');
        return false;
      }
      if (!this.formData.skill || this.formData.skill.trim() === '') {
        alert('请填写专业技能！');
        return false;
      }
      if (!this.formData.educationalExperience || this.formData.educationalExperience.trim() === '') {
        alert('请填写教育经历！');
        return false;
      }
      if (!this.formData.jobExperience || this.formData.jobExperience.trim() === '') {
        alert('请填写工作经历！');
        return false;
      }
      if (!this.isAgree) {
        alert('请勾选同意服务条款及隐私协议！');
        return false;
      }
      return true;
    },

    async handleNext() {
      if (!this.validateForm()) return;
      alert('正在分析解析的简历文本是否合法，请稍候。。。');
      const resumeText =  `
        【姓名】${this.formData.name}
        【出生日期】${this.formData.date}
        【最高学历】${this.formData.educationalQualifications}
        【毕业院校】${this.formData.school}
        【毕业时间】${this.formData.educationalTime}
        【专业技能】${this.formData.skill}
        【教育经历】${this.formData.educationalExperience}
        【工作经历】${this.formData.jobExperience}`.trim();
    
      const judgmentResumeRequestData = await api.post("/ai/judgment/resume", resumeText, {
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8'
        }
      });      
      const judgmentResumeResult = judgmentResumeRequestData.data;
      if(judgmentResumeResult.code !== 200) {
        alert(judgmentResumeResult.msg || '表单信息不合法！请重新填写表单中的简历信息！');
        return;
      }

      const mbtiRequest = await api.get("/ai/search/mbti/content", {
        params: {
          constellation: this.constellation
        }
      });      
      const mbtiRequestData = mbtiRequest.data;

      if(mbtiRequestData.code !== 200) {
        alert(mbtiRequestData.msg);
        return;
      }
      const mbtiData = mbtiRequestData.data;
      this.$router.push({
        name: 'MBTITestQuestion', // 写路由name，不能写path
        params: { 
          constellationFoundationScore: JSON.stringify(mbtiData.constellationFoundationScore),
          mbtiQuestionList: JSON.stringify(mbtiData.mbtiQuestionList),
          resumeText: resumeText 
        },
      });
    },
    handleNoResume() {
      this.$router.push('/no-resume');
    }
  }
}

</script>

<style scoped>

.title-div{
  margin-top: 12rem;
  text-align: center;
  font-size: 5rem;
  color: #000;
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

.icon-shangchuanwenjian{
  position: relative;
  top: 0.8rem;
  font-size: 7.5rem;
  color: #00F5D4;
}

.upload-resume{
  font-size: 5rem;
  color: #00F5D4;
  margin-top: 1.5rem;
}

.hint-div{
  position: relative;
  left: 10rem;
  display: flex;
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
  margin-bottom: 5rem;
}

/* 图标：用 rem 调整间距 */
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

.resume-content{
  position: relative;
  left: 10rem;
  top: 20rem;
  height: 30rem;
  width: 80rem;
  margin-bottom: 20rem;
}

.identification-text{
  position: relative;
  top: 0rem;
  left: 0rem;
  font-size: 4rem;
  color: #000;
}

.resume-text{
  height: 30rem;
  width: 80rem;
  background-color: #fff;
  border: 0.5rem solid #000;
  padding: 2rem;
  font-size: 3rem;
  color: #000;
}

.middle-container{
  position: relative;
  top:4rem;
  left: 10rem;
  width: 80rem;
  height: auto;
  min-height: 100rem;
  background-color: #767676;
  border-radius: 5rem;
  padding: 8rem 2rem; 
  box-sizing: border-box; 
}

.name-div{
  margin-bottom: 5rem;
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

.date-div{
  margin-bottom: 5rem;
}
.date-text{
  position: relative;
  font-size: 4rem;
  color: #AAAAAA;
}

.input-date{
  position: relative;
  left: 3rem;
  width: 55rem;
  height: 7rem;
  border-radius: 2rem;
  border: none;
}

.school-div{
  margin-bottom: 5rem;
}
.school-text{
  position: relative;
  font-size: 4rem;
  color: #AAAAAA;
}

.input-school{
  position: relative;
  left: 3rem;
  width: 55rem;
  height: 7rem;
  border-radius: 2rem;
  border: none;
}

.educational-time-div{
  margin-bottom: 5rem;
}
.educational-time-text{
  position: relative;
  font-size: 4rem;
  color: #AAAAAA;
}

.input-educational-time{
  position: relative;
  left: 3rem;
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

.educational-div{
  margin-bottom: 5rem;
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
  height: auto;
  min-height: 20rem;
  border-radius: 2rem;
  border: none;
}

.skill-text{
  position: relative;
  top: -16rem;
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
</style>