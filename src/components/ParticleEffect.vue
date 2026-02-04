<template>
  <div class="particle-container">
    <canvas ref="canvas" class="particle-canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'ParticleEffect',
  data() {
    return {
      particles: [],
      animationId: null,
    };
  },
  mounted() {
    this.initCanvas();
    this.animate();
  },
  beforeUnmount() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.canvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
    },
    
    createParticles(x, y, color, count = 20) {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const velocity = 2 + Math.random() * 3;
        
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          color,
          size: 3 + Math.random() * 3,
        });
      }
    },
    
    animate() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 更新和绘制粒子
      this.particles = this.particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // 重力
        particle.life -= 0.02;
        
        if (particle.life > 0) {
          ctx.globalAlpha = particle.life;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          return true;
        }
        return false;
      });
      
      ctx.globalAlpha = 1;
      this.animationId = requestAnimationFrame(this.animate);
    },
    
    // 暴露给父组件调用
    burst(x, y, judgement) {
      const colors = {
        perfect: '#f093fb',
        great: '#667eea',
        good: '#4facfe',
        miss: '#999',
      };
      
      const color = colors[judgement] || '#fff';
      const count = judgement === 'perfect' ? 30 : judgement === 'great' ? 20 : 15;
      
      this.createParticles(x, y, color, count);
    },
  },
};
</script>

<style scoped>
.particle-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
}

.particle-canvas {
  width: 100%;
  height: 100%;
}
</style>
