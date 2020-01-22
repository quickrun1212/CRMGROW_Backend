const Garbage = require('../models/garbage');

const get = async(req, res) => {
  const data = await Garbage.find({_id: req.params.id});
  if (!data) {
    return res.status(400).json({
      status: false,
      error: 'Garbage doesn`t exist'
    })
  }

  res.send({
    status: true,
    data
  })
}

const create = async(req, res) => {
  const { currentUser } = req

  const garbage = new Garbage({
    ...req.body,
    user: currentUser.id,
    updated_at: new Date(),
    created_at: new Date(),
  })
  garbage.save().then(()=>{
    return res.send({
      status: true,
    })
  }).catch(err=>{
    console.log('err', err)
    return res.status(500).json({
      status: false,
      error: err.message || 'Internal server error'
    })
  })
}

const edit = async(req, res) => {
  const editData = req.body
  
  const garbage = await Garbage.findOne({_id: req.params.id})
  if(!garbage){
    return res.status(400).json({
      status: false,
      error: 'Not found Garbage'
    })
  }
  
  for (let key in editData) {
    garbage[key] = editData[key]
  }
  
  garbase.save()
    .then(()=>{
      return res.send({
        status: true,
      })
    }).catch(err=>{
      console.log('err', err)
      return res.status(500).json({
        status: false,
        error: err.message || 'Internal server error'
      })
    })

}

module.exports = {
    get,
    create,
    edit
}