<template>
  <div class="line">
    <div class="start"></div>
    <div ref="music" class="music">
      <div
        v-for="(item, index) in music"
        :key="index"
        :style="{ marginLeft: item.left + 'px' }"
        class="content"
      >
        {{ item.key }}
      </div>
    </div>
  </div>

  <div className="boxs">
    <div
      v-for="item in voiceArr"
      :key="item.key"
      @mousedown="palySound(item)"
      className="keybox"
    >
      <p class="key">{{ item.key }}</p>
      <p class="dis">{{ item.value }}</p>
      <audio
        v-show="false"
        :key="item.key"
        className="audio"
        preload="auto"
        :ref="'myAuto' + item.key"
        :src="'./' + item.value + '.wav'"
      />
    </div>
  </div>
  <div class="hard">
    <div @click="()=>this.changeHard(1.5)" :class="'esay ' + (hard == 1.5 && 'active' )">简单</div>
    <div @click="()=>this.changeHard(2)" :class="'mid ' + (hard == 2 && 'active' )">中等</div>
    <div @click="()=>this.changeHard(4)" :class="'esay ' + (hard == 4 && 'active' )">困难</div>
  </div>
  <div class="start-btn" @click="start">{{ isStart ? "暂停" : "开始" }}</div>
</template>

<script>
export default {
  data() {
    return {
      isStart: null,
      left: 0,
      hard:2,
      voiceArr: [
        { key: "A", value: "clap" },
        { key: "S", value: "hihat" },
        { key: "D", value: "kick" },
        { key: "F", value: "openhat" },
        { key: "G", value: "boom" },
        { key: "H", value: "ride" },
        { key: "J", value: "snare" },
        { key: "K", value: "tom" },
        { key: "L", value: "tink" },
      ],
      music: [
        {
          key: "S",
          left: 150,
        },
      ],
    };
  },
  methods: {
    changeHard(num){
      this.hard = num
    },
    palySound(event) {
      let key = event.key.toUpperCase();
      console.log("key =", key);
      let audio = this.$refs["myAuto" + key][0];
      audio.currentTime = 0; // 每次播放之后都使音频播放进度归零
      audio.play(); // 播放相应音效
    },
    start() {
      if (this.isStart) {
        clearInterval(this.isStart);
        this.isStart = null;
      } else {
        const music = this.$refs.music;
        this.isStart = setInterval(() => {
          music.style.left = this.left + "px";
          this.left = this.left - this.hard;
        }, 16);
      }
    },
    getRandomMusic(){
      for (let i = 0; i < 1000; i++) {
          let randomKey = Math.floor(Math.random() * 10)
          if (randomKey < 9) {
            let key = this.voiceArr[randomKey].key
                      let randomLeft = Math.floor(Math.random() * 100)
          let obj = {
              key: key,
              left: randomLeft,
            }
            this.music.push(obj)
          }


      }

    }
  },
  mounted() {
    window.addEventListener("keydown", this.palySound);
    this.getRandomMusic()
  },
};
</script>

<style scoped>
.boxs {
  display: flex;
}
.line {
  width: 800px;
  height: 88px;
  background-color: aquamarine;
  margin-bottom: 180px;
  overflow: hidden;
  display: flex;
  align-items: center;
  position: relative;
}
.start {
  height: 100%;
  width: 1px;
  margin-left: 100px;
  background-color: red;
}
.music {
  width: 100000%;
  height: 50%;
  background-color: #999;
  position: absolute;
  display: flex;
  justify-content: flex-start;
}
.content {
  display: inline-block;
  height: 100%;
  width: 30px;
  line-height: 50px;
  background-color: #fff;
  color: #000;
}
.keybox {
  width: 80px;
  height: 80px;
  border: 1px solid #999;
  cursor: pointer;
}
.key {
  height: 20px;
  font-size: 20px;
  font-weight: 600;
}
.dis {
  height: 20px;
  margin-top: -10px;
}
.start-btn {
  width: 188px;
  height: 88px;
  color: yellowgreen;
  font-size: 26px;
  font-weight: 500;
  cursor: pointer;
  background: red;
  line-height: 88px;
  margin: 0 auto;
  margin-top: 88px;
}
.hard{
  width: 300px;
  height: 50px;
  margin: 0 auto;
  margin-top: 30px;
  display: flex;
}
.esay,.mid, .high{
  width: 100px;
  height: 100%;
  text-align: center;
  line-height: 50px;
  border: 1px solid #666;
  background: #999;
  cursor: pointer;
}
.active {
  background: yellow;
}

</style>
