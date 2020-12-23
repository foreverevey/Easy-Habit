const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Habit = mongoose.model('Habit');
const Dates = mongoose.model('Dates');

const router = express.Router();

router.use(requireAuth);

// GET all habits by user ID which we get in requireAuth asigning user
// to req.user
// habits - array
router.get('/habits', async (req,res) =>{
  const habits = await Habit.find({userId: req.user._id}).populate('dates').exec(function(error, habits){
    res.send(habits);
  });;
  // res.send(habits);
});
// GET one habit by user ID and habit ID
router.get('/habit', async (req,res)=>{
  const id = req.query.id;
  if(!id){
    return res.status(422).send({error: 'You must provide an id'})
  }
  const habit = await Habit.find({userId: req.user._id, _id: id}).populate('dates').exec(function(error, habit){
    console.log(habit);
    res.send(habit);
  });
  // res.send(habit);
});

//Create habit, so we dont need dates, because creating it is empty
router.post('/habits', async(req,res)=>{
  const { name, private_bool, description } = req.body;

  if (!name){
    return res.status(422).send({error: 'You must provide a name'})
  }
  try{
    const habit = new Habit({ name, private_bool, userId: req.user._id, description});
    await habit.save();
    res.send(habit);
  } catch (err){
    res.status(422).send({error: err.message});
  }
});

router.post('/habit/add-date', async(req,res)=>{
  const { id, date } = req.body;
  if (!date){
    return res.status(422).send({error: 'You must provide a date'})
  }
  try{
    // const habit = await Habit.findById(id).exec();
    // console.log('habit', habit);
    const checkDate = await Dates.findOne({date: new Date(date)}).exec();
    if(!checkDate){
      const todayDate = new Dates({date: date});
      await todayDate.save();
      const habit = await Habit.findOneAndUpdate({'_id' : id} ,{ $push: { 'dates': todayDate._id }}, {'new': true})
      .populate('dates')
      .exec(function(err,habit) {
        if (err) return res.status(422).send({error: err.message});
        res.send(habit)
      });
      // habit.dates.push(todayDate._id);
      // await habit.save();
      // await habit.populate('dates').exec(function(error, habit){
      //   console.log(habit, 'habit ppopulate');
      //   res.send(habit);
      // });
      // res.send(habit);
      // console.log('todayDate2', todayDate);
      } else{
        const habit = await Habit.findOneAndUpdate({'_id' : id} ,{ $push: { 'dates': checkDate._id }}, {'new': true})
        .populate('dates')
        .exec(function(err,habit) {
          if (err) return res.status(422).send({error: err.message});
          res.send(habit)
      });
      // habit.dates.push(checkDate._id);
      // await habit.save();
      // await habit.populate('dates').exec(function(error, habit){
      //   console.log(habit, 'habit ppopulate');
      //   res.send(habit);
      // });
      // res.send(habit);
    }
  } catch (err){
    console.log(err);
    res.status(422).send({error: err.message});
  }
});

router.post('/habit/remove-date', async(req,res)=>{
  const { id, date } = req.body;
  if (!date){
    return res.status(422).send({error: 'You must provide a date'})
  }
  try{
    // const habit = await Habit.findById(id).exec();
    // console.log('habit', habit);
    const todayDate = await Dates.findOne({date: new Date(date)}).exec();
    console.log('todayDate', todayDate);
    if(todayDate){
      const habit = await Habit.findOneAndUpdate({'_id' : id} ,{ $pull: { 'dates': todayDate._id }}, {'new': true})
      .populate('dates')
      .exec(function(err,habit) {
        if (err) return res.status(422).send({error: err.message});;
        res.send(habit)
      });
      // habit.dates.pull(todayDate._id);
      // await habit.save();
      // await habit.populate('dates').exec(function(error, habit){
      //   console.log(habit, 'habit ppopulate');
      //   res.send(habit);
      // });
      // // res.send(habit);
    } else {
      return res.status(422).send({error: 'Cant delete unselected date'})
      // await habit.populate('dates').exec(function(error, habit){
      //   console.log(habit, 'habit ppopulate');
      //   res.send(habit);
      // });
      // res.send(habit);
    };
  } catch (err){
    res.status(422).send({error: err.message});
  }
});

router.delete('/habit/:id', async(req,res)=>{
  const id = req.params.id;
  try{
    Habit.deleteOne({ _id: id}, function(err, result){
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
