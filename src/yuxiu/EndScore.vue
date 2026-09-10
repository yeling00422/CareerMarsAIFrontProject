<template>
  <div class="control-page">
    <div class="bg-wrap">
      <div class="bg-grad"></div>
      <div class="gblob"></div>
      <div class="gblob"></div>
    </div>

    <div class="page">
      <div class="header">
        <div class="badge">✦ 毓秀杯 - 分数管理 ✦</div>
      </div>

      <div class="section">
        <!-- 表头：加了 最终得分 -->
        <div class="table-head">
          <div>选手名称</div>
          <div>专家评委</div>
          <div>大众评委</div>
          <div>最终得分</div>
          <div>操作</div>
        </div>

        <!-- 每行数据 + 编辑区 -->
        <div
          class="table-row-wrap"
          v-for="item in sortedList"
          :key="item.id"
        >
          <!-- 主行：5列网格 -->
          <div class="table-row">
            <div class="name">{{ item.name }}</div>
            <div>{{ item.expert || 0 }}</div>
            <div>{{ item.volkswagen || 0 }}</div>
            <div>{{ getFinalScore(item) }}</div>
            <div>
              <button class="btn-edit" @click="toggleEdit(item)">
                {{ editId === item.id ? '取消' : '修改' }}
              </button>
            </div>
          </div>

          <!-- 编辑区 -->
          <div class="edit-row" v-if="editId === item.id">
            <div class="edit-form">
              <div class="form-item">
                <label>专家评委总分</label>
                <input v-model.number="editForm.expert" type="number" class="inp">
              </div>
              <div class="form-item">
                <label>大众评委总分</label>
                <input v-model.number="editForm.volkswagen" type="number" class="inp">
              </div>
              <div class="action-row">
                <button class="abtn reset" @click="cancelEdit">取消</button>
                <button class="abtn go" @click="saveEdit">保存</button>
              </div>
            </div>
          </div>
        </div>

        <div class="empty" v-if="list.length === 0">暂无数据</div>
      </div>
    </div>

    <div class="statusbar">
      <div class="st-text">{{ msg }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { getAiURL } from '@/utils/index'

const api = axios.create({
  baseURL: getAiURL(),
  headers: { 'Content-Type': 'application/json' }
})

export default {
  data() {
    return {
      list: [],
      msg: '就绪',
      editId: null,
      editForm: {}
    }
  },
  mounted() {
    this.getList()
  },
  computed: {
    // 倒序排名（分数高 → 低）
    sortedList() {
      return [...this.list].sort((a, b) => {
        let scoreA = this.calcRawScore(a)
        let scoreB = this.calcRawScore(b)
        return scoreB - scoreA
      })
    }
  },
  methods: {
    // 计算原始分数（用于排序）
    calcRawScore(item) {
      let expert = Number(item.expert) || 0
      let user = Number(item.volkswagen) || 0
      if (!expert || !user) return -1
      return (expert / 5 + user / 10) / 2
    },

    // 页面显示：截断取整，不保留小数
    getFinalScore(item) {
      let expert = Number(item.expert)
      let user = Number(item.volkswagen)
      if (expert === -1 || user === -1) return '待打分'
      if (!expert || !user) return '待打分'
      let score = (expert / 5 + user / 10) / 2
      return Math.floor(score) // 截断，不取小数
    },

    async getList() {
      try {
        const res = await api.get('/ai/yxb/cureent/endScore')
        this.list = res.data.data || []
      } catch (e) {
        console.log(e)
      }
    },
    toggleEdit(item) {
      if (this.editId === item.id) {
        this.editId = null
        this.editForm = {}
      } else {
        this.editId = item.id
        this.editForm = { ...item }
      }
    },
    cancelEdit() {
      this.editId = null
      this.editForm = {}
    },
    async saveEdit() {
      try {
        await api.post('/ai/yxb/update/endScore', this.editForm)
        this.msg = '保存成功'
        this.getList()
        this.cancelEdit()
      } catch (e) {
        this.msg = '保存失败'
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>
.control-page {
  min-height: 100vh;
  background: #0F0A1E;
  color: #fff;
  padding: 20px;
  position: relative;
}
.bg-wrap { position: fixed; inset: 0; z-index: 0; }
.bg-grad {
  position: absolute; inset: 0;
  background: radial-gradient(rgba(168,85,247,.1), transparent), #0F0A1E;
}
.gblob {
  position: absolute; width: 300px; height: 300px;
  background: rgba(168,85,247,.2); border-radius: 50%; filter: blur(60px);
}
.gblob:nth-child(2) { top: -100px; left: -100px; }
.gblob:nth-child(3) { bottom: -100px; right: -100px; }

.page { position: relative; z-index: 1; }
.header { text-align: center; margin-bottom: 20px; }
.badge {
  font-size: 30px;
  display: inline-block; padding: 4px 16px; border-radius: 999px;
  background: rgba(168,85,247,.2); color: #C084FC;
}
.htitle {
  font-size: 26px; color: transparent;
  background: linear-gradient(90deg, #F0D27A, #FF8FAB, #C084FC);
  -webkit-background-clip: text;
}

.section {
  background: rgba(26,16,53,.9);
  border: 1px solid rgba(168,85,247,.2);
  border-radius: 16px; padding: 16px; margin-bottom: 16px;
}
.sec-title { color: #C084FC; margin-bottom: 12px; }

/* 关键：改成 5 列表格 */
.table-head,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 10px 0;
  text-align: center;
  align-items: center;
  font-size: 20px;
}
.table-head {
  font-weight: bold;
  color: #C084FC;
}
.table-row {
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.name { 
  text-align: center; 
  padding-left: 0; 
}

.btn-edit {
  background: #A855F7;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
}

.edit-row {
  padding: 14px;
  background: rgba(168,85,247,.1);
  border-radius: 10px;
  margin: 10px 0;
}
.edit-form {
  max-width: 380px;
  margin: 0 auto;
}
.form-item { margin-bottom: 10px; }
.form-item label { display: block; margin-bottom: 6px; font-size: 14px; }
.inp {
  width: 100%; box-sizing: border-box;
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(168,85,247,.3);
  border-radius: 10px; padding: 10px; color: #fff;
}

.action-row { display: flex; gap: 10px; margin-top: 10px; }
.abtn { flex: 1; padding: 10px; border-radius: 10px; border: none; }
.go { background: linear-gradient(90deg, #A855F7, #FF8FAB); color: #fff; }
.reset { background: rgba(255,255,255,.07); color: #fff; }

.empty { text-align: center; padding: 30px 0; color: #888; }

.statusbar {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: #100a1e; padding: 10px 20px;
  border-top: 1px solid rgba(168,85,247,.1);
  font-size: 12px; color: #C084FC;
}
</style>