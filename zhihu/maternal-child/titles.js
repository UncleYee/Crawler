/**
 * 爬取知乎母婴频道精华问题描述
 * 2017-08-14
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
let titles = [];
const headers = {'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.8',
  'Cache-Control': 'max-age=0',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36',
  'Connection': 'keep-alive',
  'Referer': 'http://www.baidu.com/'
};

// 存储文件
const saveFile = (info) => {
  fs.writeFile('titles.txt', info, (err) => {
    if(err) throw err;
    console.log('文件已保存')
  });
}

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

// 抓取每一页的所有问题和链接
const getQuestionUrls = (parentUrl, pages) => {
  return new Promise((resolve, reject) => {
    request.get(parentUrl).set(headers).end((err, res) => {
      if(err) {
        reject(err);
      }
      const $ = cheerio.load(res.text);
      $('#zh-topic-top-page-list div .feed-main div h2 a').each((idx, element) => {
        const $element = $(element);
        const title = $element.text();
        const href = url.resolve('https://www.zhihu.com', $element.attr('href'));
        titles.push(title);
        topicUrls.push(href);
      });
      console.log(`现总计共${topicUrls.length}条数据`)
      fetchPage(pages);
    });
  });
}

const mergeInfo = (titles, urls) => {
  let results = '';
  for(let i = 0; i < titles.length; i++) {
    // 去除爬取到的字符串中的换行、回车符，并在一行的最后加上回车换行
    // const temp = `[${titles[i].replace(/[\r\n]/g, '')}](${urls[i]})  \r\n`;
    const temp = `${titles[i].replace(/[\r\n]/g, '')}\r\n`;
    results += temp;
  }
  return results;
}

// 抓取每一页的问题的链接
const fetchPage = (pages) => {
  if(fetchId < pages) {
    fetchId++;
    console.log(`正在抓取第${fetchId}页`);
    getQuestionUrls(`${topicUrl}?page=${fetchId}`, pages);
  } else {
    console.log('已经抓取完所有数据');
    const results = mergeInfo(titles, topicUrls);
    saveFile(results);
  }
}

getPageNums(topicUrl).then((pages) => {
  console.log(`爬取目标共${pages}页，现在开始爬取数据`)
  fetchPage(pages);
});
