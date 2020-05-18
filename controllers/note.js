const { validationResult } = require('express-validator/check')
const Note = require('../models/note');
const Activity = require('../models/activity');
const Contact = require('../models/contact');

const get = async(req, res) => {
  const { currentUser } = req
  const query = {...req.query}
  const contact = query['contact']

  const data = await Note.find({user :currentUser.id, contact: contact});
  if (!data) {
    return res.status(400).json({
      status: false,
      error: 'Note doesn`t exist'
    })
  }

  res.send({
    status: true,
    data
  })
}

const create = async(req, res) => {
  const { currentUser } = req
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      error: errors.array()
    })
  }

  const note = new Note({
    ...req.body,
    user: currentUser.id,
    updated_at: new Date(),
    created_at: new Date(),
  })
  
  note.save()
  .then(_note => {

    const activity = new Activity({
      content: 'added note',
      contacts: _note.contact,
      user: currentUser.id,
      type: 'notes',
      notes: _note.id,
      created_at: new Date(),
      updated_at: new Date(),
    })

    activity.save().then(_activity => {
      Contact.updateMany({_id: _note.contact} ,{ $set: {last_activity: _activity.id} }).catch(err=>{
        console.log('err', err)
      })
      myJSON = JSON.stringify(_note)
      const data = JSON.parse(myJSON);
      data.activity = _activity
      res.send({
        status: true,
        data
      })
    })    
  })
  .catch(err => {
    return res.status(400).send({
      status: false,
      error: err.message
    })
  });
}

module.exports = {
    get,
    create,
}