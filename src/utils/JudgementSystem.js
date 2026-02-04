// 判定系统工具类
export class JudgementSystem {
  constructor() {
    // 判定窗口 (毫秒)
    this.timingWindows = {
      perfect: 50, // ±50ms
      great: 100, // ±100ms
      good: 150, // ±150ms
    };

    // 分数
    this.scores = {
      perfect: 100,
      great: 70,
      good: 40,
      miss: 0,
    };

    // 统计数据
    this.stats = {
      perfect: 0,
      great: 0,
      good: 0,
      miss: 0,
      combo: 0,
      maxCombo: 0,
      totalScore: 0,
    };
  }

  // 判定按键时机
  judge(timeDifference) {
    const absDiff = Math.abs(timeDifference);

    if (absDiff <= this.timingWindows.perfect) {
      return "perfect";
    } else if (absDiff <= this.timingWindows.great) {
      return "great";
    } else if (absDiff <= this.timingWindows.good) {
      return "good";
    } else {
      return "miss";
    }
  }

  // 处理击打结果
  processHit(judgement) {
    // 更新统计
    this.stats[judgement]++;

    // 更新连击
    if (judgement !== "miss") {
      this.stats.combo++;
      if (this.stats.combo > this.stats.maxCombo) {
        this.stats.maxCombo = this.stats.combo;
      }
    } else {
      this.stats.combo = 0;
    }

    // 计算分数
    const baseScore = this.scores[judgement];
    const comboBonus = Math.floor(this.stats.combo / 10) * 5; // 每10连击额外5分
    const totalScore = baseScore + comboBonus;

    this.stats.totalScore += totalScore;

    return {
      judgement,
      score: totalScore,
      combo: this.stats.combo,
    };
  }

  // 处理Miss(音符未击打)
  processMiss() {
    this.stats.miss++;
    this.stats.combo = 0;
    return {
      judgement: "miss",
      score: 0,
      combo: 0,
    };
  }

  // 获取当前统计
  getStats() {
    return { ...this.stats };
  }

  // 计算准确率
  getAccuracy() {
    const total =
      this.stats.perfect + this.stats.great + this.stats.good + this.stats.miss;
    if (total === 0) return 0;

    const weightedHits =
      this.stats.perfect * 1.0 + this.stats.great * 0.7 + this.stats.good * 0.4;

    return ((weightedHits / total) * 100).toFixed(2);
  }

  // 获取评级
  getRank() {
    const accuracy = parseFloat(this.getAccuracy());

    if (accuracy >= 95) return "S";
    if (accuracy >= 90) return "A";
    if (accuracy >= 80) return "B";
    if (accuracy >= 70) return "C";
    return "D";
  }

  // 重置统计
  reset() {
    this.stats = {
      perfect: 0,
      great: 0,
      good: 0,
      miss: 0,
      combo: 0,
      maxCombo: 0,
      totalScore: 0,
    };
  }
}

export default JudgementSystem;
