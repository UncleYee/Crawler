/**
 * 爬取知乎母婴频道精华帖
 * 2017-08-12
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

// 知乎母婴频道精华首页
const topicUrl = 'https://www.zhihu.com/topic/19556989/top-answers';
let topicUrls = [];
const headers = {'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.8',
  'Cache-Control': 'max-age=0',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36',
  'Connection': 'keep-alive',
  'Referer': 'http://www.baidu.com/'
};

// 获取精华频道共有多少页
const getPageNums = (url) => {

  return new Promise((resolve, reject) => {
    request.get(url).set(headers).end((err, res) => {
      if (err) {
        reject(err);
      }
      const $ = cheerio.load(res.text);
      const pages = $('.zm-invite-pager').children().last().prev().find('a').text().trim();
      resolve(Number(pages));
    });
  });
}

const getQuestionUrls = (parentUrl, pages) => {
  return new Promise((resolve, reject) => {
    request.get(parentUrl).set(headers).end((err, res) => {
      if(err) {
        reject(err);
      }
      const $ = cheerio.load(res.text);
      $('#zh-topic-top-page-list div .feed-main div h2 a').each((idx, element) => {
        const $element = $(element);
        const href = url.resolve('https://www.zhihu.com', $element.attr('href'));
        topicUrls.push(href);
      });
      console.log(`现总计共${topicUrls.length}条数据`)
      fetchPage(pages);
    });
  });
}

// 抓取每一个问题
const fetchData = () => {
  let concurrencyCount = 0;
  const fetchUrl = (url, callback) => {
    const delay = parseInt((Math.random() * 10000000) % 2000, 10);
    concurrencyCount++;
    //请求
    request.get(url).set(headers).end((err, res) => {
      if (err) {
          return console.log(err);
      }
      const $ = cheerio.load(res.text);
      const title = $('.App-main .QuestionPage .QuestionHeader-title').text().trim();
      console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒, ' + 'title:' + title);
    })
    
    setTimeout(() => {
      concurrencyCount--;
      callback(null, url);
    }, delay);
  };

  async.mapLimit(topicUrls, 5, (url, callback) => {
    fetchUrl(url, callback);
  }, (err, result) => {
    console.log('final:');
    console.log(result);
  });
}

// 抓取每一页的问题的链接
const fetchPage = (pages) => {
  if(fetchId < pages) {
    fetchId++;
    console.log(`正在抓取第${fetchId}页`);
    getQuestionUrls(`${topicUrl}?page=${fetchId}`, pages);
  } else {
    console.log('已经抓取完所有数据，开始进行问题内容抓取');
    fetchData();
  }
}

getPageNums(topicUrl).then((pages) => {
  fetchPage(pages);
});
