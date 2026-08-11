import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import UploadResume from '../views/UploadResume.vue'
import GenerateReport from '../views/GenerateReport.vue'
import LoginLoad from '../views/LoginLoad.vue'
import LoginByPhoneCode from '../views/LoginByPhoneCode.vue'
import LoginByPhonePassword from '../views/LoginByPhonePassword.vue'
import LoginByEmailPassword from '../views/LoginByEmailPassword.vue'
import LoginSuccess from '../views/LoginSuccess.vue'
import RegisterByPhoneCode from '../views/RegisterByPhoneCode.vue'
import RegisterByEmailCode from '../views/RegisterByEmailCode.vue'
import MatchJobLoad from '../views/MatchJobLoad.vue'
import MatchJob from '../views/MatchJob.vue'
import GenerateTestQuestionLoad from '../views/GenerateTestQuestionLoad.vue'
import TestQuestion from '../views/TestQuestion.vue'
import TestQuestionResultLoad from '../views/TestQuestionResultLoad.vue'
import TestQuestionResult from '../views/TestQuestionResult.vue'
import EndLoad from '../views/EndLoad.vue'
import EndResult from '../views/EndResult.vue'
import MBTITestQuestion from '../views/MBTITestQuestion.vue'
import MBTITestResult from '../views/MBTITestResult.vue'
import MBTITestEndResult from '../views/MBTITestEndResult.vue'
import AllMentorResult from '../views/AllMentorResult.vue'


Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/home',name: 'Home', component: Home },
  { path: '/upload-resume',name: 'UploadResume', component: UploadResume },
  { path: '/generate-report',name: 'GenerateReport', component: GenerateReport },
  { path: '/login-load',name: 'LoginLoad', component: LoginLoad },
  { path: '/login-by-phone-code',name: 'LoginByPhoneCode', component: LoginByPhoneCode },
  { path: '/login-by-phone-password',name: 'LoginByPhonePassword', component: LoginByPhonePassword },
  { path: '/login-by-email-password',name: 'LoginByEmailPassword', component: LoginByEmailPassword },
  { path: '/register-by-phone-code',name: 'RegisterByPhoneCode', component: RegisterByPhoneCode },
  { path: '/register-by-email-code',name: 'RegisterByEmailCode', component: RegisterByEmailCode },
  { path: '/login-success',name: 'LoginSuccess', component: LoginSuccess },
  { path: '/match-job-load',name: 'MatchJobLoad', component: MatchJobLoad },
  { path: '/match-job',name: 'MatchJob', component: MatchJob },
  { path: '/generate-test-question-load',name: 'GenerateTestQuestionLoad', component: GenerateTestQuestionLoad },
  { path: '/test-question',name: 'TestQuestion', component: TestQuestion },
  { path: '/test-question-result-load',name: 'TestQuestionResultLoad', component: TestQuestionResultLoad },
  { path: '/test-question-result',name: 'TestQuestionResult', component: TestQuestionResult },
  { path: '/end-load',name: 'EndLoad', component: EndLoad },
  { path: '/end-result',name: 'EndResult', component: EndResult },
  { path: '/mbti-test-question', name: 'MBTITestQuestion', component: MBTITestQuestion },
  { path: '/mbti-test-result', name: 'MBTITestResult',component: MBTITestResult },
  { path: '/mbti-test-end-result',name: 'MBTITestEndResult', component: MBTITestEndResult },
  { path: '/all-mentor-result',name: 'AllMentorResult', component: AllMentorResult },
]

const router = new VueRouter({
  mode: 'history',
  base: '/ai/',  // ✅ 重点：告诉 Vue Router 它运行在 /ai/ 子路径下
  routes
})

export default router