const redis = require('redis');

const client = redis.createClient();

client.on('ready', () => {
  console.log('redis is ready!');
})

client.on('error', err => {
  console.log("Error " + err);
  // client.quit();
});
