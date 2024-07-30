const kue = require('kue');
const queue = kue.createQueue();

function createPushNotificationsJobs(jobs, queue) {
    if (!Array.isArray(jobs)) {
        throw new Error('Jobs is not an array');
    }

    jobs.forEach((jobData) => {
        const job = queue.create('push_notification_code_3', jobData)
            .save(function(err) {
                if (!err) {
                    console.log(`Notification job created: ${job.id}`);
                }
            });

        // Listen for job completion
        job.on('complete', function() {
            console.log(`Notification job ${job.id} completed`);
        });

        // Listen for job failure
        job.on('failed', function(err) {
            console.log(`Notification job ${job.id} failed: ${err}`);
        });

        // Listen for job progress
        job.on('progress', function(progress) {
            console.log(`Notification job ${job.id} ${progress}% complete`);
        });
    });
}


module.exports = createPushNotificationsJobs;
