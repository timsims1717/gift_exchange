# s17-passport-timsims1717 #

### Participants: ###
* _id
* user_id
* first_name
* last_name
* email
* wishlist

* **Index:** GET /participants
* **Create:** POST /participants
* **Update:** PUT /participants/id
* **Delete:** DELETE /participants/id

#### MongoDB Schema ####

`
var participantSchema = new mongoose.Schema({
	user_id: {type: mongoose.Schema.Types.ObjectId, required: [true, "No user id supplied."]},
	first_name: {type: String, required: [true, "Please provide a first name."], max: 100},
	last_name: {type: String, required: [true, "Please provide a last name."], max: 100},
	email: {type: String, required: [true, "Please provide an email."], max: 100},
	wishlist: {type: [String]}
});
`

### Users: ###
* _id
* first_name
* last_name
* email
* encrypted_password

* **Retrieve:** GET /me
* **Create:** POST /users
* **Create:** POST /session

#### MongoDB Schema ####

`
var userSchema = new mongoose.Schema({
	first_name: {type: String, required: [true, "Please provide a first name."], max: 100},
	last_name: {type: String, required: [true, "Please provide a last name."], max: 100},
	email: {type: String, required: [true, "Please provide an email."], max: 100},
	encrypted_password: {type: String, required: [true, "Please provide an password."], max: 256}
});
`

### Authentication: ###

Authentication is accomplished using the BCrypt hashing algorithm and the Passport.js middleware.