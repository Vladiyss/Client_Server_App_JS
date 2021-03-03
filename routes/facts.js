const express = require('express');
const facts = require('../controllers/facts');

const factsRouter = express.Router();

factsRouter.get('/addfact', function(request, response){
  facts.getFactCreation(request, response);
})

factsRouter.post('/addfact', function(request, response){
  console.log(request.body);
  facts.createFact(request, response);
})

factsRouter.get('/showfact', function(request, response){
  facts.showFact(request, response);
})

factsRouter.use('/like', function(request, response){
  facts.like(request, response);
});

module.exports = factsRouter;