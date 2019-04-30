const path = require('path')
const fs = require('fs')
const sgMail = require('@sendgrid/mail')
const base64Img = require('base64-img');
const mime = require('mime-types')

const User = require('../models/user')
const Activity = require('../models/activity')
const Video = require('../models/video')
const VideoTracker = require('../models/video_tracker')
const { THUMBNAILS_PATH } = require('../config/path')
const urls = require('../constants/urls')
const config = require('../config/config')
const mail_contents = require('../constants/mail_contents')
const uuidv1 = require('uuid/v1')

const create = async (req, res) => {
  if (req.file) {
      if(req.currentUser){
        const video = new Video({
          user: req.currentUser.id,
          type: req.file.mimetype,
          url: req.file.location,
          role: 'user',
          created_at: new Date()
        })

        video.save().then((_video)=>{
          res.send({
            status: true,
            data: _video
          })
        })
    }
  }
}

const updateDetail = async (req, res) => {
  const {currentUser} = req
  if (req.body.thumbnail) { // base 64 image
    const editData = req.body
    const file_name = uuidv1()
    const file_path = base64Img.imgSync(req.body.thumbnail, THUMBNAILS_PATH, file_name)
      const video = await Video.findOne({user: currentUser.id, _id: req.params.id})

      if (!video) {
        return res.status(401).json({
          status: false,
          error: 'Invalid_permission'
        })
      }

      for (let key in editData) {
        video[key] = editData[key]
      }

      video['thumbnail'] = urls.VIDEO_THUMBNAIL_URL + path.basename(file_path)

      video["updated_at"] = new Date()

      video.save().then((_video)=>{
        console.log('video', video)
        res.send({
          status: true,
          data: _video
        })
      })

  }else{
    res.status(401).json({
      status: false,
      error: 'Not_found_thumbnail'
    })
  }
}


const get = async (req, res) => {
  console.log('id', req.params.id)
  const video = await Video.findOne({_id: req.params.id})
  const user = await User.findOne({_id: video.user})
    if (!video) {
      return res.status(401).json({
        status: false,
        error: 'Video doesn`t exist'
      })
    }
    myJSON = JSON.stringify(video)
    const data = JSON.parse(myJSON);
    Object.assign(data, {"user": user})

  res.send({
    status: true,
    data
  })

}

const getThumbnail = (req, res) => {
  const filePath = THUMBNAILS_PATH + req.params.name
  console.info('File Path:', filePath)
  if (fs.existsSync(filePath)) {
    const contentType = mime.contentType(path.extname(req.params.name))
    res.set('Content-Type', contentType)
    res.sendFile(filePath)
  } else {
    res.status(404).send({
      status: false,
      error: 'Thumbnail does not exist'
    })
  }
}

const getAll = async (req, res) => {
  const {currentUser} = req
  const _video = VideoTracker.find({ user: currentUser.id})

  if (!_video) {
    return res.status(401).json({
      status: false,
      error: 'Video doesn`t exist'
    })
  }

  let _video_list = await Video.find({user: currentUser.id})
  let _video_admin = await Video.find({role: "admin"})
  Array.prototype.push.apply(_video_list, _video_admin)

  console.log('_video_list', _video_list)
  if (!_video_list) {
    return res.status(401).json({
      status: false,
      error: 'Video doesn`t exist'
    })
  }
  let _video_detail_list = []

  for(let i = 0; i < _video_list.length; i ++){
    const _video_detail = await VideoTracker.aggregate([
        {
          $lookup:
            {
            from:  'videos',
            localField: 'video',
            foreignField: '_id',
            as: "video_detail"
            }
        },
        {
          $match: { "video": _video_list[i]._id }
        }
    ])

    myJSON = JSON.stringify(_video_list[i])
    const _video = JSON.parse(myJSON);
    const video_detail = await Object.assign(_video, {"views": _video_detail.length})
    _video_detail_list.push(video_detail)
  }

  res.send({
    status: true,
    data: _video_detail_list
  })
}

const sendVideo = async (req, res) => {
  const { currentUser } = req
  const {email, content, video, contact, contact_name} = req.body
  sgMail.setApiKey(config.SENDGRID_KEY);

  const video_link =urls.MATERIAL_VIEW_VIDEO_URL + '?video=' + video + '&contact=' + contact + '&user=' + currentUser.id
  const msg = {
    to: email,
    from: mail_contents.WELCOME_SEND_VIDEO.MAIL,
    subject: mail_contents.WELCOME_SEND_VIDEO.SUBJECT,
    html: '<p>Test data</p>' + '<a href="'+ video_link + '"></a>' + currentUser.email_signature,
  }

  sgMail.send(msg).then((_res) => {
    console.log('mailres.errorcode', _res[0].statusCode);
    if(_res[0].statusCode >= 200 && _res[0].statusCode < 400){ 
      const activity = new Activity({
        content: currentUser.user_name + ' sent video',
        contacts: contact,
        user: currentUser.id,
        type: 'videos',
        videos: video,
        created_at: new Date(),
        updated_at: new Date(),
      })     
      activity.save().then(()=>{
        res.send({
          status: true,
        })
      })         
    }else {
      res.status(404).send({
        status: false,
        error: _res[0].statusCode
      })
    }
  }).catch ((e) => {
    console.error(e)
    res.status(500).send({
      status: false,
      error: 'internal_server_error'
    })
  })
}

const remove = async (req, res) => {
    const { currentUser } = req
    try {
      const video = Video.findOne({ user: currentUser.id, _id: req.params.id})
  
      if (video) {
        fs.unlinkSync(THUMBNAILS_PATH + req.params.id)
        res.send({
          status: true,
          data: {
            file_name: req.params.id
          }
        })
      } else {
        res.status(404).send({
          status: false,
          error: 'thumbnail_not_found'
        })
      }
    } catch (e) {
      console.error(e)
      res.status(500).send({
        status: false,
        error: 'internal_server_error'
      })
    }
}

const getHistory = async(req, res) => {
  const { currentUser } = req
  // const _activity_list = Activity.find({user: currentUser.id, video: req.params.id})
  const _activity_list = await Activity.aggregate([
    {
      $lookup:
        {
        from:  'contacts',
        localField: 'contacts',
        foreignField: '_id',
        as: "video_detail"
        }
    },
    {
      $match: { "video": req.params.id, "user": currentUser.id}
    }
  ])
  for(let i = 0; i < _activity_list.length; i ++){
    const _video_tracker = VideoTracker.find({contact: _activity_list[i].contact, video: req.params.id, user: currentUser.id})
    _activity_list[i].video_tracker = _video_tracker;
  }
  if (_activity_list) {
    res.send({
      status: true,
      data: {
        data: _activity_list
      }
    })
  } else {
    res.status(404).send({
      status: false,
      error: 'Activity not found'
    })
  }
}
module.exports = {
    create,
    updateDetail,
    get,
    getThumbnail,
    getAll,
    sendVideo,
    remove,
    getHistory
}