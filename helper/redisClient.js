
var redis = require('redis'),
  client = redis.createClient({
    port: 11938,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  });
  client.on('connect', function() {
    console.log('connected redis');
  });
  module.exports = client;
