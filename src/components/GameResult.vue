<template>
  <div class="result-overlay">
    <div class="result-container">
      <h1 class="title">游戏结束</h1>
      
      <div class="rank-display">
        <div class="rank" :class="rank.toLowerCase()">{{ rank }}</div>
      </div>
      
      <div class="score-section">
        <div class="final-score">
          <span class="label">最终得分</span>
          <span class="value">{{ stats.totalScore }}</span>
        </div>
        <div class="accuracy">
          <span class="label">准确率</span>
          <span class="value">{{ accuracy }}%</span>
        </div>
        <div class="max-combo">
          <span class="label">最大连击</span>
          <span class="value">{{ stats.maxCombo }}</span>
        </div>
      </div>
      
      <div class="judgement-stats">
        <div class="stat-item perfect">
          <span class="label">Perfect</span>
          <span class="value">{{ stats.perfect }}</span>
        </div>
        <div class="stat-item great">
          <span class="label">Great</span>
          <span class="value">{{ stats.great }}</span>
        </div>
        <div class="stat-item good">
          <span class="label">Good</span>
          <span class="value">{{ stats.good }}</span>
        </div>
        <div class="stat-item miss">
          <span class="label">Miss</span>
          <span class="value">{{ stats.miss }}</span>
        </div>
      </div>
      
      <div v-if="isNewRecord" class="new-record">
        🎉 新纪录!
      </div>
      
      <div class="actions">
        <button class="btn-retry" @click="$emit('retry')">
          重新挑战
        </button>
        <button class="btn-back" @click="$emit('back')">
          返回选歌
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameResult',
  props: {
    stats: {
      type: Object,
      required: true,
    },
    accuracy: {
      type: String,
      required: true,
    },
    rank: {
      type: String,
      required: true,
    },
    songId: {
      type: String,
      required: true,
    },
  },
  computed: {
    isNewRecord() {
      const oldHighScore = localStorage.getItem(`highscore_${this.songId}`);
      return !oldHighScore || this.stats.totalScore > parseInt(oldHighScore);
    },
  },
  mounted() {
    // 保存最高分
    const oldHighScore = localStorage.getItem(`highscore_${this.songId}`);
    if (!oldHighScore || this.stats.totalScore > parseInt(oldHighScore)) {
      localStorage.setItem(`highscore_${this.songId}`, this.stats.totalScore);
    }
  },
};
</script>

<style scoped>
.result-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 14, 39, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.result-container {
  width: 90%;
  max-width: 600px;
  padding: 40px;
  text-align: center;
}

.title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 30px;
  color: #fff;
}

.rank-display {
  margin-bottom: 40px;
}

.rank {
  display: inline-block;
  width: 120px;
  height: 120px;
  line-height: 120px;
  font-size: 72px;
  font-weight: 900;
  border-radius: 50%;
  animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.rank.s {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;
  box-shadow: 0 0 40px rgba(240, 147, 251, 0.6);
}

.rank.a {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 0 40px rgba(102, 126, 234, 0.6);
}

.rank.b {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
  box-shadow: 0 0 40px rgba(79, 172, 254, 0.6);
}

.rank.c {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #fff;
  box-shadow: 0 0 40px rgba(67, 233, 123, 0.6);
}

.rank.d {
  background: linear-gradient(135deg, #999 0%, #666 100%);
  color: #fff;
  box-shadow: 0 0 40px rgba(153, 153, 153, 0.6);
}

.score-section {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
  gap: 20px;
}

.final-score,
.accuracy,
.max-combo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.score-section .label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
}

.score-section .value {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
}

.judgement-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 30px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-item .label {
  font-size: 16px;
  font-weight: 600;
}

.stat-item .value {
  font-size: 24px;
  font-weight: 700;
}

.stat-item.perfect {
  border: 2px solid #f093fb;
}

.stat-item.perfect .label {
  color: #f093fb;
}

.stat-item.great {
  border: 2px solid #667eea;
}

.stat-item.great .label {
  color: #667eea;
}

.stat-item.good {
  border: 2px solid #4facfe;
}

.stat-item.good .label {
  color: #4facfe;
}

.stat-item.miss {
  border: 2px solid #999;
}

.stat-item.miss .label {
  color: #999;
}

.new-record {
  font-size: 24px;
  font-weight: 700;
  color: #f093fb;
  margin-bottom: 30px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn-retry,
.btn-back {
  padding: 14px 32px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-retry {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 48px rgba(102, 126, 234, 0.4);
}

.btn-back {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}
</style>
