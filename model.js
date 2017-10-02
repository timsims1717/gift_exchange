var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var dburl = "mongodb://server:ericthered54@ds147799.mlab.com:47799/giftex";
mongoose.connect(dburl);

var userSchema = new mongoose.Schema({
	first_name: {type: String, required: [true, "Please provide a first name."], max: 100},
	last_name: {type: String, required: [true, "Please provide a last name."], max: 100},
	email: {type: String, required: [true, "Please provide an email."], max: 100},
	encrypted_password: {type: String, required: [true, "Please provide an password."], max: 256}
});

userSchema.statics.retrieveUserByEmail = function (email, done) {
	return this.findOne({ email: email }, done);
};

userSchema.statics.retrieveUserById = function (id, done) {
	return this.findOne({ _id: id }, done);
};

userSchema.methods.validPassword = function (password, done) {
	bcrypt.compare(password, this.encrypted_password, done);
};

var User = mongoose.model("Users", userSchema);

var createUser = function (data, done) {
	bcrypt.hash(data.password, 10, function (err, hash) {
		if (err) {
			done(err);
		} else {
			var user = new User({
				first_name: data.first_name,
				last_name: data.last_name,
				email: data.email,
				encrypted_password: hash
			});
			user.save(done);
		}
	});
};

var participantSchema = new mongoose.Schema({
	user_id: {type: mongoose.Schema.Types.ObjectId, required: [true, "No user id supplied."]},
	first_name: {type: String, required: [true, "Please provide a first name."], max: 100},
	last_name: {type: String, required: [true, "Please provide a last name."], max: 100},
	email: {type: String, required: [true, "Please provide an email."], max: 100},
	wishlist: {type: [String]}
});

participantSchema.statics.indexParticipants = function (id, done) {
	return this.find({ user_id: id }, done);
};

participantSchema.statics.updateParticipant = function (data, done) {
	return this.findByIdAndUpdate(data._id, {
			first_name: data.first_name,
			last_name: data.last_name,
			email: data.email,
			wishlist: data.wishlist
		}, done);
};

participantSchema.statics.deleteParticipant = function (id, done) {
	return this.findByIdAndRemove(id, done);
};

participantSchema.virtual("full_name").get(function () {
	return this.first_name + " " + this.last_name;
});

var Participant = mongoose.model("Participants", participantSchema);

var createParticipant = function (id, data, done) {
	var participant = new Participant({
		user_id: id,
		first_name: data.first_name,
		last_name: data.last_name,
		email: data.email,
		wishlist: data.wishlist
	});
	participant.save(done);
};

module.exports = {
	User: User,
	createUser: createUser,
	Participant: Participant,
	createParticipant: createParticipant
};