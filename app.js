var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;

var app = express();

/*var logger = function(req, res, next){
	console.log('Logging...');
	next();
}

app.use(logger);*/

// View Engine
app.set('view engine', 'ejs');
app.set('views',  path.join(__dirname, 'views'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set Static path
app.use(express.static(path.join(__dirname, 'public')));

//Global Variables
app.use(function(req, res, next){
	res.locals.errors = null;
	res.locals.docs = null;
	next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.get('/', function(req, res){
	// find everything
	db.users.find(function (err, docs) {
		// docs is an array of all the documents in mycollection
		//console.log(docs);
		res.render('index', {
			title: 'Customers',
			users: docs
		});
	})
});
	

app.post('/users/add', function(req, res){
	req.checkBody('firstName', 'First name is Required').notEmpty();
	req.checkBody('lastName', 'Last name is Required').notEmpty();
	req.checkBody('email', 'Email is Required').notEmpty();

	var errors = req.validationErrors();
	if(errors){
		db.users.find(function (err, docs) {
		res.render('index', {
			title: 'Customers',
			users: docs,
			errors: errors
		});
	})
	}else {
		var newUser = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email
		}
		//console.log('SUCCESS');
		db.users.insert(newUser, function(err, result){
			if(err){
				console.log(err);
			}
			res.redirect('/');
		});
	}	
});

app.delete('/users/delete/:id',function(req, res){
	db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
		if(err){
			console.log(err);
		}
		res.redirect('/');
	});
});

app.listen(3000, function(){
	console.log('server Started on Port 3000...');
})