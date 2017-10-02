// var url = "http://localhost:8080";
var url = "https://thegiftexchangeapp.herokuapp.com";

angular.module("giftex").service("ParticipantService",
	function ($http, $httpParamSerializer) {

		$http.defaults.withCredentials = true;
	
		var participantArray = [];
		var first_name = "";

		// AJAX: index participants
		var indexParticipants = function (done) {
			$http({
				method: "GET",
				url: url + "/participants"
			}).then(function (response) {
				// on success
				participantArray.splice(0, participantArray.length);
				var participants = response.data;
				for (var i = 0; i < participants.length; i++) {
					participantArray.push(participants[i]);
				}
				done();
			}, function () {
				console.error("Unable to get list of participants.");
			});
			return participantArray;
		}

		// AJAX: create participant
		var createParticipant = function (data, done) {
			$http({
				method: "POST",
				url: url + "/participants",
				data: $httpParamSerializer(data),
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {
				done();
			}, function () {
				console.error("Unable to create participant.");
			});
		};

		// AJAX: update participant
		var updateParticipant = function (data, done) {
			$http({
				method: "PUT",
				url: url + "/participants/" + data._id,
				data: $httpParamSerializer(data),
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {
				done();
			}, function (response) {
				console.error("Unable to update participant.")
			});
		};

		// AJAX: delete participant
		var deleteParticipant = function (id, done) {
			$http({
				method: "DELETE",
				url: url + "/participants/" + id,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {
				done();
			}, function (response) {
				console.error("Unable to delete participant.");
			});
		};

		// AJAX: retrieve user
		var retrieveUser = function (done) {
			$http({
				method: "GET",
				url: url + "/me",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {
				done(response.data.first_name);
			}, function (response) {
				console.error("Unable to get user.");
			});
		};

		// AJAX: create user
		var createUser = function (data, done, failure) {
			$http({
				method: "POST",
				url: url + "/users",
				data: $httpParamSerializer(data),
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {
				done();
			}, function (response) {
				console.error("Unable to create user.");
				failure();
			});
		};

		// AJAX: create session
		var createSession = function (data, done, failure) {
			$http({
				method: "POST",
				url: url + "/session",
				data: $httpParamSerializer(data),
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				}
			}).then(function (response) {
				done();
			}, function (response) {
				console.error("Unable to authenticate user.");
				failure();
			});
		};

		return {
			indexParticipants: indexParticipants,
			createParticipant: createParticipant,
			updateParticipant: updateParticipant,
			deleteParticipant: deleteParticipant,
			retrieveUser: retrieveUser,
			createUser: createUser,
			createSession: createSession
		};
	}
);