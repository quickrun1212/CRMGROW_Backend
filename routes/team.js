const express = require('express');

const UserCtrl = require('../controllers/user');
const TeamCtrl = require('../controllers/team');
const { catchError } = require('../controllers/error');

const router = express.Router();

router.post('/', UserCtrl.checkAuth, catchError(TeamCtrl.create));
router.get('/', UserCtrl.checkAuth, catchError(TeamCtrl.get));
router.put('/:id', UserCtrl.checkAuth, catchError(TeamCtrl.update));
router.post(
  '/bulk-invite',
  UserCtrl.checkAuth,
  catchError(TeamCtrl.bulkInvites)
);
router.post(
  '/accept/:id',
  UserCtrl.checkAuth,
  catchError(TeamCtrl.acceptInviation)
);
module.exports = router;
