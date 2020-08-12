const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const child_process = require('child_process');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const Video = require('../models/video');
const { VIDEO_CONVERT_LOG_PATH, TEMP_PATH } = require('../config/path');
const urls = require('../constants/urls');

const convertRecordVideo = async (id) => {
  const video = await Video.findOne({ _id: id }).catch((err) => {
    console.log('video convert find video error', err.message);
  });

  const file_path = video['path'];
  const new_file = uuidv1() + '.mov';
  const new_path = TEMP_PATH + new_file;
  // const video_path = 'video.mov'
  const args = [
    '-i',
    file_path,
    '-c:v',
    'libx264',
    '-b:v',
    '1.5M',
    '-c:a',
    'aac',
    '-b:a',
    '128k',
    new_path,
  ];

  if (!fs.existsSync(TEMP_PATH)) {
    fs.mkdirSync(TEMP_PATH);
  }

  const ffmpegConvert = child_process.spawn(ffmpegPath, args);
  ffmpegConvert.on('close', function () {
    const new_url = urls.VIDEO_URL + new_file;
    video['url'] = new_url;
    video['converted'] = 'completed';
    video['path'] = new_path;
    video
      .save()
      .then(() => {
        fs.unlinkSync(file_path);
      })
      .catch((err) => {
        console.log('vide update err', err.message || err.msg);
      });
  });

  if (!fs.existsSync(VIDEO_CONVERT_LOG_PATH)) {
    fs.mkdirSync(VIDEO_CONVERT_LOG_PATH);
  }

  ffmpegConvert.stderr.on('data', function (data) {
    const content = new Buffer(data).toString();
    fs.appendFile(
      VIDEO_CONVERT_LOG_PATH + video.id + '.txt',
      content,
      function (err) {
        // If an error occurred, show it and return
        if (err) {
          console.error(err);
          // Successfully wrote binary contents to the file!
          return err;
        }
      }
    );
  });
};

const convertUploadVideo = async (id) => {
  const video = await Video.findOne({ _id: id }).catch((err) => {
    console.log('video convert find video error', err.message);
  });

  const file_path = video['path'];
  const new_file = uuidv1() + '.mov';
  const new_path = TEMP_PATH + new_file;

  const args = [
    '-i',
    file_path,
    '-c:v',
    'libx264',
    '-b:v',
    '1.5M',
    '-c:a',
    'aac',
    '-b:a',
    '128k',
    '-movflags',
    'faststart',
    new_path,
  ];

  if (!fs.existsSync(TEMP_PATH)) {
    fs.mkdirSync(TEMP_PATH);
  }

  if (!fs.existsSync(VIDEO_CONVERT_LOG_PATH)) {
    fs.mkdirSync(VIDEO_CONVERT_LOG_PATH);
  }

  const ffmpegConvert = child_process.spawn(ffmpegPath, args);
  ffmpegConvert.on('close', function () {
    const new_url = urls.VIDEO_URL + new_file;
    video['url'] = new_url;
    video['converted'] = 'completed';
    video['path'] = new_path;
    video
      .save()
      .then(() => {
        fs.unlinkSync(file_path);
      })
      .catch((err) => {
        console.log('vide update err', err.message || err.msg);
      });
  });

  ffmpegConvert.stderr.on('data', function (data) {
    const content = new Buffer(data).toString();
    fs.appendFile(
      VIDEO_CONVERT_LOG_PATH + video.id + '.txt',
      content,
      function (err) {
        // If an error occurred, show it and return
        if (err) {
          console.error(err);
          return err;
        }
        // Successfully wrote binary contents to the file!
      }
    );
  });
};

const getConvertStatus = (video_path) => {
  if (!fs.existsSync(VIDEO_CONVERT_LOG_PATH + video_path + '.txt')) {
    return {
      id: video_path,
      status: false,
      error: "Converting Status File doesn't exist.",
    };
  }
  const content = fs.readFileSync(
    VIDEO_CONVERT_LOG_PATH + video_path + '.txt',
    'utf8'
  );
  let duration = 0;
  let time = 0;
  let progress = 0;
  let result;
  let matches = content ? content.match(/Duration: (.*?), start:/) : [];

  // get duration of source
  // if( matches && matches.length>0){
  //   let rawDuration = matches[1];
  //   // convert rawDuration from 00:00:00.00 to seconds.
  //   let ar = rawDuration.split(":").reverse();
  //   duration = parseFloat(ar[0]);
  //   if (ar[1]) duration += parseInt(ar[1]) * 60;
  //   if (ar[2]) duration += parseInt(ar[2]) * 60 * 60;
  // }
  // // get the time
  // matches = content.match(/time=(.*?) bitrate/g);

  // if( matches && matches.length>0 ){
  //   let rawTime = matches.pop();
  //   rawTime = rawTime.replace('time=','').replace(' bitrate','');

  //   // convert rawTime from 00:00:00.00 to seconds.
  //   ar = rawTime.split(":").reverse();
  //   time = parseFloat(ar[0]);
  //   if (ar[1]) time += parseInt(ar[1]) * 60;
  //   if (ar[2]) time += parseInt(ar[2]) * 60 * 60;

  //   //calculate the progress
  //   progress = Math.round((time/duration) * 100);
  // }

  // result.status = 200;
  // result.duration = duration;
  // result.current  = time;
  // result.progress = progress;

  // /* UPDATE YOUR PROGRESSBAR HERE with above values ... */

  // if(progress==0){
  //     // TODO err - giving up after 8 sec. no progress - handle progress errors here
  //     console.log('{"status":-400, "error":"there is no progress while we tried to encode the video" }');
  //     return;
  // }

  if (matches && matches.length > 0) {
    const rawDuration = matches[1];

    let ar = rawDuration.split(':').reverse();
    duration = parseFloat(ar[0]);
    if (ar[1]) duration += parseInt(ar[1]) * 60;
    if (ar[2]) duration += parseInt(ar[2]) * 60 * 60;

    // get the time
    matches = content.match(/time=(.*?) bitrate/g);

    if (matches && matches.length > 0) {
      let rawTime = matches.pop();
      // needed if there is more than one match
      if (Array.isArray(rawTime)) {
        rawTime = rawTime.pop().replace('time=', '').replace(' bitrate', '');
      } else {
        rawTime = rawTime.replace('time=', '').replace(' bitrate', '');
      }
      // convert rawTime from 00:00:00.00 to seconds.
      ar = rawTime.split(':').reverse();
      time = parseFloat(ar[0]);
      if (ar[1]) time += parseInt(ar[1]) * 60;
      if (ar[2]) time += parseInt(ar[2]) * 60 * 60;

      // calculate the progress
      progress = Math.round((time / duration) * 100);
    }

    if (progress === 0) {
      // TODO err - giving up after 8 sec. no progress - handle progress errors here

      result = {
        id: video_path,
        status: false,
      };
    } else {
      result = {
        id: video_path,
        status: true,
        progress,
      };
    }
  } else if (content.indexOf('Permission denied') > -1) {
    result = {
      id: video_path,
      status: false,
      error:
        'ffmpeg : Permission denied, either for ffmpeg or upload location ...',
    };
  }
  return result;
};

module.exports = {
  convertRecordVideo,
  convertUploadVideo,
  getConvertStatus,
};
