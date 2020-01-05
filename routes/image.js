const express = require('express')
const AWS = require('aws-sdk')
const multer = require('multer');
const multerS3 = require('multer-s3')

const ImageCtrl = require('../controllers/image')
const UserCtrl = require('../controllers/user')
const { catchError } = require('../controllers/error')
const config = require('../config/config')


const s3 = new AWS.S3({
  accessKeyId: config.AWS.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS.AWS_SECRET_ACCESS_KEY,
  region: config.AWS.AWS_S3_REGION
})

const router = express.Router()

const storage = multerS3({
  s3: s3,
  bucket: config.AWS.AWS_S3_BUCKET_NAME,
  acl: 'public-read',
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    const today = new Date()
    const year = today.getYear()
    const month = today.getMonth()
    cb(null, 'image ' + year + '/' + month + '/' + file.originalname)
  },
}) 


const upload = multer({
  storage: storage
})

// Upload a pdf
router.post('/', UserCtrl.checkAuth, UserCtrl.checkSuspended, upload.single('image'), catchError(ImageCtrl.create))

// Upload a preview and detail info
router.put('/:id', UserCtrl.checkAuth, catchError(ImageCtrl.updateDetail))

// Upload a preview and detail info
router.get('/preview/:name', catchError(ImageCtrl.getPreview))

// Get a pdf
router.get('/:id', catchError(ImageCtrl.get))

// Get all pdf
router.get('/', UserCtrl.checkAuth, catchError(ImageCtrl.getAll))

// Send PDF
router.post('/send', UserCtrl.checkAuth, UserCtrl.checkSuspended, catchError(ImageCtrl.sendImage))

// Send Video on text
router.post('/send-text', UserCtrl.checkAuth, UserCtrl.checkSuspended, catchError(ImageCtrl.sendText))

// Bulk videos
router.post('/bulk-email', UserCtrl.checkAuth, UserCtrl.checkSuspended, catchError(ImageCtrl.bulkEmail))

// Bulk texts
router.post('/bulk-text', UserCtrl.checkAuth, UserCtrl.checkSuspended, catchError(ImageCtrl.bulkText))

// Delete a pdf
router.delete('/:id', UserCtrl.checkAuth, catchError(ImageCtrl.remove))


module.exports = router