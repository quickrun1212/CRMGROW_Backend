const express = require('express');

const user = require('./user');
const follow_up = require('./follow_up');
const contact = require('./contact');
const activity = require('./activity');
const note = require('./note');
const phone_log = require('./phone_log');
const appointment = require('./appointment');
const tag = require('./tag');
const file = require('./file');
const email = require('./email');
const video = require('./video');
const video_tracker = require('./video_tracker');
const pdf = require('./pdf');
const pdf_tracker = require('./pdf_tracker');
const sms = require('./sms');
const payment = require('./payment');
const template = require('./email_template');
const image = require('./image');
const notification = require('./notification');
const garbage = require('./garbage');
const automation = require('./automation');
const timeline = require('./time_line');
const page = require('./page');
const guest = require('./guest');
const label = require('./label');
const assets = require('./assets');
const admin = require('./admin/index');

const router = express.Router();

router.get('/health', (req, res) => {
  res.send('OK');
});

// User Dashboard api
router.use('/user', user);
router.use('/follow', follow_up);
router.use('/contact', contact);
router.use('/activity', activity);
router.use('/note', note);
router.use('/phone', phone_log);
router.use('/appointment', appointment);
router.use('/tag', tag);
router.use('/file', file);
router.use('/video', video);
router.use('/image', image);
router.use('/vtrack', video_tracker);
router.use('/pdf', pdf);
router.use('/ptrack', pdf_tracker);
router.use('/sms', sms);
router.use('/payment', payment);
router.use('/template', template);
router.use('/email', email);
router.use('/notification', notification);
router.use('/garbage', garbage);
router.use('/automation', automation);
router.use('/timeline', timeline);
router.use('/page', page);
router.use('/guest', guest);
router.use('/label', label);
router.use('/assets', assets);
router.use('/admin', admin);
router.use('/label', label)

module.exports = router;
