const charset = require('superagent-charset');
const superagent = charset(require('superagent'));

require('superagent-proxy')(superagent);
const cheerio = require('cheerio');

const getProxyList = () => {
  const freeProxyUrl = `http://www.yun-daili.com/free.asp`;
  return new Promise((resolve, reject) => {
    const headers = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
      'referer': 'https://www.baidu.com',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
    }

    const proxyList = [];

    const fetchUrl = (url) => {
      superagent
        .get(url)
        .charset('gbk')
        .set(headers)
        .end((err, res) => {
          try {
            if(err) {
              throw err;
            }

            const $ = cheerio.load(res.text);

            $('#list .odd').each((idx, elm) => {
              const $elm = $(elm);
              const protocal = $elm.find('.style4').text().split('代理')[0];
              const ip = $elm.find('.style1').text();
              const port = $elm.find('.style2').text();
              const url = `${protocal}://${ip}:${port}`;
              proxyList.push(url);
            });

            const isHasNext = $('#listnav').find('a').last().prev().text() == '下一页' ? true : false;
            if(isHasNext) {
              setTimeout(() => {
                const nextUrl = freeProxyUrl + $('#listnav').find('a').last().prev().attr('href');
                console.log(`抓取下一页：${nextUrl}`)
                fetchUrl(nextUrl);
              }, 1000);
            } else {
              resolve(proxyList);
            }
            
          } catch (error) {
            throw error
          }
        })
    }

    fetchUrl(freeProxyUrl);
    
  });
}

getProxyList().then(res => {
  console.log(res.length);
  console.log(res);
})