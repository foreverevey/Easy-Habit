const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Tracker = mongoose.model('Tracker');

const router = express.Router();

router.use(requireAuth);

router.get('/tracker', async (req,res) =>{
  const habitId = req.params.habitId;
  try{
    const tracker = await Habit.find({userId: req.user._id, habitId: habitId});
    res.send(tracker);
  } catch(err){
    res.status(422).send({error: err.message});
  }

});

//Create habit, so we dont need dates, because creating it is empty
router.post('/tracker', async(req,res)=>{
  const { habitId, date } = req.body;

  if (!habitId){
    return res.status(422).send({error: 'habitId missing'})
  }
  if (!date){
    return res.status(422).send({error: 'date missing'})
  }
  try{
    const tracker = new Tracker({ userId: req.user._id, habitId, date});
    await tracker.save();
    res.send(tracker);
  } catch (err){
    res.status(422).send({error: err.message});
  }
});

router.delete('/tracker', async(req,res)=>{
  const { habitId, date } = req.body;
  try{
    Tracker.deleteOne({ userId: req.user._id, habitId: habitId, date: date}, function(err, result){
      if (err){
        res.send(err);
      } else{
        res.send(result);
      }
    });
  } catch (err){
    res.status(422).send({error: err.message});
  }
});

module.exports = router;
