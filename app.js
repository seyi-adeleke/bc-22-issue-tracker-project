var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('issuesTracker', ['users']);
var db2 = mongojs('issuesTracker', ['issues']);
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
app.get('/signUp', function(req, res){
		res.render('signUp', {
			title: 'Sign Up'
		});
});
app.get('/signIn', function(req, res){
		res.render('signIn', {
			title: 'Sign In'
		});
});
app.get('/issues', function(req, res){
		res.render('issues', {
			title: 'Raise Issue'
		});
});
app.get('/admin', function(req, res){
		res.render('admin', {
			title: 'Admin Page'
		});
});
app.get('/allIssues', function(req, res){
		db2.issues.find(function (err, docs) {
		// docs is an array of all the documents in mycollection
		//console.log(docs);
		res.render('allIssues', {
			title: 'View All Issues',
			issues: docs
		});
	})
});
	
app.post('/users/signUp', function(req, res){
	req.checkBody('firstName', 'First name is Required').notEmpty();
	req.checkBody('lastName', 'Last name is Required').notEmpty();
	req.checkBody('email', 'Email is Required').notEmpty();
	req.checkBody('password', 'Password is Required').notEmpty();

	var errors = req.validationErrors();
	if(errors){		
		res.render('signUp', {
			title: 'Sign Up',
			errors: errors
		});
	}else {
		var newUser = {
			_id: req.body.email,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password,
			admin: 1
		}
		//console.log('SUCCESS');
		db.users.insert(newUser, function(err, result){
			if(err){
				res.render('signUp', {
					title: 'Sign Up',
					errors: 'User Already Exists!!!'
				});
			}
			res.redirect('/signIn');
		});
	}	
});

app.post('/users/signIn', function(req, res){
	req.checkBody('email', 'Email is Required').notEmpty();
	req.checkBody('password', 'Password is Required').notEmpty();

	var errors = req.validationErrors();
	if(errors){		
		res.render('signIn', {
			title: 'Sign In',
			errors: errors
		});
	}else {
		db.users.findOne({"_id": req.body.email},{ _id: 1, email: 1, password: 1, admin: 1 }, function(err, doc) {
    	if (err){
    		//console.log(err);
    		res.render('signUp', {
					title: 'Sign Up',
					errors: err
			});
    	}else{ 
    		//console.log(doc.admin);
    		if (doc == null){
    			res.render('signUp', {
					title: 'Sign Up',
					errors: 'You have to sign up first!!!'
				});
			}else {
				if(req.body.password == doc.password){
					//console.log(req.body.password);
					if (doc.admin == 0)
		    			res.redirect('/issues');
		    		else
		    			res.redirect('/admin');
	    		}else{
		    		res.render('signIn', {
						title: 'Sign In',
						errors: 'Incorrect Password'
					});
		    	}
		    }
    	}
		})
	}	
});

app.post('/users/issues', function(req, res){
	req.checkBody('description', 'Description is Required').notEmpty();
	req.checkBody('priority', 'Priority is Required').notEmpty();
	req.checkBody('department', 'Department is Required').notEmpty();

	var errors = req.validationErrors();
	if(errors){		
		res.render('issues', {
			title: 'issues',
			errors: errors
		});
	}else {
		var newIssue = {
			description: req.body.description,
			priority: req.body.priority,
			department: req.body.department,
			status: "Open"
		}
		//console.log('SUCCESS');
		db2.issues.insert(newIssue, function(err, result){
			if(err){
				var msg = 'Issue Already Exists!!!';
			}else{
				var msg = 'Issue has been submitted to the right channel. We apologize for any inconvenience';
			}
			res.render('issues', {
					title: 'issues',
					errors: msg
				});
			//res.redirect('/issues');
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

app.listen(8000, function(){
	console.log('server Started on Port 8000...');
})