var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var cookieParser = require('cookie-parser');
var session = require('express-session');

//var db = mongojs('mongodb://Tawakalt:Tawakalt4@ds143231.mlab.com:43231/issuestracker', ['users']);
//var db2 = mongojs('mongodb://Tawakalt:Tawakalt4@ds143231.mlab.com:43231/issuestracker', ['issues']);
var db = mongojs('issuesTracker', ['users']);
var db2 = mongojs('issuesTracker', ['issues']);
var ObjectId = mongojs.ObjectId;

var app = express();

app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));





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
	
	res.render('signUp', {
		title: 'SIGN UP NOW'
	});
});
app.get('/signUp', function(req, res){
		res.render('signUp', {
			title: 'SIGN UP'
		});
});
app.get('/signIn', function(req, res){
		res.render('signIn', {
			title: 'Sign In'
		});
});
app.get('/logout', function(req, res){
		req.session.destroy();
		res.redirect('/signIn')
});
app.get('/issues', function(req, res){
	if (req.session.user){
		res.render('issues', {
			title: 'RAISE ISSUE',
			user: req.session.user._id,
			admin: req.session.user.admin
		});
	}else{
		res.redirect('/signIn')
	}

});
app.get('/deptIssues', function(req, res){
	if (req.session.user){
		if (req.session.user.admin == 2){
			//console.log(req.session.user.department);
			db2.issues.find({department: req.session.user.department},function (err, docs) {
			res.render('deptIssues', {
				title: 'ALL ISSUES DIRECTED TO YOUR DEPARTMENT',
				issues: docs
			});
			})
		}else{
			res.redirect('/issues')	
		}
	}else{
		res.redirect('/signIn')
	}
});

app.get('/allIssues', function(req, res){
	if (req.session.user){
		if (req.session.user.admin === 1){
			db2.issues.find(function (err, docs) {
			res.render('allIssues', {
				title: 'ALL RAISED ISSUES ON THE APP',
				issues: docs
			});
			})
		}else{
			res.redirect('/issues')	
		}
	}else{
		res.redirect('/signIn')
	}
});

app.get('/myIssues', function(req, res){
	if (req.session.user){		
		db2.issues.find({user: req.session.user._id},function (err, docs) {
		res.render('myIssues', {
			title: 'MANAGE YOUR ISSUES',
			issues: docs
		});
		})
	}else{
		res.redirect('/signIn')
	}
});
	
app.post('/signUp', function(req, res){
	req.checkBody('firstName', 'First name is Required').notEmpty();
	req.checkBody('lastName', 'Last name is Required').notEmpty();
	req.checkBody('email', 'Email is Required').notEmpty();
	req.checkBody('password', 'Password is Required').notEmpty();
	req.checkBody('password2', 'Retype Password is Required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

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
			admin: 0
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

app.post('/signIn', function(req, res){
	req.checkBody('email', 'Email is Required').notEmpty();
	req.checkBody('password', 'Password is Required').notEmpty();

	var errors = req.validationErrors();
	if(errors){		
		res.render('signIn', {
			title: 'Sign In',
			errors: errors
		});
	}else {
		db.users.findOne({"_id": req.body.email},{ _id: 1, email: 1, password: 1, department: 1, admin: 1 }, function(err, doc) {
    	if (err){
    		//console.log(err);
    		res.render('signUp', {
					title: 'Sign Up',
					errors: err
			});
    	}else{ 
    		//console.log(doc.admin);
    		req.session.user = doc;
    		//req.session.save();
    		if (doc == null){
    			res.render('signUp', {
					title: 'Sign Up',
					errors: 'You have to sign up first!!!'
				});
			}else {

				//console.log(req.session);
				if(req.body.password == doc.password){
					//console.log(req.session.user);
					
		    			res.redirect('/issues');
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

app.post('/issues', function(req, res){
	req.checkBody('description', 'Description is Required').notEmpty();
	req.checkBody('priority', 'Priority is Required').notEmpty();
	req.checkBody('department', 'Department is Required').notEmpty();
	req.checkBody('user', 'Yor are not logged in').notEmpty();

	docs = db2.issues.find( { user: req.body.user } );
	//console.log(docs);
	var errors = req.validationErrors();
	if(errors){		
		res.render('issues', {
			title: 'issues',
			errors: errors,
			user: req.body.user,
			admin: req.body.admin
		});
	}else {
		var newIssue = {
			description: req.body.description,
			priority: req.body.priority,
			department: req.body.department,
			user: req.body.user,
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
					errors: msg,
					user: req.body.user,
					admin: req.body.admin
				});
			//res.redirect('/issues');
		});
	}	
});

app.post('/update/:id',function(req, res){
	db2.issues.update({_id: ObjectId(req.params.id)}, {$set:{status: 'Closed'}}, function(err, result){
		if(err){
			//console.log(err);
		}
		//console.log('ok');
		res.redirect('/allIssues');
	});
});

app.post('/update2/:id',function(req, res){
	db2.issues.update({_id: ObjectId(req.params.id)}, {$set:{status: 'Pending'}}, function(err, result){
		if(err){
			//console.log(err);
		}
		//console.log('ok');
		res.redirect('/allIssues');
	});
});

var port = process.env.PORT || 8000;
//
app.listen(port, function(){
	console.log('server Started on Port '+port);
})