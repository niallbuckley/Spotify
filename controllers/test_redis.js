var redis = require("redis"),
    client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});
//1128  1129
(async () => {
    client.on("error", (error) => console.error(`Error : ${error}`));
  
    await client.connect();
    // Set the auth key as the key for the personal database
    //await client.set(state, JSON.stringify(jData));
    await client.set("string key", "string val");
    //await client.hSet("hashkey", "hashtest 1", "some value");
    //await client.hSet("hashkey", "hashtest 2", "some value2");
    //await client.hSet("hashkey", "hashtest 3", "some value3");
    await client.hSet("hashkey", {"hashtest 1": "some value", "hashtest 2": "some value2", "hashtest 3": "some value3"});
    //client.quit();
  })();

(async () => {
    // Set the auth key as the key for the personal database
    //await client.set(state, JSON.stringify(jData));
    var res = await client.hGet("hashkey", "hashtest 3");
    console.log("result: ", res);
    //client.quit();
  })();
