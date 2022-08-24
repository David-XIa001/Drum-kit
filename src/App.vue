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
</template>

<script>
export default {
  data() {
    return {
      voiceArr: [
        { key: "A", value: "clap" },
        { key: "S", value: "hihat" },
        { key: "D", value: "kick" },
        { key: "F", value: "openhat" },
        { key: "H", value: "boom" },
        { key: "I", value: "ride" },
        { key: "J", value: "snare" },
        { key: "K", value: "tom" },
        { key: "L", value: "tink" },
      ],
      music: [
        {
          key: "A",
          left: 0,
        },
        {
          key: "S",
          left: 50,
        },
        {
          key: "J",
          left: 30,
        },
        {
          key: "D",
          left: 80,
        },
        {
          key: "A",
          left: 0,
        },
        {
          key: "S",
          left: 50,
        },
        {
          key: "J",
          left: 30,
        },
        {
          key: "D",
          left: 80,
        },
        {
          key: "A",
          left: 0,
        },
        {
          key: "S",
          left: 50,
        },
        {
          key: "J",
          left: 30,
        },
        {
          key: "D",
          left: 80,
        },
      ],
    };
  },
  methods: {
    palySound(event) {
      let key = event.key.toUpperCase();
      console.log("key =", key);
      let audio = this.$refs["myAuto" + key][0];
      audio.currentTime = 0; // 每次播放之后都使音频播放进度归零
      audio.play(); // 播放相应音效
    },
  },
  mounted() {
    window.addEventListener("keydown", this.palySound);
    const music = this.$refs.music;
    let left = 0;
    setInterval(() => {
      music.style.left = left + "px";
      left = left - 3;
    }, 16);
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
  width: 50px;
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
</style>
