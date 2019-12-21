const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator/check')
const User = require('../../models/user')
const Contact = require('../../models/contact')
const Tag = require('../../models/tag')
const Appointment = require('../../models/appointment')
const Activity = require('../../models/activity')
const PaymentCtrl = require('../../controllers/payment')
const config = require('../../config/config')

const signUp = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      error: errors.array()
    })
  }

  const password = req.body.password
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex')
  const user = new User({
    ...req.body,
    salt: salt,
    hash: hash,
    role: 'admin',
    updated_at: new Date(),
    created_at: new Date(),
  })

  user.save()
  .then(_res => {

    myJSON = JSON.stringify(_res)
    const data = JSON.parse(myJSON);
    delete data.hash
    delete data.salt
    res.send({
        status: true,
        data
    })
  })
  .catch(e => {
      let errors
    if (e.errors) {
      errors = e.errors.map(err => {      
        delete err.instance
        return err
      })
    }
    return res.status(500).send({
      status: false,
      error: errors || e
    })
  });
}

const login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(401).json({
      status: false,
      error: errors.array()
    })
  }

  const { email, password, user_name } = req.body
  if (!email && !user_name) {
    return res.status(401).json({
      status: false,
      error: 'missing_email_user_name'
    })
  }

  let _user = await User.findOne({ email: email, role: 'admin' })
  .exec();

  if(!_user) {
    _user = await User.findOne({ user_name: user_name, role: 'admin' })
    .exec();  
  }


  if (!_user) {
    return res.status(401).json({
      status: false,
      error: 'Invalid email or password!'
    })
  }


  // Check password
  const hash = crypto.pbkdf2Sync(password, _user.salt, 10000, 512, 'sha512').toString('hex');
  if (hash != _user.hash) {
    return res.status(401).json({
      status: false,
      error: 'Invalid email or password!'
    })
  }


  // TODO: Include only email for now
  const token = jwt.sign({id:_user.id}, config.JWT_SECRET)
  myJSON = JSON.stringify(_user)
  const user = JSON.parse(myJSON);
  delete user.hash
  delete user.salt

  // prevent user's password to be returned
  delete user.password
  res.send({
    status: true,
    data: {
      token,
      user
    }
  })
}

const editMe = async(req, res) =>{
  const user = req.currentUser

  const editData = req.body
  // TODO: should limit the editing fields here
  delete editData.password

  for (let key in editData) {
    user[key] = editData[key]
  }

  user.save()
  .then(_res => {
      myJSON = JSON.stringify(_res)
      const data = JSON.parse(myJSON);
      delete data.hash
      delete data.salt
      res.send({
        status: true,
        data
      })
  })
  .catch(e => {
      let errors
    if (e.errors) {
      errors = e.errors.map(err => {      
        delete err.instance
        return err
      })
    }
    return res.status(500).send({
      status: false,
      error: errors || e
    })
  });
}

const getAll = async (req, res, next) => {
  const page = req.params.page;
  const skip = (page - 1) * 15;
  const _users = await User.aggregate([
    {$skip: skip},
    {$limit: 15},
    {$project: {'salt': 0, 'hash': 0}}
  ]);
  const total = await User.countDocuments({});
  await User.populate(_users, {path: 'payment'})
  if(!_users){
    return res.status(400).json({
      status: false,
      error: 'Users doesn`t exist'
    })
  }
  res.send({
    status: true,
    data: _users,
    total: total
  })
}

const getProfile = async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findOne({_id: id}).populate('payment').catch(err => {
    return res.status(400).json({
      status: false,
      error: 'User doesn`t exist'
    })
  });

  res.send({
    status: true,
    data: user
  })
}

const checkAuth = async (req, res, next) => {
  const token = req.get('Authorization')
  let decoded
  try {
    decoded = jwt.verify(token, config.JWT_SECRET)
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.info('Auth Success:', decoded, ip)
  } catch (err) {
    console.error(err)
    return res.status(401).send({
      status: false,
      error: 'invalid_auth'
    })
    // err
  }

  req.currentUser = await User.findOne({ _id: decoded.id, role: 'admin' })

  if (req.currentUser) {
    next()
  } else {
    console.error('Valid JWT but no user:', decoded)
    res.send({
      status: false,
      error: 'invalid_user'
    })
  }
}

const resetPasswordByOld = async (req, res) => {

  const { old_password, new_password } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(401).json({
      status: false,
      error: errors.array()
    })
  }

  const _user = req.currentUser

   // Check old password
   const old_hash = crypto.pbkdf2Sync(old_password, _user.salt, 10000, 512, 'sha512').toString('hex');
   if (old_hash != _user.hash) {
     return res.status(400).json({
       status: false,
       error: 'Invalid old password!'
     })
   }

  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(new_password, salt, 10000, 512, 'sha512').toString('hex')

  _user.salt = salt
  _user.hash = hash
  _user.save()

  res.send({
    status: true
  })
}

const create = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      error: errors.array()
    })
  }
  let _user = await User.findOne({ email: req.body.email })
  if(_user != null){
    res.status(400).send({
      status: false,
      error: 'User already exists'
    })
    return;
  }

  const {email} = req.body 
  
  if(isBlockedEmail(email)){
    res.status(400).send({
      status: false,
      error: 'Sorry, Apple and Yahoo email is not support type for sign up in our CRM'
    })
    return;
  }
  
  let password = req.body.password || config.DEFAULT_PASS
    
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex')  
    
    const user = new User({
      ...req.body,
      payment: payment.id,
      salt: salt,
      hash: hash,
      updated_at: new Date(),
      created_at: new Date(),
    })

    user.save()
    .then(_res => {
      sgMail.setApiKey(config.SENDGRID.SENDGRID_KEY)
      let msg = {
        to: _res.email,
        from: mail_contents.WELCOME_SIGNUP.MAIL,
        templateId: config.SENDGRID.SENDGRID_SIGNUP_FLOW_FIRST,
        dynamic_template_data: {
          first_name: _res.user_name,
          login_credential: `<a style="font-size: 15px;" href="${urls.LOGIN_URL}">${urls.LOGIN_URL}</a>`,
          user_email: _res.email,
          user_password: password,
          contact_link: `<a href="${urls.CONTACT_PAGE_URL}">Click this link - Your Profile</a>`
        },
      };

      sgMail.send(msg).catch(err=>{
        console.log('err', err)
      })

      msg = {
        to: _res.email,
        from: mail_contents.WELCOME_SIGNUP.MAIL,
        templateId: config.SENDGRID.SENDGRID_SIGNUP_FLOW_SECOND,
        dynamic_template_data: {
          first_name: _res.user_name,
          // connect_email: `<a href="${urls.PROFILE_URL}">Connect your email</a>`,
          upload_avatar:  `<a href="${urls.PROFILE_URL}">Load your professional headshot picture</a>`,
          upload_spread:  `<a href="${urls.CONTACT_PAGE_URL}">Upload a spreadsheet</a>`,
          contact_link: `<a href="${urls.CONTACT_CSV_URL}">Click this link - Download CSV</a>`
        }
      }

      sgMail.send(msg).catch(err=>{
        console.log('err', err)
      })

      myJSON = JSON.stringify(_res)
      const user = JSON.parse(myJSON);
      delete user.hash
      delete user.salt
      
      res.send({
        status: true,
        data: {
          user
        }
      })   
    })
    .catch(e => {
        let errors
      if (e.errors) {
        errors = e.errors.map(err => {      
          delete err.instance
          return err
        })
      }
      return res.status(500).send({
        status: false,
        error: errors || e
      })
    });
}

const closeAccount = async(req, res) =>{

  const user = await User.findOne({_id: req.params.id})
  const data = await Contact.find({user: req.params.id})
  if (!data) {
      return false;
  }

  for(let i=0; i<data.length; i++){
    const contact = data[i]
    await Contact.deleteOne({_id: contact})
    await Activity.deleteMany({contacts: contact})
    await FollowUp.deleteMany({contact: contact})
    await Appointment.deleteMany({contact: contact})
  }
  await Tag.deleteMany({user: req.params.id})
  if(user['payment']){
    PaymentCtrl.cancelCustomer(user['payment']).catch(err=>{
      console.log('err', err)
    })
  }
  user['del'] = false
  user.save().catch(err=>{
    console.log('err', err)
  })
  
  return res.send({
    status: true,
  })
}

module.exports = {
    signUp,
    login,
    editMe,
    getAll,
    getProfile,
    resetPasswordByOld,
    checkAuth,
    create,
    closeAccount
}

