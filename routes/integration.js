const express = require('express');

const UserCtrl = require('../controllers/user');
const IntegrationCtrl = require('../controllers/integration');
const DeveloperCtrl = require('../controllers/developer');
const { catchError } = require('../controllers/error');

const router = express.Router();

router.get('/token', UserCtrl.checkAuth, catchError(DeveloperCtrl.createToken));
router.post(
  '/calendly/check-auth',
  UserCtrl.checkAuth,
  catchError(IntegrationCtrl.checkAuthCalendly)
);
router.get(
  '/calendly',
  UserCtrl.checkAuth,
  catchError(IntegrationCtrl.getCalendly)
);
router.post(
  '/calendly/set-event',
  UserCtrl.checkAuth,
  catchError(IntegrationCtrl.setEventCalendly)
);
router.get(
  '/calendly/disconnect',
  UserCtrl.checkAuth,
  catchError(IntegrationCtrl.disconnectCalendly)
);

router.post(
  '/sync-smtp',
  UserCtrl.checkAuth,
  catchError(IntegrationCtrl.connectSMTP)
);

module.exports = router;
