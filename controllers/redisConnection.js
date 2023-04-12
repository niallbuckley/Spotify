// Database
const redis = require('redis');

let client;

function getRedisClient()  {
  if (!client) {
    client = redis.createClient({host: '127.0.0.1', port: '6379'})
    client.connect();
  }
  return client;
}

module.exports = { getRedisClient };
