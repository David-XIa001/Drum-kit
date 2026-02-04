<template>
  <div class="song-select-overlay">
    <div class="song-select-container">
      <h1 class="title">选择歌曲</h1>
      
      <div class="song-list">
        <div
          v-for="(song, index) in songs"
          :key="song.id"
          :class="['song-card', { active: selectedIndex === index }]"
          @click="selectSong(index)"
        >
          <div class="song-info">
            <h2 class="song-title">{{ song.title }}</h2>
            <p class="song-artist">{{ song.artist }}</p>
            <div class="song-meta">
              <span class="difficulty" :class="song.difficulty.toLowerCase()">
                {{ song.difficulty }}
              </span>
              <span class="bpm">{{ song.bpm }} BPM</span>
              <span class="duration">{{ formatDuration(song.duration) }}</span>
            </div>
          </div>
          <div class="song-stats">
            <div class="high-score">
              <span class="label">最高分</span>
              <span class="value">{{ getHighScore(song.id) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 游戏设置面板 -->
      <div class="settings-panel">
          <div class="setting-group">
              <label>速度 (Speed)</label>
              <div class="speed-options">
                  <button :class="{ active: selectedSpeed === 1.0 }" @click="setSpeed(1.0)">1.0x</button>
                  <button :class="{ active: selectedSpeed === 1.5 }" @click="setSpeed(1.5)">1.5x</button>
                  <button :class="{ active: selectedSpeed === 2.0 }" @click="setSpeed(2.0)">2.0x</button>
                  <button :class="{ active: selectedSpeed === 3.0 }" @click="setSpeed(3.0)">3.0x</button>
              </div>
          </div>
          
          <div class="setting-group">
              <label>模式 (Mode)</label>
              <div class="mode-toggle" @click="togglePractice" :class="{ active: isPracticeMode }">
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                  <span class="mode-label">{{ isPracticeMode ? '练习模式 (Practice)' : '普通模式 (Normal)' }}</span>
              </div>
          </div>
      </div>
      
      <div class="actions">
        <button class="btn-start" @click="startGame" :disabled="selectedIndex === null">
          开始游戏
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SongSelect',
  props: {
    songs: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedIndex: 0,
      selectedSpeed: 2, // 默认速度倍率 (noteSpeed = 2 * multiplier)
      isPracticeMode: false,
    };
  },
  methods: {
    selectSong(index) {
      this.selectedIndex = index;
    },
    startGame() {
      if (this.selectedIndex !== null) {
        this.$emit('start', {
            song: this.songs[this.selectedIndex],
            speed: this.selectedSpeed,
            mode: this.isPracticeMode ? 'practice' : 'normal'
        });
      }
    },
    togglePractice() {
        this.isPracticeMode = !this.isPracticeMode;
    },
    setSpeed(speed) {
        this.selectedSpeed = speed;
    },
    formatDuration(ms) {
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    getHighScore(songId) {
      const saved = localStorage.getItem(`highscore_${songId}`);
      return saved ? parseInt(saved) : 0;
    },
  },
};
</script>

<style scoped>
.song-select-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.song-select-container {
  width: 90%;
  max-width: 800px;
  padding: 40px;
}

.title {
  font-size: 48px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.song-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 10px;
}

.song-list::-webkit-scrollbar {
  width: 8px;
}

.song-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.song-list::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.5);
  border-radius: 4px;
}

.song-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.song-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
}

.song-card.active {
  background: rgba(102, 126, 234, 0.15);
  border-color: #667eea;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.song-info {
  flex: 1;
}

.song-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #fff;
}

.song-artist {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 16px 0;
}

.song-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
}

.difficulty {
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.difficulty.easy {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.difficulty.medium {
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
}

.difficulty.hard {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.bpm,
.duration {
  color: rgba(255, 255, 255, 0.7);
}

.song-stats {
  text-align: right;
}

.high-score {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.high-score .label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
}

.high-score .value {
  font-size: 24px;
  font-weight: 700;
  color: #f093fb;
}

.actions {
  display: flex;
  justify-content: center;
}

.btn-start {
  padding: 16px 48px;
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.btn-start:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 48px rgba(102, 126, 234, 0.4);
}

.btn-start:active:not(:disabled) {
  transform: translateY(0);
}

.btn-start:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 设置面板 */
.settings-panel {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-around;
    gap: 20px;
}

.setting-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.setting-group label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
}

.speed-options {
    display: flex;
    gap: 8px;
}

.speed-options button {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.speed-options button:hover {
    background: rgba(255, 255, 255, 0.2);
}

.speed-options button.active {
    background: #667eea;
    border-color: #667eea;
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
}

/* 模式切换 */
.mode-toggle {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    transition: all 0.2s;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.mode-toggle:hover {
    background: rgba(255, 255, 255, 0.2);
}

.mode-toggle.active {
    background: rgba(76, 175, 80, 0.2);
    border-color: #4caf50;
}

.mode-label {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
}

.mode-toggle.active .mode-label {
    color: #66bb6a;
}
</style>
