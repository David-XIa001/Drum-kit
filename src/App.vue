<template>
  <!-- 歌曲选择界面 -->
  <SongSelect
    v-if="gameState === 'select'"
    :songs="songs"
    @start="onGameStart"
  />
  
  <!-- 游戏主界面 -->
  <div v-else-if="gameState === 'playing' || gameState === 'paused'" class="game-container">
    <!-- 粒子特效 -->
    <ParticleEffect ref="particleEffect" />
    
    <!-- 顶部信息栏 -->
    <div class="top-bar">
      <div class="song-info">
        <h2 class="song-title">{{ currentSong.title }}</h2>
        <p class="song-difficulty">{{ currentSong.difficulty }}</p>
      </div>
      <div class="game-stats">
        <div class="stat">
          <span class="label">分数</span>
          <span class="value">{{ judgementSystem.stats.totalScore }}</span>
        </div>
        <div class="stat">
          <span class="label">连击</span>
          <span class="value combo">{{ judgementSystem.stats.combo }}</span>
        </div>
        <div class="stat">
          <span class="label">准确率</span>
          <span class="value">{{ judgementSystem.getAccuracy() }}%</span>
        </div>
      </div>
    </div>
    
    <!-- 进度条 -->
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>
    
    <!-- 音符轨道 -->
    <div class="note-track">
      <div class="track-line"></div>
      <!-- 判定区域 (从单线改为区域) -->
      <div class="judgement-zone"></div>
      <div
        v-for="(note, index) in activeNotes"
        :key="index"
        :class="['note', getNoteClass(note.key)]"
        :style="{ left: note.position + 'px' }"
      >
        {{ note.key }}
      </div>
    </div>
    
    <!-- 判定反馈 -->
    <div v-if="lastJudgement" class="judgement-feedback" :class="lastJudgement">
      {{ lastJudgement.toUpperCase() }}
    </div>
    
    <!-- 键盘按键 -->
    <div class="keyboard-container">
      <div
        v-for="item in voiceArr"
        :key="item.key"
        :class="['key-box', { active: pressedKeys[item.key] }]"
        @mousedown="playSound(item)"
      >
        <p class="key-letter">{{ item.key }}</p>
        <p class="key-sound">{{ item.value }}</p>
        <audio
          v-show="false"
          :ref="'myAuto' + item.key"
          preload="auto"
          :src="'./' + item.value + '.wav'"
        />
      </div>
    </div>
    
    <!-- 暂停菜单 -->
    <div v-if="gameState === 'paused'" class="pause-menu">
      <h2>游戏暂停</h2>
      <button @click="resume">继续</button>
      <button @click="backToSelect">返回选歌</button>
    </div>
  </div>
  
  <!-- 结算界面 -->
  <GameResult
    v-else-if="gameState === 'result'"
    :stats="judgementSystem.getStats()"
    :accuracy="judgementSystem.getAccuracy()"
    :rank="judgementSystem.getRank()"
    :songId="currentSong.id"
    @retry="retry"
    @back="backToSelect"
  />
</template>

<script>
import SongSelect from './components/SongSelect.vue';
import GameResult from './components/GameResult.vue';
import ParticleEffect from './components/ParticleEffect.vue';
import songs from './SongData.js';
import JudgementSystem from './utils/JudgementSystem.js';

export default {
  components: {
    SongSelect,
    GameResult,
    ParticleEffect,
  },
  data() {
    return {
      songs,
      gameState: 'select', // select, playing, paused, result
      currentSong: null,
      judgementSystem: new JudgementSystem(),
      
      // 游戏时间
      gameTime: 0,
      startTime: 0,
      animationId: null,
      
      // 音符
      activeNotes: [],
      noteQueue: [],
      
      // 键盘
      voiceArr: [
        { key: 'A', value: 'clap' },
        { key: 'S', value: 'hihat' },
        { key: 'D', value: 'kick' },
        { key: 'F', value: 'openhat' },
        { key: 'G', value: 'boom' },
        { key: 'H', value: 'ride' },
        { key: 'J', value: 'snare' },
        { key: 'K', value: 'tom' },
        { key: 'L', value: 'tink' },
      ],
      pressedKeys: {},
      
      // 音频池
      audioPool: {},
      audioContext: null,
      audioBuffers: {},
      audioLoaded: false, // 音频加载状态
      gameMode: 'normal', // normal, practice
      
      // 判定反馈
      lastJudgement: null,
      judgementTimeout: null,
      
      // 轨道设置
      trackWidth: 800,
      judgementLinePosition: 100,
      // 判定区域宽度(像素), 居中于 judgementLinePosition
      judgementZoneWidth: 120, 
      noteSpeed: 2, // 像素/帧
    };
  },
  computed: {
    progressPercent() {
      if (!this.currentSong) return 0;
      return Math.min((this.gameTime / this.currentSong.duration) * 100, 100);
    },
  },
  mounted() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    // 添加全局点击事件来解锁 AudioContext
    window.addEventListener('click', this.unlockAudioContext, { once: true });
    this.initAudioSystem();
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('click', this.unlockAudioContext);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.audioContext) {
        this.audioContext.close();
    }
  },
  methods: {
    // 解锁音频上下文(解决浏览器自动播放策略)
    unlockAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('AudioContext 已解锁');
            });
        }
    },

    // 游戏开始
    onGameStart(options) {
      if (!this.audioLoaded) {
          alert("音频资源正在加载中，请稍后...");
          return;
      }
      this.unlockAudioContext(); 

      // 处理参数兼容 (旧代码直接传song对象, 新代码传 {song, speed, mode})
      const song = options.song || options;
      const speedMultiplier = options.speed || 1.0;
      const mode = options.mode || 'normal';

      this.currentSong = song;
      this.gameMode = mode; // 'normal' or 'practice'
      this.noteSpeed = 2 * speedMultiplier; // 基础速度 * 倍率
      
      this.gameState = 'playing';
      this.judgementSystem.reset();
      this.gameTime = 0;
      this.activeNotes = [];
      this.noteQueue = [...song.notes];
      this.startTime = performance.now();
      
      // 注意：调整 noteSpeed 后，spawnNotes 的预判时间也应该相应调整吗？
      // 原逻辑: spawnTime = this.gameTime + 2000; (2秒后到达)
      // 如果速度变快, 2秒意味着距离更远. 
      // trackWidth = 800. noteSpeed = 2. timeToTravel = 800 / 2 = 400 frames (6.6s?)
      // Wait, 60fps * 2px = 120px/s. 800px / 120 = 6.6s.
      // 实际上原逻辑 spawnTime 并没有严格对应 track由于距离.
      // 让我们保持简单的生成逻辑，只要 spawn 出来，位置设为 trackWidth 即可。
      // 唯一会变的是音符在屏幕上移动的快慢，视觉密度变低。
      
      this.gameLoop();
    },
    
    // 游戏主循环
    gameLoop() {
      if (this.gameState !== 'playing') return;
      
      const currentTime = performance.now();
      this.gameTime = currentTime - this.startTime;
      
      // 生成新音符
      this.spawnNotes();
      
      // 更新音符位置
      this.updateNotes();
      
      // 检查游戏是否结束
      if (this.gameTime >= this.currentSong.duration && this.activeNotes.length === 0) {
        this.endGame();
        return;
      }
      
      this.animationId = requestAnimationFrame(this.gameLoop);
    },
    
    // 生成音符
    spawnNotes() {
      // 这里的 2000 是预读取时间。
      // 如果速度极快(如 4x), 音符 2 秒可能跑不完 800px 吗？
      // 2 * 4 = 8px/frame = 480px/s. 2s = 960px.
      // 它会超出屏幕。所以 2000ms 足够覆盖大多数情况。
      // 保持不变即可。
      const spawnTime = this.gameTime + 2000; 
      
      while (this.noteQueue.length > 0 && this.noteQueue[0].time <= spawnTime) {
        const note = this.noteQueue.shift();
        this.activeNotes.push({
          ...note,
          position: this.trackWidth, // 从最右侧开始
          spawned: true,
        });
      }
    },
    
    // 更新音符位置
    updateNotes() {
      this.activeNotes = this.activeNotes.filter(note => {
        note.position -= this.noteSpeed;
        
        // 音符超出判定范围太远,判定为Miss
        if (note.position < this.judgementLinePosition - 200) {
          if (this.gameMode === 'normal') {
              this.judgementSystem.processMiss();
          }
          this.showJudgement('miss');
          return false;
        }
        
        return true;
      });
    },
    
    // 按键按下
    onKeyDown(event) {
      if (event.repeat) return;
      
      const key = event.key.toUpperCase();
      
      // ESC暂停
      if (key === 'ESCAPE' && this.gameState === 'playing') {
        this.pause();
        return;
      }
      
      if (this.gameState !== 'playing') return;
      
      this.pressedKeys[key] = true;
      
      // 查找对应的音符 - 优化逻辑: 找"最近的有效"音符
      // 1. 筛选出同key音符
      // 2. 找到绝对距离最小的
      // 3. 检查是否在有效窗口内 (<200px?)
      
      let bestNoteIndex = -1;
      let minDistance = Infinity;
      const validWindow = 150; // 这里的窗口可以比 JudgementWindow 大一点点作为容错
      
      this.activeNotes.forEach((note, index) => {
          if (note.key === key) {
              const dist = Math.abs(note.position - this.judgementLinePosition);
              // 确保在前后 validWindow 范围内, 且比当前找到的更近
              if (dist < validWindow && dist < minDistance) {
                  minDistance = dist;
                  bestNoteIndex = index;
              }
          }
      });
      
      
      if (bestNoteIndex !== -1) {
        const note = this.activeNotes[bestNoteIndex];
        const timeDiff = note.position - this.judgementLinePosition;
        // 注意：这里的 judgement 函数使用的是绝对值判定
        const judgement = this.judgementSystem.judge(timeDiff);
        
        // 只有在判定窗口内才算有效
        if (judgement !== 'miss') {
          const result = this.judgementSystem.processHit(judgement);
          this.showJudgement(judgement);
          this.triggerParticles(judgement);
          this.activeNotes.splice(bestNoteIndex, 1);
        }
      }
      
      // 播放音效
      const voiceItem = this.voiceArr.find(item => item.key === key);
      if (voiceItem) {
        this.playSound(voiceItem);
      }
    },
    
    // 按键抬起
    onKeyUp(event) {
      const key = event.key.toUpperCase();
      this.pressedKeys[key] = false;
    },
    
    // 初始化音频系统 - 使用 Web Audio API
    async initAudioSystem() {
      try {
        // 创建 AudioContext
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        
        console.log('正在加载音频文件...');
        
        // 预加载并解码所有音频文件
        const loadPromises = this.voiceArr.map(async (item) => {
          try {
            const response = await fetch(`./${item.value}.wav`);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.audioBuffers[item.key] = audioBuffer;
          } catch (error) {
            console.error(`✗ 加载失败: ${item.value}.wav`, error);
          }
        });
        
        // 并行初始化降级方案
        this.initFallbackAudio();
        
        await Promise.all(loadPromises);
        console.log('所有音频文件加载完成!');
        this.audioLoaded = true;
      } catch (error) {
        console.error('音频系统初始化失败:', error);
        // 降级到 HTML5 Audio
        this.initFallbackAudio();
        this.audioLoaded = true;
      }
    },
    
    // 降级方案:使用 HTML5 Audio (回归最简单的数组池方案)
    initFallbackAudio() {
      console.log('初始化 HTML5 Audio 数组池...');
      this.voiceArr.forEach(item => {
        // 直接使用数组，不搞复杂的对象结构，避免 HMR 问题
        this.audioPool[item.key] = [];
        // 15 个实例足够了
        for (let i = 0; i < 15; i++) {
          const audio = new Audio(`./` + item.value + `.wav`);
          audio.preload = 'auto';
          this.audioPool[item.key].push(audio);
        }
      });
    },
    
    // 播放音效 - Web Audio API 版本
    playSound(item) {
      if (!this.audioLoaded) return;
      
      const key = item.key.toUpperCase();
      
      // 1. 尝试 Web Audio API
      if (this.audioContext && this.audioBuffers[key]) {
        // 简单的 resume 检查
        if (this.audioContext.state === 'suspended') {
             this.audioContext.resume();
        }

        try {
          const source = this.audioContext.createBufferSource();
          source.buffer = this.audioBuffers[key];
          
          const gainNode = this.audioContext.createGain();
          gainNode.gain.value = 0.8; 
          
          source.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          
          source.start(0);
          return;
        } catch (error) {
          // 失败回退
        }
      }
      
      // 2. 降级方案
      this.playFallbackSound(key);
    },
    
    // 降级播放方法 (回归查找可用实例的逻辑)
    playFallbackSound(key) {
      const audioArray = this.audioPool[key];
      
      // 确保是数组 (HMR 兼容性保护)
      if (audioArray && Array.isArray(audioArray) && audioArray.length > 0) {
        // 找到第一个闲置的
        let audio = audioArray.find(a => a.paused || a.ended);
        
        // 如果都忙，抢占第一个 (Cut-off)
        if (!audio) {
          audio = audioArray[0];
          audio.currentTime = 0;
        }
        
        audio.currentTime = 0;
        audio.play().catch(e => {
            // console.log(e);
        });
      } else {
        // 如果池子坏了，尝试紧急修复 (重新初始化该 Key)
        if (!audioArray || !Array.isArray(audioArray)) {
             this.audioPool[key] = [];
             const item = this.voiceArr.find(v => v.key === key);
             if (item) {
                 const audio = new Audio(`./${item.value}.wav`);
                 this.audioPool[key].push(audio);
                 audio.play().catch(()=>{});
             }
        }
      }
    },
    
    // 显示判定反馈
    showJudgement(judgement) {
      this.lastJudgement = judgement;
      
      if (this.judgementTimeout) {
        clearTimeout(this.judgementTimeout);
      }
      
      this.judgementTimeout = setTimeout(() => {
        this.lastJudgement = null;
      }, 500);
    },
    
    // 触发粒子特效
    triggerParticles(judgement) {
      if (this.$refs.particleEffect) {
        const x = this.judgementLinePosition + 50;
        const y = window.innerHeight / 2 - 100;
        this.$refs.particleEffect.burst(x, y, judgement);
      }
    },
    
    // 获取音符样式类
    getNoteClass(key) {
      const index = this.voiceArr.findIndex(item => item.key === key);
      return `note-color-${index}`;
    },
    
    // 暂停
    pause() {
      this.gameState = 'paused';
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    },
    
    // 继续
    resume() {
      this.gameState = 'playing';
      this.startTime = performance.now() - this.gameTime;
      this.gameLoop();
    },
    
    // 结束游戏
    endGame() {
      this.gameState = 'result';
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    },
    
    // 重试
    retry() {
      this.onGameStart(this.currentSong);
    },
    
    // 返回选歌
    backToSelect() {
      this.gameState = 'select';
      this.currentSong = null;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    },
  },
};
</script>

<style scoped>
.game-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  padding: 20px;
  position: relative;
}

/* 顶部信息栏 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

.song-info {
  flex: 1;
}

.song-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #fff;
}

.song-difficulty {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.game-stats {
  display: flex;
  gap: 40px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat .label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
}

.stat .value {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.stat .value.combo {
  color: #f093fb;
}

/* 进度条 */
.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 40px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.1s linear;
}

/* 音符轨道 */
.note-track {
  width: 800px;
  height: 100px;
  margin: 0 auto 60px;
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  overflow: hidden;
}

.track-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(102, 126, 234, 0.1) 50%, 
    transparent 100%
  );
}

.judgement-zone {
  position: absolute;
  left: 60px; /* 100 - (width/2) + 20? No. Center is at 100. Width 120. */
  /* If center is 100px. Width 80px. Left = 100 - 40 = 60px. */
  top: 0;
  width: 80px; 
  height: 100%;
  background: linear-gradient(90deg, 
      rgba(240, 147, 251, 0.0) 0%, 
      rgba(240, 147, 251, 0.3) 50%, 
      rgba(240, 147, 251, 0.0) 100%
  );
  border-left: 2px solid rgba(240, 147, 251, 0.3);
  border-right: 2px solid rgba(240, 147, 251, 0.3);
  box-shadow: 0 0 15px rgba(240, 147, 251, 0.1);
  z-index: 10;
}

/* 辅助中心线 */
.judgement-zone::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    width: 2px;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    transform: translateX(-50%);
}

.note {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: transform 0.1s;
  z-index: 20;
}

.note-color-0 { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.note-color-1 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.note-color-2 { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.note-color-3 { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.note-color-4 { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.note-color-5 { background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); }
.note-color-6 { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
.note-color-7 { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); }
.note-color-8 { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); }

/* 判定反馈 */
.judgement-feedback {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 64px;
  font-weight: 900;
  text-transform: uppercase;
  animation: judgement-float 0.5s ease-out;
  pointer-events: none;
  z-index: 200;
  text-shadow: 0 0 20px currentColor;
}

@keyframes judgement-float {
  from {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -60%) scale(1.2);
    opacity: 1;
  }
  to {
    transform: translate(-50%, -80%) scale(1);
    opacity: 0;
  }
}

.judgement-feedback.perfect {
  color: #f093fb;
}

.judgement-feedback.great {
  color: #667eea;
}

.judgement-feedback.good {
  color: #4facfe;
}

.judgement-feedback.miss {
  color: #999;
}

/* 键盘按键 */
.keyboard-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 0 auto;
  max-width: 900px;
}

.key-box {
  width: 90px;
  height: 90px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s ease;
  user-select: none;
}

.key-box:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(102, 126, 234, 0.5);
}

.key-box.active {
  transform: scale(0.95);
  background: rgba(102, 126, 234, 0.3);
  border-color: #667eea;
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
}

.key-letter {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #fff;
}

.key-sound {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* 暂停菜单 */
.pause-menu {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(10, 14, 39, 0.95);
  backdrop-filter: blur(20px);
  padding: 40px 60px;
  border-radius: 20px;
  text-align: center;
  z-index: 1000;
}

.pause-menu h2 {
  font-size: 36px;
  margin: 0 0 30px 0;
  color: #fff;
}

.pause-menu button {
  display: block;
  width: 200px;
  padding: 14px;
  margin: 12px auto;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pause-menu button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
}
</style>
