/**
 * 爬取战狼2所有评论
 * 2017-08-17
 * @author: UncleYee
 */
const request = require('superagent');
const cheerio = require('cheerio');
const async = require('async');
const fs = require('fs');
const {RandomNumBoth, randomIp} = require('../../utils/Random');
// url 模块是 Node.js 标准库里面的
const url = require('url');
// superagent proxy 扩展
require('superagent-proxy')(request);

// 计数器
let fetchId = 0;
// 字典
const dir = {
  '很差': 2,
  '较差': 4,
  '还行': 6,
  '推荐': 8,
  '力荐': 10,
}
//结果
let results = [];

// 战狼2影评首页
const topicUrl = 'https://movie.douban.com/subject/26363254/reviews';
let topicUrls = [];
const headers = {'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.8',
  'Cache-Control': 'max-age=0',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36',
  'Connection': 'keep-alive',
  'Referer': 'http://www.baidu.com/'
};

// 获取影评总页数
const getPageNums = (url) => {
  return new Promise((resolve, reject) => {
    request.get(url).set(headers).end((err, res) => {
      if (err) {
        reject(err);
      }
      const $ = cheerio.load(res.text);
      const pages = $('#wrapper #content .article .paginator .thispage').attr('data-total-page');
      for (let i = 0; i < pages; i++) {
        const temp = `${topicUrl}?start=${i * 20}`;
        topicUrls.push(temp);
      }
      resolve();
    });
  });
}

// 存储文件
const saveFile = (info) => {
  fs.writeFile('comment.csv', info, (err) => {
    if(err) throw err;
    console.log('文件已保存')
  });
}

// 抓取每一个影评
const fetchData = () => {
  let concurrencyCount = 0;
  const fetchUrl = (url, callback) => {
    // const ip = randomIp();
    // headers['X-Forwarded-For'] = ip;
    const delay = parseInt((Math.random() * 10000000) % 2000, 10);
    concurrencyCount++;
    //请求
    request.get(url).set(headers).end((err, res) => {
      if (err) {
          return console.log(err);
      }
      const $ = cheerio.load(res.text);
      $('#wrapper #content .article .review-list .main').each((idx, elm) => {
        const $elm = $(elm);
        const score = dir[$elm.find('header').find('.main-title-rating').attr('title')];
        const time = $elm.find('header').find('.main-meta').text().trim();
        // const temp = `评论时间：${time}，评分：${score}\r\n`;
        const temp = `${time}，${score}\r\n`;
        results.push(temp);
      });
      
      console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒 ');
    })
    
    setTimeout(() => {
      concurrencyCount--;
      callback(null, url);
    }, delay);
  };

  async.mapLimit(topicUrls, 10, (url, callback) => {
    fetchUrl(url, callback);
  }, (err, result) => {
    console.log('抓取结束!');
    saveFile(results.toString().replace(/,/g,''));
  });
}

getPageNums(topicUrl).then(() => {
  fetchData();
  console.log(topicUrls.length);
});