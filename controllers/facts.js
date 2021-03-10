const LOG_IN_MSG = 'You need to log in';

const fs = require('fs');

const Fact = require('../models/fact');
const User = require('../models/user');

exports.getFactCreation = function(request, response) {
	response.render('fact_creation.ejs', {userId: request.cookies.userId, userName: request.cookies.userName});
}

exports.createFact = function(request, response) {
  let date = new Date();
  if (request.cookies === undefined) {
	console.log('No cookies');
    response.send(LOG_IN_MSG);
	return;
  }
  
  let userId = request.cookies.userId;
  if (userId === undefined) {
    console.log('No userId cookie');  
    response.send(LOG_IN_MSG);
	return;
  }
 
  if (request.body.fact_title == undefined || request.body.fact_content == undefined) {
    response.send('File title and content must be specified');
	return;
  }
  
  let fact = new Fact({
    date: date,
	title: request.body.fact_title,
	content: request.body.fact_content, 
    author: userId, 
    image: request.file.fact_file
  });
  
  fact.save(function(err) {
    if (err) {
	  console.log(err);
	  response.status(400).send('Error in saving file');
	} else {
	  showFacts(request, response);
	}
  });
}

exports.showFact = function(request, response) {
	
	let fact = {};
	
	Fact.findOne({_id: request.query.id}).populate('author').exec(function(err, fact) {
	  if (err || !fact) {
		response.send('Error');
		return;
	  }
	  
	  response.render('fact.ejs', {fact: fact, userId: request.cookies.userId, userName: request.cookies.userName});
    });
	
}

exports.like = function(request, response) {
  console.log('Try to set like');
  if (request.cookies === undefined || request.cookies.userId === undefined) {
    response.send(LOG_IN_MSG);
	return;
  }
  
  Fact.findOne({_id: request.query.id}).populate('author').exec(function(err, fact) {
    if (err || !fact) {
	  response.send('Error');
	  return;
	}
	
	let popFlag = false;
	for (let i = 0; i < fact.likes.length; i++) {
	  if (fact.likes[i] == request.cookies.userId) {
	    fact.likes.pop(request.cookies.userId);
		popFlag = true;
	  }
	}
	
	if (!popFlag) {
	  fact.likes.push(request.cookies.userId);
	}
	console.log(fact.likes.length);
	Fact.updateOne({_id: request.query.id}, {likes: fact.likes}, function(err, result){
	  if (err) {
	    console.log(err);
	  } else {
	    console.log(result);
	  }
	  showFacts(request, response);
	});
  });
}

function showFacts(request, response) {
  if (!request.cookies?.userId) {
    response.status(401).send(LOG_IN_MSG);
	return;
  }
  
  User.findById(request.cookies.userId, function(err, user){
    if (err) {
	  console.log(err);
	  respons.status(500).send();
	  return;
	}
	
	Fact.find({}).populate('author').exec(function(err, facts) {
	    if (err) {
	      console.log(err);
	      response.status(500).send('Error');
        } else {
	      response.render('facts.ejs', {facts: facts, userId: request.cookies.userId, userName: user.name});  
	    }
	  });  
    }
	)
}

exports.showFacts = function(request, response) {
  showFacts(request, response);
}