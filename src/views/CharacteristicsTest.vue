<template>
  <div class="characteristicsTest-page">    
    <!-- 问题编号 -->
    <div class="question-number">性格测试题 {{ currentPage }} / {{ totalPages }}</div>
    <!-- 问题内容 -->
    <div class="question-card">
      {{ getCurrentQuestionContent() }}
    </div>
    <!-- 选项列表 -->
    <div class="options-container">
      <div 
        v-for="(option, index) in getCurrentQuestionOptions()" 
        :key="index"
        :class="['option', { selected: selectedOption === option.option }]"
        @click="selectOption(option.option)"
      >
        <div class="option-letter">{{ option.option }}</div>
        <div class="option-content">{{ option.text }}</div>
      </div>
    </div>
    <!-- 提示文字 -->
    <div class="tip-text" :class="{ hidden: selectedOption !== null }">提示：选择最符合你想法的答案</div>
    <div class="last-button-section" :class="{ hidden: selectedOption === null }">
      <button class="free-analysis-btn prev-btn" @click="lastQuestion">上一题<span class="iconfont icon-sanjiaoxing icon-arrow-left"></span></button>
    </div>
    <div class="next-button-section" :class="{ hidden: selectedOption === null }">
      <button class="free-analysis-btn next-btn" @click="nextQuestion">{{ currentPage !== totalPages ? '下一题' : '提交' }}<span class="iconfont icon-sanjiaoxing icon-arrow-right" ></span></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CharacteristicsTest',
  data() {
    return {
      selectedOption: null,
      currentPage: 1,
      userAnswers: [], // 新增：记录用户每道题的答案
      resumeText: '', 
      questions: [],
    }
  },
  computed: {
    totalPages() {
      return this.questions.length;
    }
  },
  created() {
    // 组件创建时自动加载数据
    this.loadQuestionData();
  },
  methods: {
    loadQuestionData() {
      const characteristicsTest = this.$route.query.characteristicsTest;
      this.resumeText = this.$route.query.resumeText;
      console.log("性格测试-characteristicsTest:",characteristicsTest);
      console.log("性格测试-resumeText:",this.resumeText);
      if (characteristicsTest) {
        try {
          // 解析数据
          const parsedData = JSON.parse(characteristicsTest);
          this.questions = parsedData.questions;
          console.log("questions", this.questions);
          console.log("题目数量:", this.questions.length);
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
    getCurrentQuestionContent() {
      const currentQuestion = this.questions[this.currentPage - 1];
      return currentQuestion ? currentQuestion.title : '';
    },
    
    getCurrentQuestionOptions() {
      const currentQuestion = this.questions[this.currentPage - 1];
      return currentQuestion ? currentQuestion.options : [];
    },
    
    selectOption(value) {
      this.selectedOption = value;
      console.log(`选择了选项 ${value}`);
      this.userAnswers[this.currentPage - 1] = value;
    },
    
    lastQuestion() {
      if (this.currentPage > 1) {
        this.currentPage--;
        if (this.userAnswers[this.currentPage - 1]) {
          this.selectedOption = this.userAnswers[this.currentPage - 1];
        } else {
          this.selectedOption = null;
        }
        // 这里可以加载新的问题内容
        console.log(`进入问题 ${this.currentPage}`);
      } else {
        // 最后一题完成后的处理
        console.log('当前已经是第一题了！');
      }
    },
    nextQuestion() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        // 设置当前页面的选中状态
        if (this.userAnswers[this.currentPage - 1]) {
          this.selectedOption = this.userAnswers[this.currentPage - 1];
        } else {
          this.selectedOption = null;
        }
        // 这里可以加载新的问题内容
        console.log(`进入问题 ${this.currentPage}`);
      } else {
        // 最后一题完成后的处理
        console.log('所有问题已完成');
        console.log('userAnswers:', this.userAnswers);
        console.log('测试题:', this.questions);
        console.log('简历文本:', this.resumeText);
        
        this.$router.push({
            path: '/generate-report',
            query: { 
              characteristicsTest: this.questions, 
              userAnswers: this.userAnswers, 
              resumeText: this.resumeText, 
            }
        });
      }
    },
  },
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
  background-color: white;
  margin-top: 10rem;
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
}

.tip-text {
  margin-top: 5rem;
  margin-bottom: 5rem;
  text-align: center;
  color: #999;
  padding-top: 5rem 0;
  font-size: 3rem;
}

.last-button-section {
  margin-top: -10rem;
  display: flex;
  justify-content: center;
  align-items: center; 
}

.next-button-section {
  margin-top: -20rem;
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
  background: #00F5D4;
  width: 40rem; 
  height: 7rem; 
  color: #333030;
  border: none;
  border-radius: 2.67rem; 
  font-size: 4rem; 
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 26rem;
}

.prev-btn {
  background: #aaa;
  color: white;
}

.next-btn {
  background: #00F5D4;
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