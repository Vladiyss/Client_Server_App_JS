const express = require('express');
const user = require('../controllers/user');

const userRouter = express.Router();

userRouter.get('/:userId', function(request, response){
  user.getUser(request, response);
});

module.exports = userRouter;