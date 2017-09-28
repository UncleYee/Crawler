// 载入模块
const Segment = require('segment');
const fs = require('fs');
// 创建实例
const segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();

const text = '这是一个基于Node.js的中文分词模块。';

const readFile = (path) => {
  return fs.readFileSync(path, 'utf-8');
}

const texts = readFile('titles.txt');

result = segment.doSegment(texts, {
  stripPunctuation: true,
  simple: true
});

console.log(result);