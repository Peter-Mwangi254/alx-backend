const { expect } = require('chai');
const kue = require('kue');
const createPushNotificationsJobs = require('./8-job');

describe('createPushNotificationsJobs', () => {
  let queue;

  beforeEach(() => {
    queue = kue.createQueue();
    kue.Job.rangeByType('push_notification_code_3', 'active', 0, -1, 'asc', (err, jobs) => {
      if (err) throw err;
      jobs.forEach(job => job.remove());
    });
    queue.testMode.enter();
  });

  afterEach(() => {
    queue.testMode.clear();
    queue.testMode.exit();
  });

  it('should throw an error if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs('not an array', queue)).to.throw('Jobs is not an array');
  });

  it('should create jobs in the queue for each job object in the array', () => {
    const jobs = [
      { phoneNumber: '1234567890', message: 'Hello!' },
      { phoneNumber: '0987654321', message: 'Hi!' },
    ];

    createPushNotificationsJobs(jobs, queue);

    expect(queue.testMode.jobs.length).to.equal(2);
    expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[0].data).to.deep.equal(jobs[0]);
    expect(queue.testMode.jobs[1].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[1].data).to.deep.equal(jobs[1]);
  });

  it('should log the job events correctly', (done) => {
    const jobs = [
      { phoneNumber: '1234567890', message: 'Hello!' },
    ];

    createPushNotificationsJobs(jobs, queue);

    const job = queue.testMode.jobs[0];
    job.on('complete', () => {
      console.log(`Notification job ${job.id} completed`);
    });

    job.on('failed', (err) => {
      console.log(`Notification job ${job.id} failed: ${err}`);
    });

    job.on('progress', (progress) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });

    // Simulate job events
    job.complete();
    job.failed('Error message');
    job.progress(50);

    done();
  });

  it('should handle job failure correctly', (done) => {
    const jobs = [
      { phoneNumber: '1234567890', message: 'Hello!' },
    ];

    createPushNotificationsJobs(jobs, queue);

    const job = queue.testMode.jobs[0];
    job.on('failed', (err) => {
      expect(err).to.equal('Error message');
      done();
    });

    job.failed('Error message');
  });

  it('should handle job progress correctly', (done) => {
    const jobs = [
      { phoneNumber: '1234567890', message: 'Hello!' },
    ];

    createPushNotificationsJobs(jobs, queue);

    const job = queue.testMode.jobs[0];
    job.on('progress', (progress) => {
      expect(progress).to.equal(50);
      done();
    });

    job.progress(50);
  });
});
