import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import UploadResume from '../views/UploadResume.vue'
import NoResume from '../views/NoResume.vue'
import AnalysisResume from '../views/AnalysisResume.vue'
import CharacteristicsTest from '../views/CharacteristicsTest.vue'
import GenerateReport from '../views/GenerateReport.vue'
import LoginLoad from '../views/LoginLoad.vue'
import LoginByPhoneCode from '../views/LoginByPhoneCode.vue'
import LoginByPhonePassword from '../views/LoginByPhonePassword.vue'
import LoginByEmailPassword from '../views/LoginByEmailPassword.vue'
import RegisterByPhoneCode from '../views/RegisterByPhoneCode.vue'
import RegisterByEmailCode from '../views/RegisterByEmailCode.vue'
import LoginSuccess from '../views/LoginSuccess.vue'
import MatchJobLoad from '../views/MatchJobLoad.vue'
import MatchJob from '../views/MatchJob.vue'
import GenerateTestQuestionLoad from '../views/GenerateTestQuestionLoad.vue'
import TestQuestion from '../views/TestQuestion.vue'
import TestQuestionResultLoad from '../views/TestQuestionResultLoad.vue'
import TestQuestionResult from '../views/TestQuestionResult.vue'
import EndLoad from '../views/EndLoad.vue'
import EndResult from '../views/EndResult.vue'

// import MatchIndustry from '../views/MatchIndustry.vue'
// import MatchTestName from '../views/MatchTestName.vue'
// import AnalysisLoad from '../views/AnalysisLoad.vue'
// import Question from '../views/Question.vue'
// import AnalysisQuestion from '../views/AnalysisQuestion.vue'
// import AnalysisResult from '../views/AnalysisResult.vue'

// import LoginLoad from '../views/LoginLoad.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/home', component: Home },
  { path: '/upload-resume', component: UploadResume },
  { path: '/no-resume', component: NoResume },
  { path: '/analysis-resume', component: AnalysisResume },
  { path: '/characteristics-test', component: CharacteristicsTest },
  { path: '/generate-report', component: GenerateReport },
  { path: '/login-load', component: LoginLoad },
  { path: '/login-by-phone-code', component: LoginByPhoneCode },
  { path: '/login-by-phone-password', component: LoginByPhonePassword },
  { path: '/login-by-email-password', component: LoginByEmailPassword },
  { path: '/register-by-phone-code', component: RegisterByPhoneCode },
  { path: '/register-by-email-code', component: RegisterByEmailCode },
  { path: '/login-success', component: LoginSuccess },
  { path: '/match-job-load', component: MatchJobLoad },
  { path: '/match-job', component: MatchJob },
  { path: '/generate-test-question-load', component: GenerateTestQuestionLoad },
  { path: '/test-question', component: TestQuestion },
  { path: '/test-question-result-load', component: TestQuestionResultLoad },
  { path: '/test-question-result', component: TestQuestionResult },
  { path: '/end-load', component: EndLoad },
  { path: '/end-result', component: EndResult },

  // { path: '/match-industry', component: MatchIndustry },
  // { path: '/match-test-name', component: MatchTestName },
  // { path: '/match-load', component: MatchLoad },
  // { path: '/analysis-load', component: AnalysisLoad },
  // { path: '/question', component: Question },
  // { path: '/analysis-question', component: AnalysisQuestion },
  // { path: '/analysis-result', component: AnalysisResult },

  // { path: '/match-job', component: MatchJob },
  // { path: '/login-load', component: LoginLoad },
]

const router = new VueRouter({
  mode: 'history',
  base: '/ai/',  // ✅ 重点：告诉 Vue Router 它运行在 /ai/ 子路径下
  routes
})

export default router