// Node.js packages
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var passport = require("passport");
var passportLocal = require("passport-local");
var session = require("express-session");

// Node.js files
var model = require("./model.js");

var app = express();

var corsOptions = {
	origin: "*",
	optionsSuccessStatus: 204
}

// Middleware:
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(session({
	secret: "poppyseed muffin",
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy({
		usernameField: "email"
	}, function (email, password, done) {
		model.User.retrieveUserByEmail(email, function (err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, { message: "Incorrect email." });
			}
			user.validPassword(password, function (err, res) {
				if (err) {
					console.log(err);
				}
				if (res) {
					return done(null, user);
				} else {
					return done(null, false, { message: "Incorrect password." });
				}
			});
		}
	);
}));

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	model.User.retrieveUserById(id, function(err, user) {
		done(err, user);
	});
});

app.get("/participants", function (req, res) {
	console.log("GET - /participants");
	if (req.user) {
		model.Participant.indexParticipants(req.user._id, function (err, participantslist) {
			if (err) {
				console.log(err);
				if (err.errors) {
					messages = processError(err);
					res.status(422);
					res.json(messages);
				} else {
					res.sendStatus(500);
				}
			} else {
				res.status(200);
				res.json(participantslist);
			}
		});
	} else {
		res.sendStatus(401);
	}
});

app.post("/participants", function (req, res) {
	console.log("POST - /participants");
	if (req.user) {
		model.createParticipant(req.user._id, req.body, function (err) {
			if (err) {
				console.error(err);
				if (err.errors) {
					messages = processError(err);
					res.status(422);
					res.json(messages);
				} else {
					res.sendStatus(500);
				}
			} else {
				res.sendStatus(201);
			}
		});
	} else {
		res.sendStatus(401);
	}
});

app.put("/participants/:id", function (req, res) {
	console.log("PUT - /participants/" + req.params.id);
	if (req.user) {
		model.Participant.updateParticipant(req.body, function (err) {
			if (err) {
				console.log(err);
				if (err.errors) {
					messages = processError(err);
					res.status(422);
					res.json(messages);
				} else {
					res.sendStatus(500);
				}
			} else {
				res.sendStatus(204);
			}
		});
	} else {
		res.sendStatus(401);
	}
});

app.delete("/participants/:id", function (req, res) {
	var id = req.params.id;
	console.log("DELETE - /participants/" + id);
	if (req.user) {
		model.Participant.deleteParticipant(id, function (err) {
			if (err) {
				console.log(err);
				if (err.errors) {
					messages = processError(err);
					res.status(422);
					res.json(messages);
				} else {
					res.sendStatus(500);
				}
			} else {
				res.sendStatus(204);
			}
		});
	} else {
		res.sendStatus(401);
	}
});

app.post("/users", function (req, res) {
	console.log("POST - /users");
	model.createUser(req.body, function (err) {
		if (err) {
			console.error(err);
			if (err.errors) {
				messages = processError(err);
				res.status(422);
				res.json(messages);
			} else {
				res.sendStatus(500);
			}
		} else {
			res.sendStatus(201);
		}
	});
});

app.post("/session", passport.authenticate("local"), function (req, res) {
	console.log("POST - /session");
	res.sendStatus(201);
});

app.get("/me", function (req, res) {
	console.log("GET - /me");
	if (req.user) {
		var simpleUser = {
			first_name: req.user.first_name,
			last_name: req.user.last_name,
			email: req.user.email
		}
		res.json(simpleUser);
	} else {
		res.sendStatus(401);
	}
});

var port = process.env.PORT || 8080;

app.listen(port, function () {
	console.log("Listening on port " + port + "...");
});

var processError = function (err) {
	messages = {};
	for (var e in err.errors) {
		messages[e] = err.errors[e].message;
	}
	return messages;
}