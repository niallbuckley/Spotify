var redis = require("redis"),
    client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});
(async () => {
    client.on("error", (error) => console.error(`Error : ${error}`));
  
    await client.connect();
    // Set the auth key as the key for the personal database
    //await client.set(state, JSON.stringify(jData));
    await client.set("string key", "string val");
    await client.hSet("hashkey", "hashtest 1", "some value");
    await client.hSet("hashkey", "hashtest 2", "some value2");
    client.quit()
  })();
