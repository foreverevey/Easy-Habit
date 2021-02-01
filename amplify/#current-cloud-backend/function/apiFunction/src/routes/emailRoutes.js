const express = require('express');
var aws = require("aws-sdk");
var ses = new aws.SES({ region: "eu-west-1" });

const router = express.Router();

router.post('/email', async (req,res)=>{
  const { to, from, body, subject } = req.body;
	var params = {
		Destination: {
			ToAddresses: [ to ],
		},
		Message: {
			Body: {
				Text: { Data: body },
			},

			Subject: { Data: subject },
		},
		Source: from ,
	};
  try {
  	await ses.sendEmail(params).promise();
    console.log('sending email');
		return res.status(200).send('Success Sending Email');
  } catch(err){
    console.log('sending failed', err);
    return res.status(422).send(err.message);
  }
});

module.exports = router;
