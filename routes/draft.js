const express = require('express');

const UserCtrl = require('../controllers/user');
const DraftCtrl = require('../controllers/draft');
const { catchError } = require('../controllers/error');

const router = express.Router();

router.post(
  '/',
  UserCtrl.checkAuth,
  UserCtrl.checkSuspended,
  catchError(DraftCtrl.create)
);
router.get('/', UserCtrl.checkAuth, catchError(DraftCtrl.get));

router.put('/:id', UserCtrl.checkAuth, catchError(DraftCtrl.update));
router.delete('/:id', UserCtrl.checkAuth, catchError(DraftCtrl.remove));

module.exports = router;
