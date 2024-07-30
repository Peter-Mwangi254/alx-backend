const kue = require('kue');
const queue = kue.createQueue();

// Array of blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

// Function to send notifications
function sendNotification(phoneNumber, message, job, done) {
    job.progress(0, 100); // Track progress

    if (blacklistedNumbers.includes(phoneNumber)) {
        return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
    }

    job.progress(50, 100); // Track progress

    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    done();
}

// Create a queue with Kue to process jobs with a concurrency of 2
queue.process('push_notification_code_2', 2, (job, done) => {
    const { phoneNumber, message } = job.data;
    
    sendNotification(phoneNumber, message, job, done);
});
