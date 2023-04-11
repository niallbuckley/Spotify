// Database
const redis = require('redis');

let client;

function getRedisClient()  {
  if (!client) {
    client = redis.createClient({host: '127.0.0.1', port: '6379'})
    //await client.connect();
    //client.on("error", (error) => console.error(`Error : ${error}`));
  }
  return client;
}

module.exports = { getRedisClient };
