const DealStage = require('../models/deal_stage');
const Deal = require('../models/deal');
const Activity = require('../models/activity');
const Contact = require('../models/contact');
const ActivityHelper = require('../helpers/activity');

const getAll = async (req, res) => {
  const { currentUser } = req;

  const data = await DealStage.find({ user: currentUser.id })
    .populate({
      path: 'deals',
      populate: { path: 'contacts', select: 'first_name last_name email' },
    })
    .sort({ priority: 1 });

  if (!data) {
    return res.status(400).json({
      status: false,
      error: 'Deals doesn`t exist',
    });
  }

  return res.send({
    status: true,
    data,
  });
};

const create = async (req, res) => {
  const { currentUser } = req;

  const deal_stage = new DealStage({
    ...req.body,
    user: currentUser.id,
    updated_at: new Date(),
    created_at: new Date(),
  });

  deal_stage
    .save()
    .then((_deal_stage) => {
      return res.send({
        status: true,
        data: _deal_stage,
      });
    })
    .catch((err) => {
      return res.status(400).send({
        status: false,
        error: err.message,
      });
    });
};

const remove = async (req, res) => {
  const { currentUser } = req;
  const { remove_stage, move_stage } = req.body;
  const deal_stage = await DealStage.findOne({
    _id: remove_stage,
    user: currentUser.id,
  }).catch((err) => {
    console.log('deal stage err', err.message);
  });

  if (!deal_stage) {
    return res.status(400).json({
      status: false,
      error: 'Permission invalid',
    });
  }

  Deal.updateMany(
    {
      _id: { $in: deal_stage.deals },
    },
    {
      $set: {
        deal_stage: move_stage,
      },
    }
  ).catch((err) => {
    console.log('move deals into other stage', err.message);
  });

  const deals = await Deal.find({ _id: { $in: deal_stage.deals } });
  const dealIds = [];
  deals.forEach((e) => {
    dealIds.push(e._id);
  });
  await DealStage.update(
    { _id: move_stage },
    { $addToSet: { deals: { $each: dealIds } } }
  );

  DealStage.deleteOne({
    _id: remove_stage,
  })
    .then(() => {
      return res.send({
        status: true,
      });
    })
    .catch((err) => {
      console.log('deal stage remove err', err.message);
    });
};

const edit = async (req, res) => {
  const { currentUser } = req;

  DealStage.updateOne(
    {
      _id: req.params.id,
      user: currentUser.id,
    },
    {
      $set: { ...req.body },
    }
  )
    .then(() => {
      return res.send({
        status: true,
      });
    })
    .catch((err) => {
      console.log('deal stage update err', err.message);
      return res.status(500).json({
        status: false,
        error: err.message,
      });
    });
};

const changeOrder = async (req, res) => {
  const orderInfo = req.body;
  for (const prop in orderInfo) {
    console.log(prop, orderInfo[prop]);
    await DealStage.updateOne(
      { _id: prop },
      { $set: { priority: orderInfo[prop] } }
    );
  }
  return res.send({
    status: true,
  });
};

module.exports = {
  getAll,
  create,
  remove,
  edit,
  changeOrder,
};
