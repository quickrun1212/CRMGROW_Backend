const express = require('express')

const UserCtrl = require('../controllers/user')
const ContactCtrl = require('../controllers/contact')
const { catchError } = require('../controllers/error')
const { FILES_PATH } = require('../config/path')

const multer = require('multer')

const router = express.Router()

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, FILES_PATH)
    }
  })

const upload = multer({ storage: fileStorage })

router.post('/', UserCtrl.checkAuth, catchError(ContactCtrl.create))
router.get('/' , UserCtrl.checkAuth, catchError(ContactCtrl.getAll))

// Edit contact by id
router.put('/:id', UserCtrl.checkAuth, catchError(ContactCtrl.edit))

// Remove contact and its all related info (activity, followup) by id
router.delete('/:id', UserCtrl.checkAuth, catchError(ContactCtrl.remove))

// Remove contacts and their relative info
router.post('/remove', UserCtrl.checkAuth, catchError(ContactCtrl.removeContacts))

// Send Batch email to contact lists
router.post('/batch', UserCtrl.checkAuth, catchError(ContactCtrl.sendBatch))

// Send Batch email to contact lists
router.post('/email', UserCtrl.checkAuth, catchError(ContactCtrl.sendEmail))

// Import contact list as file
router.post('/import-csv', UserCtrl.checkAuth, upload.single('csv'), catchError(ContactCtrl.importCSV))

// Download contact list as csv file
router.post('/export-csv', UserCtrl.checkAuth, catchError(ContactCtrl.exportCSV))

// Get a search contact info for profile page
router.post('/search', UserCtrl.checkAuth, catchError(ContactCtrl.search))

// Get a easy search contact info for profile page
router.post('/search-easy', UserCtrl.checkAuth, catchError(ContactCtrl.searchEasy))

// Get a pull contact info for profile page
router.get('/:id', UserCtrl.checkAuth, catchError(ContactCtrl.get))

// Get a Contact data with ID
router.get('/get/:id', UserCtrl.checkAuth, catchError(ContactCtrl.getById))

// Get Contacts data with ID array
router.post('/get', UserCtrl.checkAuth, catchError(ContactCtrl.getByIds))

module.exports = router
