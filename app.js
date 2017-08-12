/**
 * 爬取知乎母婴频道精华帖第一页的数据
 * @author: UncleYe
 */
const superagent = require('superagent');
const cheerio = require('cheerio');
const async = require('async');
const fs = require('fs');
// url 模块是 Node.js 标准库里面的
const url = require('url');

// 知乎母婴频道精华部分
const topicUrl = 'https://www.zhihu.com/topic/19556989/top-answers?page=1';

let topicUrls = [];
superagent.get(topicUrl)
.end((err, res) => {
  if (err) {
      return console.error(err);
  }
  const $ = cheerio.load(res.text);
  // 获取第一页的所有问题链接
  $('#zh-topic-top-page-list div .feed-main div h2 a').each((idx, element) => {
    const $element = $(element);
    // $element.attr('href') 本来的样子是 /topic/542acd7d5d28233425538b04
    // 我们用 url.resolve 来自动推断出完整 url，变成
    // https://cnodejs.org/topic/542acd7d5d28233425538b04 的形式
    // 具体请看 http://nodejs.org/api/url.html#url_url_resolve_from_to 的示例
    //var href = url.resolve(topicUrl, $element.attr('href'));
    const href = url.resolve('https://www.zhihu.com', $element.attr('href'));
    topicUrls.push(href);
  });

  let concurrencyCount = 0;
  const fetchUrl = (url, callback) => {
    const delay = parseInt((Math.random() * 10000000) % 2000, 10);
    concurrencyCount++;
    //请求
    superagent.get(url)
    .end((err, res) => {
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
});
