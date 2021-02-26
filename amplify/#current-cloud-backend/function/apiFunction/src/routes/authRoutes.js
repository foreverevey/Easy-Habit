const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
var aws = require("aws-sdk");
var ses = new aws.SES({ region: "eu-west-1" });

const router = express.Router();

router.post('/signup', async (req,res)=>{
  const { email, password } = req.body;

  try {
    const user = new User({email,password});
    await user.save();

    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    res.send({ token });
  } catch(err){
    return res.status(422).send(err.message);
  }
});

router.post('/signin', async (req, res)=>{
  const { email, password } = req.body;
  console.log('we here');
  if (!email || ! password){
    return res.status(422).send({error: 'Must provide email and password!'});
  }
  console.log(email,password);
  const user = await User.findOne({email});
  console.log(user);
  if (!user){
    return res.status(404).send({error: 'Email not found'});
  }
  try{
    await user.comparePassword(password);
    const token = jwt.sign( {userId: user._id }, 'MY_SECRET_KEY');
    console.log(token);
    res.send({ token });
    console.log('sent');
  } catch(err){
    return res.status(422).send({error: 'Invalid password or email'})
  }

});

router.post('/signin/forgot', async (req, res)=>{
  const { email } = req.body;
  if (!email){
    return res.status(422).send({error: 'Must provide email!'});
  }
  const user = await User.findOne({email});
  console.log(user);
  if (!user){
    console.log('sending 404 status');
    return res.status(404).send({error: 'Email not found'});
  }
  try{
    var val = Math.floor(1000 + Math.random() * 9000).toString();
    await User.findOneAndUpdate({email}, {$set: {'code': val}}).exec(async function(err, user){
      if(err) return res.status(422).send({error: err.message});
      console.log('worked, and updated with code', val);
      var body = "Your code is " + val;
      var subject = "Password reset Easy Habit";
      var params = {
    		Destination: {
    			ToAddresses: [ email ],
    		},
    		Message: {
    			Body: {
    				Text: { Data: body },
    			},

    			Subject: { Data: subject },
    		},
    		Source: 'patkppDev@gmail.com' ,
    	};
      try {
      	await ses.sendEmail(params).promise();
        console.log('sending email');
    		return res.status(200).send('Success Sending Email');
      } catch(err){
        console.log('sending failed', err);
        return res.status(422).send(err.message);
      }
      return res.send('code updated');
    })
  } catch(err){
    return res.status(422).send({error: 'Error with user code'})
  }
});

router.post('/signin/submit', async (req, res)=>{
  const { email, code } = req.body;
  if (!email || !code){
    return res.status(422).send({error: 'Must provide code and email!'});
  }
  const user = await User.findOne({email, code});
  if (!user){
    return res.status(404).send({error: 'User not found'});
  }
  try{
    await User.findOneAndUpdate({email}, {$set: {'code': null}}).exec(function(err, user){
      if(err) return res.status(422).send({error: err.message});
      return res.send('code updated');
    })
  } catch(err){
    return res.status(422).send({error: 'Error with user code'})
  }
});

router.post('/signin/change', async (req, res)=>{
  const { email, password } = req.body;
  if (!email || !password){
    return res.status(422).send({error: 'Must provide password and email!'});
  }
  const user = await User.findOne({email});
  if (!user){
    return res.status(404).send({error: 'User not found'});
  }
  try{
    await User.findOneAndUpdate({email}, {$set: {'password': password}}).exec(function(err, user){
      if(err) return res.status(422).send({error: err.message});
      return res.send('password updated');
    })
  } catch(err){
    return res.status(422).send({error: 'Error with user code'})
  }
});

module.exports = router;
