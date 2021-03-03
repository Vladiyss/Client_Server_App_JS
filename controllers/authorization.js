const User = require('../models/user');
const fs = require('fs');


exports.getSignin = (request, response) => {
  response.render('logination.ejs');
}

exports.postSignin = (request, response) => {
  let {login, password} = request.body;
 
  User.findOne({login, password}, function(err, user){
    if (err || !user) {
	  console.log('User not found');
	  if (err) {
	    console.log(err);
	  }
	  response.status(500).send('Error');
	} else {
	  response.cookie('userId', user._id);
	  response.cookie('userName', user.name);
	  response.redirect('user/' + user._id);
	}
  });
};


exports.getSignup = (request, response) => {
  response.render('registration.ejs');
}

exports.postSignup = (request, response) => {
  console.log(request.body);
  User.findOne({login: request.body.login}, function(err, user) {
      if (err) {
	    console.log(err);
		response.status(500).send('Error');
		return;
	  }
	  
	  if (user) {
	    response.send('Please, choose another login');
		return;
	  }
	  
	  user = new User(request.body);
      user.save(function(err){
      if (err) {
	    console.log(err);
	    response.status(500).send('Can not registrate');
	  } else {
        response.cookie('userId', user._id);
		response.cookie('userName', user.name);
		response.redirect('user/' + user._id);
	  }
    }); 
  });
}


exports.signout = (request, response) => {
  response.clearCookie('userId', 'userName');
  response.redirect('/main');
}

exports.showMain = (request, response) => {
  response.render('main.ejs');
}