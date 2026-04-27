<template>
  <div class="home-container">
    <div class="head-container">
      <img src="../assets/img/上面固定栏.png" class="logo"/>
    </div>

    <input type="file" ref="imageInput" accept="image/*" style="display: none" @change="handleImageChange">
    <input type="file" ref="pdfInput" accept=".pdf" style="display: none" @change="handlePdfChange">
    <input type="file" ref="docxInput" accept=".docx" style="display: none" @change="handleDocxChange">
    
    <div class="upload-container">
      <div class="upload-img" @click="triggerImageUpload">
        <span class="iconfont icon-shangchuantupian"></span>
        <span class="upload-text">上传图片</span>
      </div>
      <div class="upload-file" @click="triggerPdfUpload">
        <span class="iconfont icon-shangchuanwenjian"></span>
        <span class="upload-text" >上传pdf文件</span>
      </div>
      <div class="generate-template" @click="triggerDocxUpload">
        <span class="iconfont icon-zidongshengcheng"></span>
        <span class="upload-text">上传docx文件</span>     
      </div>
    </div>

    <div class="middle-container">
      <div class="name-div">
        <span class="name-text" >姓名/ID</span>
        <input type="text" class="input-name" placeholder="   请填写姓名/ID" v-model="formData.name">
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
      <p class="hint-text">我已阅读并同意<span class="service-text">服务条款</span>和<span class="privacy-text">隐私设置</span>。我理解我的简历数据将被用于AI分析和职业匹配。</p>      
    </div>

    <div class="btn-div">
      <button class="free-analysis-btn" @click="handleFreeAnalysis">下一步：匹配岗位<span class="iconfont icon-sanjiaoxing"></span></button>
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
  name: 'Home',
  data() {
    return {
      isAgree: false, // 复选框勾选状态，默认未勾选
      showTip: false,  // 错误提示是否显示，默认隐藏
      // 表单数据
      formData: {
        name: '',
        educationalQualifications: '',
        skill: '',
        educationalExperience: '',
        jobExperience: ''
      }
    }
  },
  methods: {
    goNext() {
      if(this.validateForm()) { // ✅ 使用统一的验证方法
        // ✅ 已勾选：正常路由跳转
        this.$router.push('/match-result')
        this.showTip = false
      }
    },

    // --- 1. 触发选择框 ---
    triggerImageUpload() { this.$refs.imageInput.click(); },
    triggerPdfUpload() { this.$refs.pdfInput.click(); },
    triggerDocxUpload() { this.$refs.docxInput.click(); },

    // --- 2. 这里的函数名必须和 template 里的 @change 一致 ---
    async handleImageChange(event) {
      const file = event.target.files[0];
      if (file) await this.uploadFile(file, "/ai/parse/image");
      event.target.value = ''; 
    },
    async handlePdfChange(event) {
      console.log("上传的url", getAiURL());
      const file = event.target.files[0];
      if (file) await this.uploadFile(file, "/ai/parse/pdf");
      event.target.value = '';
    },
    async handleDocxChange(event) {
      const file = event.target.files[0];
      if (file) await this.uploadFile(file, "/ai/parse/docx");
      event.target.value = '';
    },

    // --- 3. 统一上传逻辑 ---
    async uploadFile(file, url) {
      // 👉 新增：上传前先清空旧数据并显示加载状态
      this.formData = {
        name: '',
        educationalQualifications: '',
        skill: '',
        educationalExperience: '',
        jobExperience: ''
      };

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const result = response.data;
        console.log("接口的getAiURL：", getAiURL());
        console.log("接口的url：", url);
        console.log("接口响应结果：", result);

        if (result.code === 200 || result.code === 0) {
          this.fillFormData(result.data); // 调用回显填充
          alert('解析成功，已自动填充简历信息');
        } else {
          this.formData.name = ''; // 失败则清空提示
          alert(result.msg || '解析失败');
        }
      } catch (error) {
        this.formData.name = '';
        console.error("上传失败详情：", error);
        alert('网络错误，请检查后端服务是否开启');
      }
    },

    // --- 4. 核心回显逻辑 ---
    fillFormData(data) {
      if (!data) return;
      console.log("后端返回的具体数据内容：", data);

      // 💡 改进：为了兼容旧版编译器，使用三元运算符代替 ??
      // 这种写法能精确判断 null 和 undefined，同时支持空字符串清空数据
      this.formData = {
        name: (data.name !== null && data.name !== undefined) ? data.name : '',
        educationalQualifications: (data.educationalQualifications !== null && data.educationalQualifications !== undefined) ? data.educationalQualifications : '',
        skill: (data.skill !== null && data.skill !== undefined) ? data.skill : '',
        educationalExperience: (data.educationalExperience !== null && data.educationalExperience !== undefined) ? data.educationalExperience : '',
        jobExperience: (data.jobExperience !== null && data.jobExperience !== undefined) ? data.jobExperience : ''
      };
      
      // 强制更新视图
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },

    // --- 其他逻辑 ---
    validateForm() {
      if (!this.isAgree) {
        alert('请先勾选同意服务条款及隐私协议');
        return false;
      }

      // 1. 基础非空校验
      const requiredFields = [
        { field: 'name', label: '姓名/ID' },
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

    handleFreeAnalysis() {
      if (!this.validateForm()) return;
      this.$router.push({
        path: '/match-load',
        // query: { resume: this.formData },
        query: { resume: this.formData },
      });
    }
  }
}

</script>

<style scoped>
.home-container {
  width: 100vw;
  min-height: 100vh;
  height: auto;
  background-image: url('../assets/img/第一页白背景.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  left: 0;
}

.head-container {
  height: 10rem;
}

.logo {
  width: 100%;
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
  top: 20rem;
  left: 10rem;
  width: 80rem;
  height: auto;
  min-height: 100rem;
  background-color: #767676;
  border-radius: 5rem;
  padding: 8rem 2rem; /* 新增：给容器加上下/左右内边距，元素在容器内 */
  box-sizing: border-box; /* 新增：内边距不撑大容器宽度 */
}

.name-text{
  font-size: 4rem;
  color: #AAAAAA;
}

.input-name{
  position: relative;
  left: 5rem;
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
  top: 20rem;
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
  top: 18rem;
  margin-left: 20rem;
}

/* 按钮：用 rem 调整尺寸和边距 */
.free-analysis-btn {
  background: #01F5D4;
  color: #595959;
  width: 60rem; 
  height: 8rem; 
  border: none;
  border-radius: 2.67rem; 
  font-size: 4rem; 
}

/* 图标：用 rem 调整间距 */
.icon-sanjiaoxing {
  margin-left: 2rem;
  font-size: 4rem;
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