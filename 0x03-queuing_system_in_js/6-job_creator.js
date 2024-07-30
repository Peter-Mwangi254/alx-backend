const kue = require('kue');

const queue = kue.createQueue();

const jobData = {
  phoneNumber: '123456789',
  message: 'This is a test message',
}
const job = queue.create('push_notification_code', jobData)
  .save((err) => {
    if (!err) {
      console.log(`Notification job created: ${job.id}`);
    } else {
      console.error(`Failed to create notification job`, err);
    }
  });

job.on('complete', () => {
  console.log('Notification job completed');
});
job.on('failed', () => {
  console.log('Notification job failed');
});
