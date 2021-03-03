const User = require('../models/user');
const Fact = require('../models/fact');
const fs = require('fs');
const mongoose = require('mongoose');

const LOG_IN_MSG = 'Please, log in';

exports.getUser = function(request, response) {
  console.log('Getting user');
  let userId = request.params['userId'];
   
  User.findById(userId)
	.exec(function(err, user){
      if (err) {
	    console.log(err);
	    response.status(500).send('Error');
	    return;
	  }
	
	  if (!user) {
	    response.send('Can not find user');
	    return;
	  }
	
	  if (request.cookies === undefined && request.cookies.userId === undefined) {
	    response.status(401).send(LOG_IN_MSG);
	    return;
	  }
	  
	  let myProfile = request.cookies.userId === user._id;
	  console.log(myProfile);
	  
	  let facts = [];
	  
	  Fact.find({}).populate('author').exec(function(err, facts) {
	    if (err) {
	      console.log(err);
	      response.status(500).send('Error');
        }
		
		console.log(facts);
		
		response.render('facts.ejs', {
		user: user, 
		facts: facts,
		userId: request.cookies.userId, 
		userName: request.cookies.userName,
		myProfile: myProfile
	    });
	  });
  });
}