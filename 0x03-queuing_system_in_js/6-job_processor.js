const kue = require('kue');
const queue = kue.createQueue();

// Function to send notifications
function sendNotification(phoneNumber, message) {
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Queue process to listen to new jobs on push_notification_code
queue.process('push_notification_code', (job, done) => {
    const { phoneNumber, message } = job.data;
    sendNotification(phoneNumber, message);
    done();
});
