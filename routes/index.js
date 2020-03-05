const express = require('express');
const config = require('../lib/config')
const db = require('../lib/db')

var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({service: config.getServiceTitle()})
});

router.post('/ping', async function (req, res, next) {
  try {
    var {userId, beakerVersion, os} = req.query
    if (!userId) return res.status(400).json({error: 'userId is required'})

    var oldPing = await db.knex('pings').select().where({userId}).limit(1)
    await db.knex('pings').insert({
      userId,
      isFirstPing: oldPing && oldPing[0] ? 0 : 1,
      beakerVersion,
      os
    })
    return res.status(204).end()
  } catch (e) {
    next(e)
  }
})


module.exports = router;
