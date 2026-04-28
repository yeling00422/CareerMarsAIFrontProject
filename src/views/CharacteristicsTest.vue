<template>
  <div class="characteristicsTest-page">
    <div class="question-number">
      性格测试 <span class="num-highlight">{{ currentPage }}</span> / {{ totalPages }}
    </div>

    <div class="progress-track">
      <div class="progress-fill-bar" :style="{ width: (currentPage / totalPages * 100) + '%' }"></div>
    </div>

    <div class="question-card" :key="'card-' + currentPage">
      <span class="corner tl"></span><span class="corner tr"></span>
      <span class="corner bl"></span><span class="corner br"></span>
      {{ getCurrentQuestionContent() }}
    </div>

    <div class="options-container" :key="'opts-' + currentPage">
      <div
        v-for="(option, index) in getCurrentQuestionOptions()"
        :key="index"
        :class="['option', { selected: selectedOption === option.option }]"
        :style="{ animationDelay: (index * 0.07) + 's' }"
        @click="selectOption(option.option)"
      >
        <div class="option-letter">{{ option.option }}</div>
        <div class="option-content">{{ option.text }}</div>
        <span class="option-check iconfont icon-zhengque" v-show="selectedOption === option.option"></span>
      </div>
    </div>

    <div class="tip-text" v-show="selectedOption === null">提示：选择最符合你想法的答案</div>

    <div class="button-section">
      <button class="free-analysis-btn next-btn" @click="nextQuestion">
        {{ currentPage !== totalPages ? '下一题' : '提交' }}<span class="iconfont icon-sanjiaoxing"></span>
      </button>
      <button class="free-analysis-btn prev-btn" @click="lastQuestion">
        <span class="iconfont icon-sanjiaoxing icon-arrow-left"></span>上一题
      </button>
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
      userAnswers: [],
      resumeText: '',
      questions: [],
    };
  },
  computed: {
    totalPages() { return this.questions.length; }
  },
  created() {
    this.loadQuestionData();
  },
  methods: {
    loadQuestionData() {
      var characteristicsTest = this.$route.query.characteristicsTest;
      this.resumeText = this.$route.query.resumeText;
      if (characteristicsTest) {
        try {
          var parsedData = JSON.parse(characteristicsTest);
          this.questions = parsedData.questions;
        } catch (e) {
          alert('数据加载失败，请重新尝试');
          this.$router.push('/');
        }
      } else {
        alert('未找到匹配数据，请重新分析');
        this.$router.push('/');
      }
    },

    getCurrentQuestionContent() {
      var q = this.questions[this.currentPage - 1];
      return q ? q.title : '';
    },

    getCurrentQuestionOptions() {
      var q = this.questions[this.currentPage - 1];
      return q ? q.options : [];
    },

    selectOption(value) {
      this.selectedOption = value;
      this.userAnswers[this.currentPage - 1] = value;
    },

    lastQuestion() {
      if (this.currentPage === 1) {
        alert('已经是第一题了', '提示', { confirmButtonText: '确定' });
        return;
      }
      this.currentPage--;
      this.selectedOption = this.userAnswers[this.currentPage - 1] || null;
    },

    nextQuestion() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.selectedOption = this.userAnswers[this.currentPage - 1] || null;
      } else {
        var unanswered = [];
        for (var i = 0; i < this.questions.length; i++) {
          if (!this.userAnswers[i]) unanswered.push(i + 1);
        }
        if (unanswered.length > 0) {
          alert('以下题目未作答：第 ' + unanswered.join('、') + ' 题', '请完成所有题目', { confirmButtonText: '确定' });
          return;
        }
        console.log('用户答案：', this.userAnswers);
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
};
</script>

<style scoped>
@keyframes floatBubble {
  0%   { transform: translateY(0) scale(1); opacity: 0.6; }
  50%  { opacity: 0.2; }
  100% { transform: translateY(-120vh) scale(0.3); opacity: 0; }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(3rem); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-3rem); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes scanLine {
  0%   { top: -5%; opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 0.6; }
  100% { top: 105%; opacity: 0; }
}
@keyframes borderPulse {
  0%, 100% { border-color: rgba(0, 245, 212, 0.3); box-shadow: 0 0 1rem rgba(0,245,212,0.1); }
  50%       { border-color: rgba(0, 245, 212, 0.9); box-shadow: 0 0 4rem rgba(0,245,212,0.4); }
}
@keyframes progressShimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.particle {
  position: absolute;
  bottom: -5rem;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 245, 212, 0.8), rgba(0, 245, 212, 0.1));
  animation: floatBubble linear infinite;
}
.p1 { width:1.5rem; height:1.5rem; left:5%;  animation-duration:8s;  animation-delay:0s; }
.p2 { width:2rem;   height:2rem;   left:18%; animation-duration:10s; animation-delay:1.5s; }
.p3 { width:1rem;   height:1rem;   left:30%; animation-duration:7s;  animation-delay:3s; }
.p4 { width:2.5rem; height:2.5rem; left:45%; animation-duration:9s;  animation-delay:0.8s; }
.p5 { width:1.5rem; height:1.5rem; left:60%; animation-duration:11s; animation-delay:2s; }
.p6 { width:2rem;   height:2rem;   left:72%; animation-duration:8s;  animation-delay:4s; }
.p7 { width:1rem;   height:1rem;   left:83%; animation-duration:6s;  animation-delay:1s; }
.p8 { width:3rem;   height:3rem;   left:92%; animation-duration:12s; animation-delay:2.5s; }

.question-number {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #333;
  padding-top: 5rem;
  padding-bottom: 2rem;
  font-size: 5rem;
  font-weight: bold;
  background-color: white;
  margin-top: 10rem;
  animation: fadeInUp 0.5s ease both;
}
.num-highlight { color: #00F5D4; font-size: 6rem; }

.progress-track {
  position: relative;
  z-index: 1;
  width: 70rem;
  height: 0.8rem;
  background: rgba(0,0,0,0.1);
  border-radius: 1rem;
  margin: 0 auto 3rem;
  overflow: hidden;
}
.progress-fill-bar {
  height: 100%;
  background: linear-gradient(90deg, #00F5D4, #00c9aa, #00F5D4);
  background-size: 200% auto;
  border-radius: 1rem;
  transition: width 0.5s ease;
  animation: progressShimmer 2s linear infinite;
}

.question-card {
  position: relative;
  z-index: 1;
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
  border: 0.3rem solid rgba(0, 245, 212, 0.3);
  animation: fadeInUp 0.5s ease 0.1s both, borderPulse 3s ease-in-out infinite;
  overflow: hidden;
}
.question-card::after {
  content: '';
  position: absolute;
  left: 0;
  top: -5%;
  width: 100%;
  height: 0.3rem;
  background: linear-gradient(90deg, transparent, rgba(0, 245, 212, 0.9), transparent);
  animation: scanLine 4s ease-in-out infinite;
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 2rem;
  height: 2rem;
  border-color: #00F5D4;
  border-style: solid;
}
.corner.tl { top: 1rem; left: 1rem; border-width: 0.4rem 0 0 0.4rem; }
.corner.tr { top: 1rem; right: 1rem; border-width: 0.4rem 0.4rem 0 0; }
.corner.bl { bottom: 1rem; left: 1rem; border-width: 0 0 0.4rem 0.4rem; }
.corner.br { bottom: 1rem; right: 1rem; border-width: 0 0.4rem 0.4rem 0; }

.options-container {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 0 5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;
}

.option {
  position: relative;
  background-color: #7a7d85;
  border-radius: 2rem;
  padding: 3rem;
  color: white;
  font-size: 3rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
  height: auto;
  min-height: 5rem;
  border: 0.15rem solid rgba(255,255,255,0.1);
  animation: slideInLeft 0.35s ease both;
  overflow: hidden;
}
.option::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0.3rem;
  background: #00F5D4;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.option:hover {
  transform: translateX(0.6rem);
  background-color: #888c96;
  box-shadow: 0 0 1.5rem rgba(0, 245, 212, 0.25);
  border-color: rgba(0, 245, 212, 0.4);
}
.option:hover::before { opacity: 1; }

.option.selected {
  border-color: #00F5D4;
  background-color: #555a66;
  box-shadow: 0 0 2.5rem rgba(0, 245, 212, 0.5), inset 0 0 1rem rgba(0,245,212,0.1);
}
.option.selected::before { opacity: 1; }

.option-letter {
  width: 6rem;
  height: 6rem;
  background-color: rgba(255,255,255,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 2rem;
  font-weight: bold;
  flex-shrink: 0;
  font-size: 4rem;
  border: 0.2rem solid rgba(255,255,255,0.2);
  transition: background-color 0.2s ease, border-color 0.2s ease;
}
.option.selected .option-letter {
  background-color: #00F5D4;
  border-color: #00F5D4;
  color: #333;
}

.option-content { flex: 1; line-height: 1.4; }

.option-check {
  font-size: 4rem;
  color: #00F5D4;
  flex-shrink: 0;
}

.tip-text {
  position: relative;
  z-index: 1;
  margin-top: 5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #999;
  font-size: 3rem;
}

.button-section {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  margin: 4rem 0 12rem;
}

.icon-sanjiaoxing { position: relative; color: #FFD700; margin-left: 1rem; font-size: 3.5rem; }
.icon-arrow-left { display: inline-block; transform: rotate(180deg); color: #FFD700; margin-left: 0; margin-right: 1rem; }

.free-analysis-btn {
  width: 60rem;
  height: 10rem;
  border: none;
  border-radius: 2.67rem;
  font-size: 4rem;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}
.free-analysis-btn:hover { transform: translateY(-0.4rem); }
.free-analysis-btn:active { transform: scale(0.96); }

.prev-btn {
  background: linear-gradient(135deg, #6a6a6a, #888);
  color: white;
  border: 0.2rem solid rgba(255,255,255,0.2);
}
.prev-btn:hover { box-shadow: 0 0 1.5rem rgba(255,255,255,0.2); }

.next-btn {
  background: linear-gradient(90deg, #00F5D4, #00c9aa, #00F5D4);
  background-size: 200% auto;
  color: #222;
  font-weight: bold;
  animation: shimmer 2.5s linear infinite;
}
.next-btn:hover { box-shadow: 0 0 3rem rgba(0, 245, 212, 0.7); }
</style>
