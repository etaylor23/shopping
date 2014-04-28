var application_root = __dirname,
	express = require("express"),
	path = require("path"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require('passport-local').Strategy;

var app = express();

app.configure( function() {
	app.use(express.static( path.join( application_root, '') ) );
    app.use(express.cookieParser());	
	app.use(express.bodyParser() );
	app.use(express.methodOverride() );
	app.use(express.errorHandler({ dumbExceptions: true, showStack: true }));
	app.use(express.session({ secret: 'keyboard cat' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
});

var port = 4711;

app.listen( port, function() {
	console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});

mongoose.connect("mongodb://localhost/library_database");

var Food = new mongoose.Schema({
	name: String,
	quantity: String,
	metric: String,
	attrUser: String
}, {
	collection:'foodInfo'
});

var Schema = mongoose.Schema;
var UserDetail = new Schema({
  username: String,
  password: String
}, {
  collection: 'userInfo'
});

var UserDetails = mongoose.model('userInfo', UserDetail);
var FoodModel = mongoose.model( 'foodInfo', Food );


app.get("/my-stock-take", function(req, res, next){
  if (!req.user) 
  	res.redirect('/login');
  else
	res.sendfile('my-stock.html');
});


app.get( '/api/foods', function( request, response ) {
	return FoodModel.find({ attrUser:request.user.username }, function( err, foods ){ 
		if ( !err ) {
			return response.send( foods );
		} else {
			return console.log( err );
		}
	})
});

app.post( '/api/foods', function( request, response, user ) {
	var food = new FoodModel({
		name: request.body.name,
		quantity: request.body.quantity,
		metric: request.body.metric,
		attrUser: request.user.username
	});

	food.save( function( err, user ) {
		if( !err ) {
			console.log(food);
			return response.send( food );

		} else {
			return console.log( err );
		}
	});
});

app.get( '/api/foods/:id', function( request, response) {
	return FoodModel.findById( request.params.id, function( err, food ) {
		if ( !err ) {
			return response.send( food );
		} else {
			return console.log( err );
		}
	});
});

app.put( '/api/foods/:id', function( request, response ) {
	console.log("Updating food: " + request.body.name);
	return FoodModel.findById( request.params.id, function( err, food) {
		food.name = request.body.name;
		food.quantity = request.body.quantity;

		return food.save( function( err ) {
			if ( !err ) {
				console.log( 'Food updated' );
			} else {
				console.log( err );
			}
			return response.send( food );
		});
	});
});

app.delete( '/api/foods/:id', function( request, response ) {
	console.log( "Deleting food with id " + request.params.id );
	return FoodModel.findById( request.params.id, function( err, food ) {
		return food.remove( function( err ) {
			if( !err ) {
				console.log( 'Food removed' );
				return response.send( '' );
			} else {
				console.log( err );
			}
		});
	});
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/my-stock-take',
    failureRedirect: '/'
  })
);

app.post('/',
  passport.authenticate('local', {
    successRedirect: '/my-stock-take',
    failureRedirect: '/'
  })
);

app.get('/logout', function( request, response ) {
	request.logout();
	response.redirect('/')
})
 
app.get('/loginFailure', function(req, res, next) {
  res.redirect('/login');
});

app.post('/create-user', function( request, response, username ) {
	if(request.body.password == request.body.verifypassword) {

		var newUser = new UserDetails({
			username:request.body.username,
			password:request.body.password
		})

		newUser.save( function( err, user, re ) {
			if( !err ) {
				//return response.send( food );
				console.log("New user created");
				request.login(user, function(loginerr, request){
					if(!err) {
						console.log( "User logged in" );
					} else {
						console.log( loginerr );
					}
					response.redirect('/my-stock-take');
				});
			} else {
				return console.log( err );
			}
		});

	} else {
		response.redirect("/");
		return false;
	}
});

passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    UserDetails.findOne({
      'username': username,
    }, function(err, user) {
      if (err) {
        return done(err);
      }
 
      if (!user) {
        return done(null, false);
      }
 
      if (user.password != password) {
        return done(null, false);
      }
 
      return done(null, user);
    });
  });
}));

