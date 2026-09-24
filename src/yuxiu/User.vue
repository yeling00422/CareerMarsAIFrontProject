<template>
  <div class="control-page">
    <div class="bg-wrap">
      <div class="bg-grad"></div>
    </div>
    <div class="page">
      <div class="header">
        <div class="htitle">毓秀杯-第二期 · 人气榜</div>
        <div class="htip">请给中意的选手投上一票吧～</div>
        <div class="tip-info">
          
        </div>
        <div class="user-info">
          <div class="user-head-img">
            <img :src="this.userData.headImg" alt="用户头像" />
          </div>
          <div class="user-nick-name">{{ this.userData.nickName }}</div>
          <div class="user-vote-count">剩余票数：{{ this.userData.voteCount }}</div>
        </div>
      </div>
      <div class="vote-info">
        <div class="vote-item" v-for="(item, index) in voteList" :key="index">
          <div class="vote-item-head">
            <img :src="item.headImage" alt="选手头像" />
          </div>
          <div class="vote-item-text">
            <div class="vote-item-group">{{ item.groupName }}</div>
            <div class="vote-item-name">{{ item.name }}</div>
            <div class="vote-item-work">《{{ item.work }}》</div>
          </div>
          <div class="vote-item-number">{{ item.voteNumber }}</div>
          <button class="abtn-vote" @click="updateVote(index)">投票</button>
        </div>
      </div>
      <div class="vote=record">
        <div class="vote-record-title">投票记录</div>
        <div class="vote-record-list">
          <div class="vote-record-item" v-for="(item, index) in voteRecordList" :key="index">
            <div>{{ item.userName + '在' + item.createTime + '投票给了' + item.voteName }}</div>
         </div>
        </div>
      </div>
      <div class="bullet-screen-wrap">
        <div class="bullet-screen-list">
        </div>
      </div>
      <div class="bullet-screen">
        <input class="bullet-screen-input" type="text" v-model="danmu" placeholder="请输入弹幕内容">
     </div>
      <div class="action-row">
        <button class="abtn-go" @click="send">✦发送弹幕</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getAiURL } from '@/utils/index';

const api = axios.create({
  baseURL: getAiURL(),
  headers: { 'Content-Type': 'application/json' },
});

export default {
  name: 'User',
  data() {
    return {
      voteList: [],
      voteRecordList:[],
      timer: null,
      danmu: '',
      userData: null,
      // userData: {
      //   id: "2102698336288018433",
      //   openId: "ogAEl6ebh5ExGB3kX-82PtdJvAIg",
      //   unionId: "oKz8N603alPlxYoAws-PhqohD5k0",
      //   nickName: "叶陵",
      //   headImg: "https://thirdwx.qlogo.cn/mmopen/vi_32/NfSUuFVlu2dSwO1let2MTGTtjU46AoUHrQuLy9icQeg8s0ExJTaYgGH0bwxIOt5EibgGCpeOhU04a7B4Yuw99VrKjuKh3vJlmJTRnkqU05l3I/132",
      //   sex: 0,
      //   provice: "",
      //   city: "",
      //   country: "",
      //   voteCount: 3,
      //   createTime: "2026-09-23T17:55:24",
      //   updateTime: "2026-09-23T17:55:24"
      // },
    }
  },
  mounted() {
    this.getVoteList()
    this.startPolling()
  },
  methods: {
    startPolling() {
      if(this.timer) clearInterval(this.timer)
      this.timer = setInterval(()=>{
        this.getVoteList();
        this.getVoteRecordList();
      }, 10000) 
    },
    stopPolling() {
      if(this.timer){
        clearInterval(this.timer)
        this.timer = null
      }
    },
    beforeDestroy() {
      this.stopPolling()
    },
    async getVoteList() {
     try {
        if(this.userData == null){
          this.userData = this.$route.params.userData;
          console.log('userData',this.userData)
        }
        const { data } = await api.get('/ai/yxb/current/vote');
        if (Array.isArray(data.data)) {
          const filtered = data.data;
          this.voteList = filtered.sort((a, b) => {
            const sa = a.voteNumber === -1 ? -999 : a.voteNumber;
            const sb = b.voteNumber === -1 ? -999 : b.voteNumber;
            return sb - sa;
          }).map((item, realIndex)=>{
            return {
              ...item,
              realRank: realIndex + 1
            }
          });
          this.voteListOffset = 0;
        }
      } catch (e) {}
    },
    async getVoteRecordList() {
     try {
        const res = await api.get('/ai/yxb/current/vote/record');
        const result = res.data;
        if(result.code == 200){
          this.voteRecordList = result.data;
        }else{
          alert(result.msg)
        }
      } catch (e) {}
    },
    async updateVote(index) {
      try {
        const req = {
          item: this.voteList[index],
          userDate: this.userData
        }
        const res = await api.post('/ai/yxb/update/vote',req)
        const result = res.data;
        console.log('result',result)
        if (result.code === 200) {
          this.userData = result.data;
          alert('投票成功!')
          this.getVoteList()
        }else{
          alert(result.msg)
        }
      } catch (e) {
          alert(result.msg)
      }
    },
    send(){

    }
  }
}
</script>

<style scoped>

.user-vote-count{
  font-size: 20px;
  color: #FEDA45;
}
.user-head-img {
  width: 50px;
  height: 50px;
  margin: 5px auto;
}

.user-head-img img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #FEDA45;
}
.user-nick-name{
  text-align: center;
  font-size: 20px;
  color: #FEDA45;
}

.control-page {
  padding: 15px;
  position: relative;
  z-index: 1;
}
.bg-wrap {
  position: fixed;
  inset: 0;
}
.bg-grad {
  position: absolute;
  inset: 0;
  background-image: url('../assets/img/毓秀杯背景.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.page {
  position: relative;
  z-index: 2;
}
.header {
  text-align: center;
  margin-top: -10px;
}
.badge {
  display:flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: 200px;
  height: 40px;
  font-size: 20px;
  color: #000;
  margin-bottom: 10px;
  background: #FEDC57;
  border-radius: 40px;
}
.htitle {
  font-size: 25px;
  color: #FEDA45;
  letter-spacing: 1px;
  font-weight: bold;
  margin-bottom: 10px;
}

.htip{
  font-size: 15px;
  color: #fff;
  font-weight: 100;
}

.vote-info {
  background: #21172D;
  border: 2px solid #DBA612;
  border-radius: 25px;
  margin-bottom: 20px;
  min-height: 250px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding:20px 0px;
}

.vote-item {
  width: calc(50% - 20px);
  min-width: 120px;
  text-align: center;
  color: #fff;
  font-size: 15px;
}

.vote-item-head {
  width: 100px;
  height: 100px;
  margin: 15px auto;
}

.vote-item-head img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #FEDA45;
}

.vote-item-text {
  min-height: 100px;
}

.vote-item-group {
  font-size: 15px;
  margin-bottom: 6px;
}

.vote-item-name {
  font-size: 15px;
  margin-bottom: 6px;
}

.vote-item-work {
  font-size: 14px;
  line-height: 1.3;
  margin-bottom: 4px;
}

.vote-item-number {
  color: #FEDA45;
  font-size: 24px;
  margin: 10px 0 8px;
}

.abtn-vote {
  border-radius: 20px;
  background: #FEDA45;
  border: none;
  padding: 5px 14px;
  font-size: 14px;
  font-weight: bold;
  color: #000;
  width: 80px;
  margin: 0 auto 10px;
  align-self: center;
}


.bullet-screen {
  background: #21172D;
  border: 2px solid  #DBA612;
  border-radius: 25px;
  margin-bottom: 20px;
}

.bullet-screen-input{
  width: 99%;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 25px;
  color: #DBA612;
  text-align: center;
}

.action-row { 
  display: flex; 
  gap: 10px; 
  margin-bottom: 20px;
}

.abtn-go { 
  flex: 1; 
  padding: 14px; 
  border: none; 
  border-radius: 50px; 
  font-size: 18px; 
  font-weight: bold; 
  background: #F3D356;
  border: 2px solid  #DBA612;
  color: #000; 
}


.vote-record {
  background: #21172D;
  border: 2px solid #DBA612;
  border-radius: 25px;
  margin-bottom: 20px;
  padding: 20px;
}
.vote-record-title {
  font-size: 22px;
  color: #FEDA45;
  text-align: center;
  margin-bottom: 16px;
  font-weight: bold;
}
.vote-record-list {
  max-height: 180px;
  overflow-y: auto;
}
.vote-record-item {
  color: #fff;
  font-size: 15px;
  padding: 8px 0;
  text-align: center;
  border-bottom: 1px solid rgba(254, 218, 69, 0.2);
}
/* 滚动条美化，适配深色背景 */
.vote-record-list::-webkit-scrollbar {
  width: 4px;
}
.vote-record-list::-webkit-scrollbar-thumb {
  background-color: #FEDA45;
  border-radius: 4px;
}
.vote-record-list::-webkit-scrollbar-track {
  background: transparent;
}

</style>