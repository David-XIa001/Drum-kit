// 乐谱数据文件 - 流行经典节奏版
export const songs = [
  {
    id: "queen_rock",
    title: "Stadium Rock",
    artist: "Classic Rock Tribute",
    bpm: 82,
    difficulty: "Easy",
    duration: 30000,
    // 经典的 "咚-咚-恰" 节奏 (We Will Rock You 风格)
    // Kick(D) - Kick(D) - Clap(A)
    notes: [
      // 第一小节
      { time: 0, key: "D" }, // 咚
      { time: 365, key: "D" }, // 咚
      { time: 731, key: "A" }, // 恰

      // 第二小节
      { time: 1463, key: "D" }, // 咚
      { time: 1829, key: "D" }, // 咚
      { time: 2195, key: "A" }, // 恰

      // 第三小节
      { time: 2926, key: "D" },
      { time: 3292, key: "D" },
      { time: 3658, key: "A" },

      // 第四小节
      { time: 4390, key: "D" },
      { time: 4756, key: "D" },
      { time: 5121, key: "A" },

      // 循环...
      { time: 5853, key: "D" },
      { time: 6219, key: "D" },
      { time: 6585, key: "A" },
      { time: 7317, key: "D" },
      { time: 7682, key: "D" },
      { time: 8048, key: "A" },
      { time: 8780, key: "D" },
      { time: 9146, key: "D" },
      { time: 9512, key: "A" },
      { time: 10243, key: "D" },
      { time: 10609, key: "D" },
      { time: 10975, key: "A" },

      // 加入 Hi-hat 变奏
      { time: 11707, key: "D" },
      { time: 12073, key: "D" },
      { time: 12439, key: "A" },
      { time: 12804, key: "S" },
      { time: 13170, key: "D" },
      { time: 13536, key: "D" },
      { time: 13902, key: "A" },
      { time: 14268, key: "S" },

      // 密集部分
      { time: 14634, key: "D" },
      { time: 15000, key: "D" },
      { time: 15365, key: "A" },
      { time: 16097, key: "D" },
      { time: 16463, key: "D" },
      { time: 16829, key: "A" },

      // 结尾
      { time: 17560, key: "D" },
      { time: 17926, key: "D" },
      { time: 18292, key: "A" },
      { time: 18658, key: "G" },
      { time: 19024, key: "D" },
      { time: 19390, key: "D" },
      { time: 19756, key: "A" },
      { time: 20121, key: "G" },

      // 最后爆发
      { time: 20853, key: "D" },
      { time: 21219, key: "D" },
      { time: 21585, key: "A" },
      { time: 21951, key: "D" },
      { time: 22317, key: "D" },
      { time: 22682, key: "A" },
      { time: 23414, key: "D" },
      { time: 23780, key: "D" },
      { time: 24146, key: "A" },
      { time: 24878, key: "A" },
      { time: 25243, key: "A" },
      { time: 25609, key: "A" },
    ],
  },
  {
    id: "pop_king",
    title: "Pop King Groove",
    artist: "Pop Legend Tribute",
    bpm: 117,
    difficulty: "Medium",
    duration: 35000,
    // 经典的 Billie Jean 风格节奏
    // Kick(D) - Hihat(S) - Snare(J) - Hihat(S)
    notes: [
      // 前奏
      { time: 0, key: "D" },
      { time: 256, key: "S" },
      { time: 512, key: "J" },
      { time: 769, key: "S" },

      { time: 1025, key: "D" },
      { time: 1282, key: "S" },
      { time: 1538, key: "J" },
      { time: 1794, key: "S" },

      // 重复
      { time: 2051, key: "D" },
      { time: 2307, key: "S" },
      { time: 2564, key: "J" },
      { time: 2820, key: "S" },
      { time: 3076, key: "D" },
      { time: 3333, key: "S" },
      { time: 3589, key: "J" },
      { time: 3846, key: "S" },
      { time: 4102, key: "D" },
      { time: 4358, key: "S" },
      { time: 4615, key: "J" },
      { time: 4871, key: "S" },
      { time: 5128, key: "D" },
      { time: 5384, key: "S" },
      { time: 5641, key: "J" },
      { time: 5897, key: "S" },

      // 第 8 秒开始稍微变化，加点OpenHat(F)
      { time: 6153, key: "D" },
      { time: 6410, key: "F" },
      { time: 6666, key: "J" },
      { time: 6923, key: "S" },
      { time: 7179, key: "D" },
      { time: 7435, key: "S" },
      { time: 7692, key: "J" },
      { time: 7948, key: "S" },

      // 连续打击
      { time: 8205, key: "D" },
      { time: 8461, key: "S" },
      { time: 8717, key: "J" },
      { time: 8974, key: "S" },
      { time: 9230, key: "D" },
      { time: 9487, key: "S" },
      { time: 9743, key: "J" },
      { time: 10000, key: "S" },

      // 复杂的切分音
      { time: 10256, key: "D" },
      { time: 10384, key: "K" },
      { time: 10512, key: "S" },
      { time: 10769, key: "J" },
      { time: 11282, key: "D" },
      { time: 11538, key: "J" },

      // 回到主节奏
      { time: 12307, key: "D" },
      { time: 12564, key: "S" },
      { time: 12820, key: "J" },
      { time: 13076, key: "S" },
      { time: 13333, key: "D" },
      { time: 13589, key: "S" },
      { time: 13846, key: "J" },
      { time: 14102, key: "S" },

      // 更多...
      { time: 14358, key: "D" },
      { time: 14615, key: "S" },
      { time: 14871, key: "J" },
      { time: 15128, key: "S" },
      { time: 15384, key: "D" },
      { time: 15641, key: "S" },
      { time: 15897, key: "J" },
      { time: 16153, key: "S" },
      { time: 16410, key: "D" },
      { time: 16666, key: "S" },
      { time: 16923, key: "J" },
      { time: 17179, key: "S" },
      { time: 17435, key: "D" },
      { time: 17692, key: "S" },
      { time: 17948, key: "J" },
      { time: 18205, key: "S" },
    ],
  },
  {
    id: "disco_fever",
    title: "Disco Fever",
    artist: "70s Vibes",
    bpm: 120,
    difficulty: "Hard",
    duration: 30000,
    // Disco 风格: Kick on 1/2/3/4, OpenHat on off-beats
    // Kick(D) - OpenHat(F) - Snare(J)+Kick(D) - OpenHat(F)
    notes: [
      { time: 0, key: "D" },
      { time: 250, key: "F" },
      { time: 500, key: "J" },
      { time: 500, key: "D" }, // 同步打击
      { time: 750, key: "F" },

      { time: 1000, key: "D" },
      { time: 1250, key: "F" },
      { time: 1500, key: "J" },
      { time: 1500, key: "D" },
      { time: 1750, key: "F" },

      { time: 2000, key: "D" },
      { time: 2250, key: "F" },
      { time: 2500, key: "J" },
      { time: 2500, key: "D" },
      { time: 2750, key: "F" },

      { time: 3000, key: "D" },
      { time: 3250, key: "F" },
      { time: 3500, key: "J" },
      { time: 3500, key: "D" },
      { time: 3750, key: "F" },

      // 快速连击
      { time: 4000, key: "D" },
      { time: 4125, key: "D" },
      { time: 4250, key: "F" },
      { time: 4500, key: "J" },
      { time: 4750, key: "F" },

      { time: 5000, key: "D" },
      { time: 5250, key: "F" },
      { time: 5500, key: "J" },
      { time: 5750, key: "F" },

      { time: 6000, key: "D" },
      { time: 6250, key: "F" },
      { time: 6500, key: "J" },
      { time: 6500, key: "D" },
      { time: 6750, key: "F" },

      { time: 7000, key: "D" },
      { time: 7250, key: "F" },
      { time: 7500, key: "J" },
      { time: 7750, key: "F" },

      { time: 8000, key: "D" },
      { time: 8250, key: "F" },
      { time: 8500, key: "J" },
      { time: 8750, key: "F" },

      { time: 9000, key: "D" },
      { time: 9250, key: "F" },
      { time: 9500, key: "J" },
      { time: 9750, key: "F" },

      { time: 10000, key: "D" },
      { time: 10125, key: "K" },
      { time: 10250, key: "F" },
      { time: 10500, key: "J" },
      { time: 10750, key: "F" },
    ],
  },
];
export default songs;
