const mongoose = require('mongoose');
const Activity = require('../models/activity');
const VideoTracker = require('../models/video_tracker')
const { DB_PORT } = require('../config/database');

mongoose.set('useCreateIndex', true)
mongoose.connect(DB_PORT, {useNewUrlParser: true})
.then(() => console.log('Connecting to database successful'))
.catch(err => console.error('Could not connect to mongo DB', err))
//Fetch or read data from

const migrate = async() => {
  const video_trackers = await Activity.find({type: 'video_trackers'}).populate('video_trackers').catch(err=>{
    console.log('err', err)
  })
  
  for(let i=0; i<video_trackers.length; i++){
    const video_tracker = video_trackers[i]
    video_tracker['videos'] = video_tracker.video_trackers.video
    console.log('id', video_tracker.video_trackers.video)
    video_tracker.save().catch(err=>{
      console.log('err', err)
    })
  }
}
migrate();