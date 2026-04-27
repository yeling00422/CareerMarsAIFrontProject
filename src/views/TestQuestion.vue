<template>
  <div class="testQuestion-page">
    <div class="test-paper-name">{{ getCurrentQuestionName() }}</div>

    <!-- 问题编号 -->
    <div class="question-number">问题 {{ currentPage }} / {{ totalPages }}</div>
    
    <!-- 问题内容 -->
    <div class="question-card">
      ({{ getCurrentQuestionTypeText() }}) 
      <br>
      {{ getCurrentQuestionTitle() }}
    </div>
    
    <!-- 选项/输入区域 -->
    <div class="options-container">
      <!-- 单选题 / 多选题 / 判断题：选项列表 -->
      <div v-if="getCurrentQuestionType() !== 4">
        <div 
          v-for="(option, index) in getCurrentQuestionOptions()" 
          :key="index"
          :class="getOptionClass(option.option)"
          @click="selectOption(option.option)"
        >
          <div class="option-letter">{{ option.option }}</div>
          <div class="option-content">{{ option.text }}</div>
        </div>
      </div>

      <!-- 填空题：输入框 -->
      <div v-else-if="getCurrentQuestionType() === 4">
        <input 
          v-model="userFreeTextAnswer"
          type="text" 
          class="free-text-input"
          placeholder="请输入您的答案..."
          @input="saveUserAnswer"
        />
      </div>
    </div>

    <!-- 提示文字 -->
    <div class="tip-text" :class="{ hidden: hasUserAnswered() }">
      {{ getCurrentQuestionType() === 4 ? '提示：请输入正确的答案' : '提示：请选择正确的答案' }}
    </div>

    <!-- 按钮区域 -->
    <div class="button-section" :class="{ hidden: selectedOption === null }">
      <!-- 上一题 -->
      <button 
        v-if="currentPage > 1"
        class="nav-btn prev-btn" 
        @click="lastQuestion"
      >
        上一题<span class="iconfont icon-sanjiaoxing icon-arrow-left"></span>
      </button>

      <!-- 下一题 / 提交 -->
      <button 
        class="nav-btn next-btn" 
        @click="nextQuestion"
      >
        {{ currentPage !== totalPages ? '下一题' : '提交' }}<span class="iconfont icon-sanjiaoxing icon-arrow-right" ></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestQuestion',
  data() {
    return {
      selectedOption: null,
      selectedOptions: [],
      userFreeTextAnswer: '',
      currentPage: 1,
      userAnswers: [],
      position: '',
      resumeText: '',
      testPaperName: '',
      questions: [],
      interviewScore: 0,
      userInfo: null,
    }
  },
  computed: {
    totalPages() {
      return this.questions.length;
    },
    scorePerQuestion() {
      return 100 / this.totalPages;
    }
  },
  created() {
    this.loadQuestionData();
  },
  methods: {
    loadQuestionData() {
      const testQuestion = this.$route.query.testQuestion;
      this.position = this.$route.query.position;
      this.resumeText = this.$route.query.resumeText;
      this.userInfo = this.$route.query.userInfo;

      console.log("test-question-testQuestion:", testQuestion);
      console.log("test-question-position:", this.position);
      console.log("test-question-resumeText:", this.resumeText);


      if (testQuestion) {
        try {
          const parsedData = JSON.parse(testQuestion);
          // ✅ 使用兼容性写法，不使用可选链
          this.questions = Array.isArray(parsedData) ? parsedData : (parsedData && parsedData.questions ? parsedData.questions : []);
          console.log("questions:", this.questions);
          console.log("题目数量:", this.questions.length);
        } catch (error) {
          console.error('解析题目数据失败:', error);
          alert('数据加载失败，请重新尝试');
          this.$router.push('/');
        }
      } else {
        alert('未找到匹配数据，请重新分析');
        this.$router.push('/');
      }
    },

    getCurrentQuestionName() {
      const q = this.getCurrentQuestion();
      return q ? q.name : 0;
    },

    getCurrentQuestionTitle() {
      const q = this.getCurrentQuestion();
      return q ? q.title : '';
    },

    getCurrentQuestionType() {
      const q = this.getCurrentQuestion();
      return q ? q.type : 0;
    },

    getCurrentQuestionTypeText() {
      const type = this.getCurrentQuestionType();
      const typeMap = {
        1: '单选题',
        2: '多选题',
        3: '判断题',
        4: '填空题',
        5: '性格测试题'
      };
      return typeMap[type] || '未知题型';
    },

    getCurrentQuestionOptions() {
      const q = this.getCurrentQuestion();
      return q ? q.options || [] : [];
    },

    getCurrentQuestion() {
      return this.questions[this.currentPage - 1];
    },

    getOptionClass(optionValue) {
      return [
        'option',
        { 
          selected: this.isOptionSelected(optionValue)
        }
      ];
    },

    isOptionSelected(optionValue) {
      if (this.getCurrentQuestionType() === 2) {
        return this.selectedOptions.includes(optionValue);
      } else {
        return this.selectedOption === optionValue;
      }
    },

    selectOption(optionValue) {
      const type = this.getCurrentQuestionType();

      if (type === 2) {
        const idx = this.selectedOptions.indexOf(optionValue);
        if (idx > -1) {
          this.selectedOptions.splice(idx, 1);
        } else {
          this.selectedOptions.push(optionValue);
        }
      } else {
        this.selectedOption = this.selectedOption === optionValue ? null : optionValue;
      }

      this.saveUserAnswer();
    },

    saveUserAnswer() {
      const type = this.getCurrentQuestionType();
      let answer = null;

      if (type === 4) {
        answer = this.userFreeTextAnswer;
      } else if (type === 2) {
        answer = [...this.selectedOptions].sort();
      } else {
        answer = this.selectedOption;
      }

      while (this.userAnswers.length < this.currentPage) {
        this.userAnswers.push(null);
      }
      this.userAnswers[this.currentPage - 1] = answer;
    },

    hasUserAnswered() {
      const type = this.getCurrentQuestionType();
      const answer = this.userAnswers[this.currentPage - 1];

      if (type === 4) {
        return !!this.userFreeTextAnswer && this.userFreeTextAnswer.trim() !== '';
      } else if (type === 2) {
        return this.selectedOptions && this.selectedOptions.length > 0;
      } else {
        return this.selectedOption !== null;
      }
    },

    checkMultipleChoiceAnswer(userAnswer, correctAnswer) {
      if (!userAnswer || !correctAnswer) return false;
      
      // 如果 correctAnswer 是字符串，按逗号分割成数组
      const correctArray = typeof correctAnswer === 'string' 
        ? correctAnswer.split(',') 
        : correctAnswer;
      const userSorted = [...userAnswer].sort().join(',');
      const correctSorted = [...correctArray].sort().join(',');
      
      return userSorted === correctSorted;
    },

    calculateTotalScore() {
    const totalQuestions = this.questions.length;
    if (totalQuestions === 0) return 0;

    // 1. 计算每题得分（截断两位小数）
    const rawScorePerQuestion = 100 / totalQuestions;
    const scorePerQuestion = Math.floor(rawScorePerQuestion * 100) / 100;

    let totalScore = 0;

    this.questions.forEach((question, index) => {
      const userAnswer = this.userAnswers[index];
      const correctAnswer = question.answer;
      const type = question.type;

      // 性格测试题直接算对
      if (type === 5) {
        totalScore += scorePerQuestion;
        return;
      }

      let isCorrect = false;

      if (type === 2) {
        // 多选题
        isCorrect = this.checkMultipleChoiceAnswer(userAnswer, correctAnswer);
      } else if (type === 3) {
        // 判断题
        const judgeMap = {
          A: '正确',
          B: '错误'
        };
        isCorrect = judgeMap[userAnswer] === correctAnswer;
      } else {
        // 单选 / 填空
        isCorrect = userAnswer === correctAnswer;
      }

      if (isCorrect) {
        totalScore += scorePerQuestion;
      }
    });

    // 2. 最终总分四舍五入
    return Math.round(totalScore);
    },

    lastQuestion() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.resetCurrentAnswer();
      }
    },

    nextQuestion() {
      if (!this.hasUserAnswered()) {
        alert('请先完成当前题目');
        return;
      }

      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.resetCurrentAnswer();
      } else {


        this.interviewScore = this.calculateTotalScore();
        console.log('提交所有答案:', {
          position: this.position,
          interviewScore: this.interviewScore,
          resumeText: this.resumeText
        });
        this.$router.push({
          path: '/test-question-result-load',
          query: { 
            position: this.position,
            interviewScore: this.interviewScore,
            resumeText: this.resumeText,
            userInfo: this.userInfo,
          }
        });
      }
    },

    resetCurrentAnswer() {
      this.selectedOption = null;
      this.selectedOptions = [];
      this.userFreeTextAnswer = '';
      this.saveUserAnswer();
    }
  }
}
</script>

<style scoped>

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
  gap: 0;
  overflow-y: auto;
  margin-bottom: 3rem;
  padding-bottom: 5rem;
}

.option {
  background-color: #999;
  border-radius: 2rem;
  padding: 0;
  color: white;
  font-size: 3rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  height: auto;
  min-height: 0;
  border: 1rem solid transparent;
  margin-bottom: 3rem;
}

.option:hover {
  background-color: #888;
}

.option.selected {
  border-color: #00F5D4;
}

.option-letter {
  width: 6rem;
  height: 6rem;
  background-color: #666;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 2.5rem;
  margin-right: 2.5rem;
  font-weight: bold;
  flex-shrink: 0;
  font-size: 4rem;
}

.option.selected .option-letter {
  color: #666;
  background-color: #00F5D4;
}

.option-content {
  flex: 1;
  line-height: 1.8;
  word-break: break-word;
  padding: 3.5rem 0;
}

.tip-text {
  text-align: center;
  color: #999;
  font-size: 3rem;
}

.button-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 5rem 10rem;
}

.nav-btn {
  width: 40rem;
  font-size: 4rem;
  padding: 2rem 5rem;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  margin: 5rem;
  transition: all 0.3s;
}

.prev-btn {
  background: #aaa;
  color: white;
}

.next-btn {
  background: #00F5D4;
  color: #333;
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

.hidden {
  opacity: 0;
  visibility: hidden;
  height: 0;
  padding: 0;
  margin: 0;
}

.free-text-input {
  width: 92%;
  padding: 3rem;
  font-size: 3rem;
  border: 2px solid #ccc;
  border-radius: 2rem;
  margin-top: 2rem;
  background: #fff;
  color: #333;
}

.test-paper-name {
  text-align: center;
  color: #999;
  font-size: 6rem;
  font-weight: bold;

  width: 60rem;
  height: auto;
  margin: 20rem auto 0;
  border-radius: 2rem;
  background-color: #00F5D4;
}
</style>