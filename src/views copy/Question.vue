<template>
  <div class="home-container">
    <!-- 顶部固定栏 -->
    <div class="head-container">
      <img src="../assets/img/上面固定栏.png" class="logo" alt="CareerMars"/>
    </div>

    <!-- 页面指示器 -->
    <!-- <div class="page-indicator">
      <div 
        v-for="(dot, index) in totalPages" 
        :key="index"
        :class="['indicator-dot', { active: currentPage === index + 1 }]"
      ></div>
    </div> -->
    
    <!-- 问题编号 -->
    <div class="question-number">问题 {{ currentPage }} / {{ totalPages }}</div>
    
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
      <button class="free-analysis-btn" @click="lastQuestion">上一题</button>
      <span class="iconfont icon-sanjiaoxing icon-arrow-left"></span>
    </div>

    <div class="next-button-section" :class="{ hidden: selectedOption === null }">
      <button class="free-analysis-btn" @click="nextQuestion">{{ currentPage !== totalPages ? '下一题' : '提交' }}</button>
      <span class="iconfont icon-sanjiaoxing icon-arrow-right" ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuditQuestion',
  data() {
    return {
      selectedOption: null,
      currentPage: 1,
      // progressWidth: '33.33%',
      // questions:[],
      trueAnswer : 0,
      userAnswers: [], // 新增：记录用户每道题的答案
      expectationPosition: '', // 新增：记录用户每道题的答案
      resume: '', // 新增：记录用户每道题的答案
      questions: [
        {
          "content": "在开发一个高并发的电商平台时，多个用户同时对同一商品进行下单操作，如何使用Java技术保证库存扣减的准确性？请结合synchronized、ReentrantLock或数据库乐观锁/悲观锁等机制说明实现方案。",
          "answer": "D",
          "options": [
            {
              "option": "A",
              "text": "使用synchronized关键字对库存扣减方法加锁，确保同一时间只有一个线程可以执行扣减逻辑。"
            },
            {
              "option": "B",
              "text": "采用ReentrantLock实现可重入锁，并结合tryLock避免线程阻塞过久，提升系统响应性能。"
            },
            {
              "option": "C",
              "text": "使用数据库乐观锁（如version字段），在更新时判断版本是否一致，防止超卖，适用于并发不极高的场景。"
            },
            {
              "option": "D",
              "text": "结合Redis分布式锁控制库存扣减入口，再通过数据库悲观锁（SELECT FOR UPDATE）落库，保障强一致性。"
            }
          ]
        },
        {
          "content": "你在维护一个基于Spring Boot的微服务系统时，发现某个接口响应时间突然变慢。你会如何定位和解决该性能问题？",
          "answer": "B",
          "options": [
            {
              "option": "A",
              "text": "查看日志文件，确认是否有异常堆栈或慢SQL记录，针对性修复。"
            },
            {
              "option": "B",
              "text": "使用APM工具（如SkyWalking或Pinpoint）追踪链路，定位耗时瓶颈在哪个服务或方法。"
            },
            {
              "option": "C",
              "text": "登录服务器使用jstat、jstack、jmap等JVM命令分析GC情况和线程状态，排查内存泄漏或死锁。"
            },
            {
              "option": "D",
              "text": "结合数据库执行计划分析慢查询，优化索引或SQL语句，并引入缓存减少数据库压力。"
            }
          ]
        },
        {
          "content": "在一个分布式系统中，如何保证多个服务间的数据最终一致性？请从Java技术栈角度阐述可行方案。",
          "answer": "B",
          "options": [
            {
              "option": "A",
              "text": "通过本地事务表+定时任务扫描未完成消息，配合RocketMQ事务消息实现可靠事件投递。"
            },
            {
              "option": "B",
              "text": "使用Seata框架实现TCC模式，将业务逻辑拆分为Try、Confirm、Cancel三个阶段，保证跨服务一致性。"
            },
            {
              "option": "C",
              "text": "采用Spring Cloud Stream结合消息队列（如Kafka），发布事件并由消费者异步处理，实现最终一致性。"
            },
            {
              "option": "D",
              "text": "所有服务调用均使用同步Feign接口调用，确保每一步都成功提交，避免数据不一致。"
            }
          ]
        },
        {
          "content": "在开发一个高并发的电商平台时，多个用户同时对同一商品进行下单操作，如何使用Java技术保证库存扣减的准确性？请结合synchronized、ReentrantLock或数据库乐观锁/悲观锁等机制说明实现方案。",
          "answer": "D",
          "options": [
            {
              "option": "A",
              "text": "使用synchronized关键字对库存扣减方法加锁，确保同一时间只有一个线程可以执行扣减逻辑。"
            },
            {
              "option": "B",
              "text": "采用ReentrantLock实现可重入锁，并结合tryLock避免线程阻塞过久，提升系统响应性能。"
            },
            {
              "option": "C",
              "text": "使用数据库乐观锁（如version字段），在更新时判断版本是否一致，防止超卖，适用于并发不极高的场景。"
            },
            {
              "option": "D",
              "text": "结合Redis分布式锁控制库存扣减入口，再通过数据库悲观锁（SELECT FOR UPDATE）落库，保障强一致性。"
            }
          ]
        },
        {
          "content": "你在维护一个基于Spring Boot的微服务系统时，发现某个接口响应时间突然变慢。你会如何定位和解决该性能问题？",
          "answer": "B",
          "options": [
            {
              "option": "A",
              "text": "查看日志文件，确认是否有异常堆栈或慢SQL记录，针对性修复。"
            },
            {
              "option": "B",
              "text": "使用APM工具（如SkyWalking或Pinpoint）追踪链路，定位耗时瓶颈在哪个服务或方法。"
            },
            {
              "option": "C",
              "text": "登录服务器使用jstat、jstack、jmap等JVM命令分析GC情况和线程状态，排查内存泄漏或死锁。"
            },
            {
              "option": "D",
              "text": "结合数据库执行计划分析慢查询，优化索引或SQL语句，并引入缓存减少数据库压力。"
            }
          ]
        }
      ],
      
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
      // 从路由参数中获取数据
      const generateQuestion = this.$route.query.generateQuestion;// 将数据转为字符串传递
      this.expectationPosition = this.$route.query.expectationPosition;// 将数据转为字符串传递
      this.resume = this.$route.query.resume;// 将数据转为字符串传递
      console.log("question-generateQuestion:",generateQuestion);
      console.log("question-expectationPosition:",this.expectationPosition);
      console.log("question-resume:",this.resume);
      if (generateQuestion) {
        try {
          // 解析数据
          const parsedData = JSON.parse(generateQuestion);
          // 提取外层的 questions 数组
          this.questions = parsedData.questions;
          console.log("questions", this.questions);
          console.log("题目数量:", this.questions.length);
        } catch (error) {
          console.error('解析匹配数据失败:', error);
          alert('数据加载失败，请重新尝试');
          this.$router.push('/');
        }
      } else {
        // 如果没有数据，直接跳转回首页
        alert('未找到匹配数据，请重新分析');
        this.$router.push('/');
      }
    },
    getCurrentQuestionContent() {
      const currentQuestion = this.questions[this.currentPage - 1];
      return currentQuestion ? currentQuestion.content : '';
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
        // this.selectedOption = null;
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
        this.calculateScore();
        // 准备跳转数据
        const data = {
          score: this.trueAnswer,
          totalQuestions: this.questions.length,
          userAnswers: this.userAnswers,
          correctAnswers: this.questions.map(q => q.answer)
        };
        console.log('答题结果:', data);


        
        // const data = {
        //   score = this.score,
        // };
        const eachQuestionScore = Math.floor(100 / this.questions.length);
        const score = eachQuestionScore*this.trueAnswer;
        console.log('得分:', score);
        this.$router.push({
            path: '/analysis-question',
            query: { 
              score: JSON.stringify(score), 
              expectationPosition: this.expectationPosition, 
              resume: this.resume, 
            }
        });
      }
    },
    calculateScore() {
      this.trueAnswer = 0; // 重置得分
      
      // 遍历所有题目，比较用户答案和正确答案
      this.questions.forEach((question, index) => {
        const userAnswer = this.userAnswers[index];
        if (userAnswer && userAnswer === question.answer) {
          this.trueAnswer++;
        }
      });
      
      console.log(`答对题数: ${this.trueAnswer}`);
    },
  },
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.question-number {
  text-align: center;
  color: #333;
  padding-top: 5rem;
  padding-bottom: 4rem;
  font-size: 5rem;
  font-weight: bold;
  background-color: white;
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
  margin-top: -20rem;
  margin-left: 5rem;
  display: flex;
  align-items: center; 
  flex-direction: column;
}

.next-button-section {
  margin-top: -25rem;
  margin-bottom: 10rem;
  margin-left: 5rem;
  display: flex;
  align-items: center; 
  flex-direction: column;
}

.icon-sanjiaoxing {
  position: relative;
  color: #333030;
  top: -4.8rem;
  left: 4rem;
  font-size: 3rem;
}

.icon-arrow-left{
  transform: rotate(180deg);
}

.free-analysis-btn {
  background: #00F5D4;
  width: 60rem; 
  height: 7rem; 
  color: #333030;
  border: none;
  border-radius: 2.67rem; 
  font-size: 4rem; 
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: -10rem; 
  margin-top: 26rem;
}

.hidden {
  opacity: 0;
  visibility: hidden;
  height: 0;
  padding: 0;
  margin: 0;
}
</style>