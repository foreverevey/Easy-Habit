const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email:{
    type: String,
    unique: true,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  code:{
    type: String,
    required: false,
  },
});
//hashing and salting process
userSchema.pre('save', function(next){
  const user = this;
  if (!user.isModified('password')){
    return next();
  }

  bcrypt.genSalt(10, (err, salt)=>{
    if(err){
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash)=>{
      if (err){
        return next(err);
      }
      console.log('hashing user password');
      user.password = hash;
      next();
    });
  });
});

userSchema.pre('findOneAndUpdate', function(next){
  const password = this.getUpdate().$set.password;
  console.log('update user pass', password);
  if (!password) {
      return next();
  }

  bcrypt.genSalt(10, (err, salt)=>{
    if(err){
      return next(err);
    }

    bcrypt.hash(password, salt, (err, hash)=>{
      if (err){
        return next(err);
      }
      console.log('hashing user password on update', hash);
      this.getUpdate().$set.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword){
  const user = this;
  return new Promise((resolve, reject)=>{
    bcrypt.compare(candidatePassword, user.password, (err, isMatch)=>{
      if (err){
        return reject(err);
      }

      if (!isMatch){
        return reject(false);
      }

      resolve(true);
    });
  });
}

mongoose.model('User', userSchema);
