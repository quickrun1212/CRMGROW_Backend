const express = require('express')

const UserCtrl = require('../controllers/user')
const ActivityCtrl = require('../controllers/activity')
const { catchError } = require('../controllers/error')

const router = express.Router()

router.post('/', UserCtrl.checkAuth, catchError(ActivityCtrl.create))
router.get('/' , UserCtrl.checkAuth, catchError(ActivityCtrl.get))
router.get('/:id', UserCtrl.checkAuth, catchError(ActivityCtrl.get))

module.exports = router
