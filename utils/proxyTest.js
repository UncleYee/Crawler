const proxyList = require('./proxyPool');
const request = require("request");

proxyList.getProxyList().then(function (proxyList) {

    var targetOptions = {
        method: 'GET',
        url: 'http://ip.chinaz.com/getip.aspx',
        timeout: 8000,
        encoding: null,
    };

    //这里修改一下，变成你要访问的目标网站
    proxyList.forEach(function (proxyurl) {

        console.log(`testing ${proxyurl}`);

        targetOptions.proxy = 'http://' + proxyurl;
        request(targetOptions, function (error, response, body) {
            try {
                if (error) throw error;


                body = body.toString();

                console.log(body);

                eval(`var ret = ${body}`);


                if (ret) {
                    console.log(`验证成功==>> ${ret.address}`);
                }
            } catch (e) {
                // console.error(e);
            }


        });

    });
}).catch(e => {
    console.log(e);
})