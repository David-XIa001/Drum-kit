<script setup></script>

<template>
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
        :src="'../assets/' + item.value + '.wav'"
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
  },
};
</script>

<style scoped>
.boxs {
  display: flex;
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
