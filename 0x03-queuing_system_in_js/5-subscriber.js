import { createClient, print} from 'redis';

const client = createClient();

client.on('error', (err) => console.log('Redis client not connected to the server:', err.toString()));

client.on('connect', () => console.log('Redis client connected to the server'));

if (client) {
  const channel = 'holberton school channel';

  client.subscribe(channel, (err) => {
    if (err) {
      console.error(`Failed to subscribe to ${channel}: ${err.message}`);
      return;
    }
    console.log(`Subscribed to ${channel}`);
  });

  client.on('message', (channel, message) => {
    console.log(`${message}`);
    if (message === 'KILL_SERVER') {
      client.unsubscribe(channel, () => {
        client.quit(() => {
          console.log('Client disconnected form the server');
	});
      });
    }
  });
}
