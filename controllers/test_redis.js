const redis = require('redis');

const client = redis.createClient({
          host: '127.0.0.1',
          port: '6379'
});
client.on('connect', () => {
    console.log('Connected!');
    client.set('name', 'jeff', (err, reply) => {
        if (err) throw err;
        console.log(reply);
    
        client.get('name', (err, reply) => {
            if (err) throw err;
            console.log(reply);
        });
    });
});
