// 生成一个区间内随机整数
const RandomNumBoth = (Min,Max) => {
      var Range = Max - Min;
      var Rand = Math.random();
      var num = Min + Math.round(Rand * Range); //四舍五入
      return num;
}

module.exports = {
  RandomNumBoth: RandomNumBoth
}