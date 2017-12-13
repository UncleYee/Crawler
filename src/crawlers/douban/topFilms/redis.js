/**
 * 爬取豆瓣电影 Top500
 * @author: uncleYee
 */

const request = require('superagent');
// superagent proxy 扩展
require('superagent-proxy')(request);
const cheerio = require('cheerio');
const async = require('async');
const url = require('url');

const redis = require('redis');
const client = redis.createClient();

client.on('ready', () => {
  console.log('redis is ready');
})

client.on('error', err => {
  console.log(err);
})