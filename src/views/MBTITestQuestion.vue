<template>
  <div class="MBTITestQuestion-page">    
    <div class="constellation-container">
      <div class="constellation-title">您的星座为：{{ this.constellationFoundationScore.constellation}}</div>
      <div class="constellation-attributes">星象：{{ this.constellationFoundationScore.attributes}}</div>
      <div class="constellation-explanation">先天特质：{{ this.constellationFoundationScore.explanation}}</div>
      <div class="foundation-score" v-show="hidden">星座基础得分:
        <span>外向E:{{ this.constellationFoundationScore.escore}} </span>
        <span>内向I:{{ this.constellationFoundationScore.iscore}} </span>
        <span>实感S:{{ this.constellationFoundationScore.sscore}} </span>
        <span>直觉N:{{ this.constellationFoundationScore.nscore}} </span>
        <span>理性T:{{ this.constellationFoundationScore.tscore}} </span>
        <span>感性F:{{ this.constellationFoundationScore.fscore}} </span>
        <span>计划J:{{ this.constellationFoundationScore.jscore}} </span>
        <span>随性P:{{ this.constellationFoundationScore.pscore}} </span>
      </div> 
    </div>
    <!-- 问题编号 -->
    <div class="question-number">MBTI测试题 {{ currentPage }} / {{ totalPages }}</div>
    <!-- 问题内容 -->
    <div class="question-card">
      {{ getCurrentQuestion(). questionContent}}
    </div>
    <!-- 选项列表 -->
    <div class="options-container">
      <div 
        class="option"
        :class="{ selected: selectedOption === 'A' }"
        @click="selectOption('A')"
      >
        <div class="option-letter">A</div>
        <div class="option-content">{{ getCurrentQuestion().optionA}}</div>
      </div>
      <div 
        class="option"
        :class="{ selected: selectedOption === 'B' }"
        @click="selectOption('B')"
      >
        <div class="option-letter">B</div>
        <div class="option-content">{{ getCurrentQuestion().optionB}}</div>
      </div>
    </div>
    <!-- 提示文字 -->
    <div class="tip-text" :class="{ hidden: selectedOption !== null }">提示：选择最符合你想法的答案</div>
    <div class="last-button-section" :class="{ hidden: !allAnswered}">
      <button class="free-analysis-btn prev-btn" @click="lastQuestion">上一题<span class="iconfont icon-sanjiaoxing icon-arrow-left"></span></button>
    </div>
    <div class="next-button-section" :class="{ hidden: !allAnswered}">
      <button class="free-analysis-btn next-btn" @click="nextQuestion">{{ currentPage !== totalPages ? '下一题' : '提交' }}<span class="iconfont icon-sanjiaoxing icon-arrow-right" ></span></button>
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
  name: 'MBTITestQuestion',
  data() {
    return {
      selectedOption: null,
      currentPage: 1,
      userAnswers: [], // 新增：记录用户每道题的答案
      resumeText: '', 
      constellationFoundationScore:'',
      questions: [],
      eScore:0,
      iScore:0,
      sScore:0,
      nScore:0,
      tScore:0,
      fScore:0,
      gScore:0,
      pScore:0,
      isClickLock: false, // 新增：点击防抖锁
    }
  },
  computed: {
    totalPages() {
      return this.questions.length;
    },
    allAnswered() {
      const allFilled = this.userAnswers.length === this.totalPages && this.userAnswers.every(item => item != null);
      const currentHasAnswer = this.userAnswers[this.currentPage - 1] != null;
      return allFilled && currentHasAnswer;

    // 数组长度等于题目总数，且每一项都不为空
    // return this.userAnswers.length === this.totalPages && this.userAnswers.every(item => item != null);
  }
  },
  created() {
    // 组件创建时自动加载数据
    this.loadQuestionData();
  },
  methods: {
    loadQuestionData() {
      this.resumeText = this.$route.params.resumeText;
      const constellationFoundationScoreStr = this.$route.params.constellationFoundationScore;
      const mbtiQuestionListStr = this.$route.params.mbtiQuestionList;
      if (mbtiQuestionListStr) {
        try {
          this.questions = JSON.parse(mbtiQuestionListStr);
          this.constellationFoundationScore = JSON.parse(constellationFoundationScoreStr);
        } catch (error) {
          console.error('解析匹配数据失败:', error);
          alert('数据加载失败，请重新尝试');
          this.$router.push('/');
        }
      } else {
        alert('未找到匹配数据，请重新分析');
        this.$router.push('/');
      }
    },
    
    getCurrentQuestion() {
      return this.questions[this.currentPage - 1];
    },
    
    selectOption(value) {
        if(this.isClickLock) return;
        this.selectedOption = value;
        // 补齐数组空位，防止长度不足导致allAnswered不生效
        while (this.userAnswers.length < this.currentPage) {
          this.userAnswers.push(null);
        }
        this.userAnswers[this.currentPage - 1] = value;

        // 非最后一题，1秒自动跳题
        if (this.currentPage < this.totalPages) {
          this.isClickLock = true; // 上锁
          setTimeout(() => {
            this.currentPage++;
            this.selectedOption = this.userAnswers[this.currentPage - 1] || null;
            this.isClickLock = false; // 解锁
          }, 250);
        }
    },
    
    lastQuestion() {
      if(this.isClickLock) return;
      if (this.currentPage > 1) {
        this.currentPage--;
        if (this.userAnswers[this.currentPage - 1]) {
          this.selectedOption = this.userAnswers[this.currentPage - 1];
        } else {
          this.selectedOption = null;
        }
      }
    },
    async nextQuestion() {
      if(this.isClickLock) return;
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        // 设置当前页面的选中状态
        if (this.userAnswers[this.currentPage - 1]) {
          this.selectedOption = this.userAnswers[this.currentPage - 1];
        } else {
          this.selectedOption = null;
        }
      } else {
        this.eScore = this.constellationFoundationScore.escore;
        this.iScore = this.constellationFoundationScore.iscore;
        this.sScore = this.constellationFoundationScore.sscore;
        this.nScore = this.constellationFoundationScore.nscore;
        this.tScore = this.constellationFoundationScore.tscore;
        this.fScore = this.constellationFoundationScore.fscore;
        this.jScore = this.constellationFoundationScore.jscore;
        this.pScore = this.constellationFoundationScore.pscore;

        let eAccScore = 0; // E的累积得分
        let iAccScore = 0; // I的累积得分
        let sAccScore = 0; // S的累积得分
        let nAccScore = 0; // N的累积得分
        let tAccScore = 0; // T的累积得分
        let fAccScore = 0; // F的累积得分
        let jAccScore = 0; // J的累积得分
        let pAccScore = 0; // P的累积得分

        this.questions.forEach((question, index) => {
          if(question.type === 1){
            if(this.userAnswers[index] === 'A'){
              // this.eScore++;
              eAccScore++;
            }else if(this.userAnswers[index] === 'B'){
              // this.iScore++;
              iAccScore++;
            }
          }else if(question.type === 2){
            if(this.userAnswers[index] === 'A'){
              // this.sScore++;
              sAccScore++;
            }else if(this.userAnswers[index] === 'B'){
              // this.nScore++;
              nAccScore++;
            }
          }else if(question.type === 3){
            if(this.userAnswers[index] === 'A'){
              // this.tScore++;
              tAccScore++;
            }else if(this.userAnswers[index] === 'B'){
              // this.fScore++;
              fAccScore++;
            }
          }else if(question.type === 4){
            if(this.userAnswers[index] === 'A'){
              // this.jScore++;
              jAccScore++;
            }else if(this.userAnswers[index] === 'B'){
              // this.pScore++;
              pAccScore++;
            }
          }
        })

        this.eScore = this.eScore+eAccScore;
        this.iScore = this.iScore+iAccScore;
        this.sScore = this.sScore+sAccScore;
        this.nScore = this.nScore+nAccScore;
        this.tScore = this.tScore+tAccScore;
        this.fScore = this.fScore+fAccScore;
        this.jScore = this.jScore+jAccScore;
        this.pScore = this.pScore+pAccScore;

        const ei = this.eScore > this.iScore ? 'E' : 'I';
        const sn = this.sScore > this.nScore ? 'S' : 'N';
        const tf = this.tScore > this.fScore ? 'T' : 'F';
        const jp = this.jScore > this.pScore ? 'J' : 'P';
        const mbtiResult = `${ei}${sn}${tf}${jp}`;
        const mbtiRequest = await api.get("/ai/search/mbti/result", {
          params: {
            name: mbtiResult
          }
        });      
        const mbtiRequestData = mbtiRequest.data;
        if(mbtiRequestData.code !== 200) {
          alert(mbtiRequestData.msg);
          return;
        }
        const mbtiResultData = mbtiRequestData.data;
        this.$router.push({
            name: 'MBTITestResult',
            params: { 
              mbtiResultDataStr: JSON.stringify(mbtiResultData),
              resumeText: this.resumeText, 
              mbtiResult: mbtiResult, 
            }
        });
      }
    },
  },
}
</script>

<style scoped>

.constellation-container{
  display: flex;
  flex-wrap: wrap;
  width:90rem;
  background-color: #646464;
  margin: 15rem auto 0; 
  font-size: 4rem;
  padding: 3rem;
  box-sizing: border-box;
  border-radius: 5rem;
  border: #00F5D4 solid 0.5rem;
  color:#fff;
}

.constellation-title{
  width: 100%;
}

.constellation-attributes{
  width: 100%;
}

.constellation-explanation{
  width: 100%;
}

.question-number {
  text-align: center;
  color: #333;
  padding-top: 5rem;
  padding-bottom: 4rem;
  font-size: 5rem;
  font-weight: bold;
}

.question-card {
  background-color: #444852;
  color: white;
  margin: 0 5rem 5rem;
  padding: 5rem;
  border-radius: 4rem;
  font-size: 3.5rem;
  line-height: 1.5;
  flex: 0 0 auto;

  height: auto;
  min-height: 5rem;
}

.options-container {
  flex: 1;
  padding: 0 5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;
}

.option {
  background-color: #999;
  border-radius: 2rem;
  padding: 3rem;
  color: white;
  font-size: 3rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  height: auto;
  min-height: 5rem;
  /* max-height: 25rem; */
  border: 1rem solid transparent;

}

.option.selected {
  border-color: #00F5D4
}

.option-letter {
  width: 6rem;
  height: 6rem;
  background-color: #666;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 2rem;
  font-weight: bold;
  flex-shrink: 0;
  font-size: 4rem;
}

.option.selected .option-letter {
  color: #666;
  background-color:  #00F5D4
}

.option-content {
  flex: 1;
  line-height: 1.4;
  font-size: 3.5rem;
}

.option-span {
  width: 10rem;
  height: 10rem;
  background-color: #0a21ef;
}

.option.selected .option-span {
  color: #666;
}

.tip-text {
  margin-top: 5rem;
  text-align: center;
  color: #999;
  padding-top: 5rem 0;
  font-size: 3rem;
}

.last-button-section {
  margin-top: 10rem;
  display: flex;
  justify-content: center;
  align-items: center; 
}

.next-button-section {
  margin-top: 10rem;
  display: flex;
  justify-content: center;
  align-items: center; 
}

.icon-sanjiaoxing {
  position: relative;
  color: yellow;
  margin-left: 2rem;
  font-size: 3.5rem;
}

.icon-arrow-left{
  display: inline-block;
  transform: rotate(180deg);
  color: yellow;
}

.free-analysis-btn {
  color: #fff;
  background-color: #595959;
  border: 0.5rem solid #53E4C7;
  padding-left: 2rem;
  width: 35rem;
  height: 8rem;
  border-radius: 5rem;
  font-size: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin:-2rem auto;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
  animation: cardGlow 3s ease-in-out infinite;
}


.free-analysis-btn:active {
  transform: scale(0.96);
}

.prev-btn {
  background: #aaa;
  color: white;
}

.next-btn {
  background: #00F5D4;
  border: 0.5rem solid #fff;
  color: #333;
}

.hidden {
  opacity: 0;
  visibility: hidden;
  height: 0;
  padding: 0;
  margin: 0;
}
</style>