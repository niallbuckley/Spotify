const retry = require('async-retry');
const { getRedisClient } = require('./redisConnection');

async function checkFieldExists(client, storedState) {
  const r = await client.exists(storedState);
  if (r === 1) {
    console.log('Field exists!');
    return true;
  }
  throw new Error('Field does not exist!');
}

// Move client initialization inside the main function
async function main() {
  const maxRetries = 3;
  const delay = 1000; // Delay in milliseconds between retries

  const storedState = "oHcqCplUpGp2KloE"; // Define your storedState variable here

  try {
    const client = getRedisClient(); // Initialize the Redis client

    const exists = await retry(async () => {
      return await checkFieldExists(client, storedState);
    }, {
      retries: maxRetries,
      minTimeout: delay,
      onRetry: (err, attempt) => {
        console.log(`Retrying (${attempt}/${3})...`);
        const fs = require('fs'); fs.writeFileSync('filename.txt', 'Content to write');
      },
    });

    if (exists) {
      // Field exists! Perform the desired action
      console.log("found!");
      stateInDatabase = true;
    } else {
      // Field doesn't exist. Handle it accordingly
      console.log("not found!");
    }
  }
  catch (error) {
    const fs = require('fs'); fs.writeFileSync('filename.txt', 'Content to write');
    console.log(`Max retries exceeded. Unable to perform the operation. Error: ${error.message}`);
  }
}

main(); // Invoke the main function to start the execution