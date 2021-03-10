const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const multer = require('multer');
require('dotenv').config();

const authRouter = require('./routes/authorization.js');
const factsRouter = require('./routes/facts.js');
const userRouter = require('./routes/user.js');

const app = express();

const PORT = 3000;
const connectionString = "mongodb://127.0.0.1:27017/client_server_application_db";

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
  if (err)
    console.log(err);
  else
    console.log('MongoDB Successfully Connected');
});

const filter = function(request, file, cb) {
  if (file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
	file.mimetype === "image/jpeg") {
	  cb(null, true);
	} else {
	  cb(null, false);
	}
}

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(multer({dest:"public/images", fileFilter: filter}).single("fact_file"));
app.use(cookieParser()); 
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', authRouter);
app.use('/facts', factsRouter);
app.use('/user', userRouter);
app.use('/', function(request, response){
  response.status(404).send('Not found');
});

app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});