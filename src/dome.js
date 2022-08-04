class AudioData {
    constructor(bufferData) {
      this.bufferData = bufferData;
    }
    get base() {
      const length = this.bufferData.length;
      return this.bufferData.slice(0, length * 0.0625);
    }
    get low() {
      const length = this.bufferData.length;
      return this.bufferData.slice(length * 0.0625 + 1, length * 0.125);
    }
    get mid() {
      const length = this.bufferData.length;
      return this.bufferData.slice(length * 0.125 + 1, length * 0.5);
    }
    get high() {
      const length = this.bufferData.length;
      return this.bufferData.slice(length * 0.5 + 1);
    }
    static scale(data, maxSize) {
      const ret = [];
      for(let i = 0; i < data.length; i++) {
        const value = data[i];
        let percent = Math.round((value / 255) * 100) / 100;
        ret[i] = maxSize * percent;
      }
      return ret;
    }
  }
  
  function draw(ctx, {audio, audioData, color, points}) {
    const { height, width } = ctx.canvas;
    // ctx.clearRect(0, 0, width, height);
    const data = AudioData.scale(audioData.mid, Math.min(height, width));
    const count = points || data.length;
    ctx.save();
    ctx.translate(0, height);
    ctx.scale(1, -1);
    ctx.fillStyle = color;
    const w = width / count;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for(let i = 0; i < count; i++) {
      const index = i * Math.floor(data.length / count);
      const e = lastAudio === audio ? 5 : 0;
      ctx.lineTo(i * w, e + data[index]);
      if(i === count - 1) {
        ctx.lineTo(width, e + data[index]);
        ctx.lineTo(width, 0);
      }
    }
    ctx.fill();
    ctx.restore();
  }
  
  const canvas = document.querySelector('canvas');
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
  const ctx = canvas.getContext('2d');
  ctx.globalAlpha = 0.5;
  const tasks = [];
  const tick = () => {
    const { height, width } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);
    tasks.forEach(task => task());
    window.requestAnimationFrame(tick);
  }
  tick();
  document.querySelectorAll("audio").forEach((audio, i) => {
    const color = `hsl(${i / 9 * 360}, 100%, 50%)`
    audio.addEventListener('play', () => {
      const audioCtx = new AudioContext();
      const audioSrc = audioCtx.createMediaElementSource(audio);
      const audioAnalyser = audioCtx.createAnalyser();
  
      audioSrc.connect(audioAnalyser);
      audioSrc.connect(audioCtx.destination);
      audioAnalyser.smoothingTimeConstant = .85;
      audioAnalyser.fftSize = 1024;
      const audioBufferData = new Uint8Array(audioAnalyser.frequencyBinCount);
      const audioData = new AudioData(audioBufferData);
      tasks.push(() => {
        audioAnalyser.getByteFrequencyData(audioBufferData);
        draw(ctx, {audio, audioData, color, points: 50});
      });
    }, {once: true});
  });
  
  let lastAudio = null;
  function playSound({keyCode, repeat}) {
    if(repeat) return; // 处理一下按键按住不放的情况
  
    const audio = document.querySelector(`audio[data-key="${keyCode}"]`); // 根据触发按键的键码，获取对应音频
    const key = document.querySelector(`[data-key="${keyCode}"]`); // 获取页面对应按钮 DIV 元素
    if (!audio) return; // 处理无效的按键事件
  
    key.classList.add('playing'); // 改变样式
    audio.currentTime = 0; // 每次播放之后都使音频播放进度归零
    audio.play(); // 播放相应音效
    lastAudio = audio;
  
    // 如果用transitionend快速敲击不一定触发
    if(key.timer) clearTimeout(key.timer);
    key.timer = setTimeout(() => {
      key.classList.remove('playing');
    }, 170);
  }
  
  // function removeTransition(event) {
  //   if (event.propertyName !== 'transform') return; // 过滤其中一种事件
  //     event.target.classList.remove('playing'); // 移除高亮的样式
  // }
  // const keys = Array.from(document.querySelectorAll('.key')); // 获取页面所有按钮元素
  // keys.forEach(key => key.addEventListener('transitionend', removeTransition)); // 添加 transition 事件监听
  
  window.addEventListener('keydown', playSound);
  document.querySelectorAll(`div[data-key]`).forEach((btn) => {
    btn.addEventListener('pointerdown', () => {
      playSound({keyCode: btn.dataset.key});
    });
  });