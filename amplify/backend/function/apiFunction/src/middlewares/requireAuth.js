const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req,res, next) => {
  const { authorization } = req.headers;
  //authorization === bearer dasdadsad
  console.log('in middleware authorization', req.headers);
  if (!authorization){
    return res.status(401).send({error: 'You must be logged in'});
  }
  console.log('2');
  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
    if (err){
      return res.status(401).send({error: 'You must be logged in 2'});
    }

    const { userId } = payload;

    const user = await User.findById(userId);
    console.log(user);
    if(!user){
      return res.status(401).send({error:'Invalid authenticator'});
    };
    req.user = user;
    console.log('authorization completed', user);
    next();
  })
};
