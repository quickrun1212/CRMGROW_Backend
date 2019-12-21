const express = require('express')

const UserCtrl = require('../controllers/user')
const PaymentCtrl = require('../controllers/payment')
const { catchError } = require('../controllers/error')

const router = express.Router()

router.post('/', UserCtrl.checkAuth, catchError(PaymentCtrl.update))
router.post('/failed', catchError(PaymentCtrl.paymentFailed))
router.get('/:id' , UserCtrl.checkAuth, catchError(PaymentCtrl.get))

module.exports = router
