angular.module("giftex").controller("ParticipantController",
	function ($scope, ParticipantService) {

		/* STARTUP */

		startGiftExchange = function () {
			ParticipantService.retrieveUser(function (first_name) {
				$scope.user_first_name = first_name;
				$scope.participants = ParticipantService.indexParticipants(countParticipants);
				$scope.cancelSignupOrSignin();
				$scope.setupPageVisible = true;
			});
		}

		/* SIGNUP/SIGNIN */

		$scope.showSignup = function () {
			$scope.signupVisible = true;
		}

		$scope.showSignin = function () {
			$scope.signinVisible = true;
		}

		$scope.cancelSignupOrSignin = function () {
			$scope.signupVisible = false;
			$scope.signinVisible = false;
			$scope.signinBoxMessage = "";
			$scope.signupBoxMessage = "";
		}

		$scope.showSetupPageSignup = function () {
			if ($scope.signup_first_name.length != 0 &&
					$scope.signup_last_name.length != 0 &&
					$scope.signup_email.length != 0 &&
					$scope.signup_email.includes("@") &&
					$scope.signup_password.length != 0 &&
					$scope.signup_password == $scope.signup_password_confirm) {
				data = {
					first_name: $scope.signup_first_name,
					last_name: $scope.signup_last_name,
					email: $scope.signup_email,
					password: $scope.signup_password
				};
				ParticipantService.createUser(data, function () {
					ParticipantService.createSession(data, function() {
						$scope.signupBoxMessage = "";
						if ($scope.is_user_included) {
							data = {
								first_name: $scope.signup_first_name,
								last_name: $scope.signup_last_name,
								email: $scope.signup_email,
								wishlist: []
							};
							ParticipantService.createParticipant(data, startGiftExchange);
						} else {
							startGiftExchange();
						}
					}, function () {
						$scope.signupBoxMessage = "Your gift exchange was successfully created, but an error occurred while signing you in. Please try signing into your account.";
					});
				}, function () {
					$scope.signupBoxMessage = "An error occurred while creating your account. Please try again.";
				});
				data = {
					email: $scope.signup_email,
					password: $scope.signup_password
				};
			} else {
				$scope.signupBoxMessage = "You must have a first name, last name, valid email, and password.";
			}
		};

		$scope.showSetupPageSignin = function () {
			if ($scope.signin_email.length != 0 &&
					$scope.signin_email.includes("@") &&
					$scope.signin_password.length != 0) {
				data = {
					email: $scope.signin_email,
					password: $scope.signin_password
				};
				ParticipantService.createSession(data, function() {
					startGiftExchange();
				}, function () {
					$scope.signinBoxMessage = "Incorrect email and/or password.";
				});
			} else {
				$scope.signinBoxMessage = "You must put in a valid email and password.";
			}
		};

		var countParticipants = function () {
			if ($scope.participants.length <= 0) {
				$scope.participantBoxMessage = "You haven't added any participants yet."
			} else {
				$scope.participantBoxMessage = "";
			}
		};

		/* ADD PARTICIPANT */

		$scope.showAddParticipant = function () {
			$scope.addButtonVisible = true;
			$scope.addParticipantVisible = true;
		};

		$scope.createParticipant = function () {
			if ($scope.first_name.length != 0 &&
					$scope.last_name.length != 0 &&
					$scope.email.length != 0 &&
					$scope.email.includes("@")) {
				wishlist = [];
				for (var i = 0; i < $scope.wishlist.length; i++) {
					wishlist.push($scope.wishlist[i].item);
				}
				data = {
					first_name: $scope.first_name,
					last_name: $scope.last_name,
					email: $scope.email,
					wishlist: wishlist
				};
				ParticipantService.createParticipant(data, clearAddParticipants);
			} else {
				$scope.addBoxMessage = "The participant must have a first name, last name, and valid email.";
			}
		};

		$scope.cancelAdd = function () {
			clearAddParticipants();
		};

		var clearAddParticipants = function () {
			ParticipantService.indexParticipants(countParticipants);
			$scope.addParticipantVisible = false;
			currentEditId = "";
			$scope.first_name = "";
			$scope.last_name = "";
			$scope.email = "";
			$scope.wishlist_input = "";
			$scope.wishlist = [];
			$scope.addBoxMessage = "";
		};

		// Wishlist

		$scope.addWishlistItem = function () {
			wishlistItem = { id: uid, item: $scope.wishlist_input };
			$scope.wishlist.push(wishlistItem);
			$scope.wishlist_input = "";
			uid++;
		};

		$scope.removeWishlistItem = function (w) {
			var index = $scope.wishlist.indexOf(w);
			if (index > -1) {
				$scope.wishlist.splice(index, 1);
			}
		};

		/* EDIT PARTICIPANTS */

		$scope.showEditParticipant = function (p) {
			$scope.addButtonVisible = false;
			$scope.first_name = p.first_name;
			$scope.last_name = p.last_name;
			$scope.email = p.email;
			for (var i = 0; i < p.wishlist.length; i++) {
				$scope.wishlist.push({ id: i, item: p.wishlist[i] });
			}
			$scope.addParticipantVisible = true;
			currentEditId = p._id;
		};

		$scope.updateParticipant = function () {
			wishlist = [];
			for (var i = 0; i < $scope.wishlist.length; i++) {
				wishlist.push($scope.wishlist[i].item);
			}
			data = {
				_id: currentEditId,
				first_name: $scope.first_name,
				last_name: $scope.last_name,
				email: $scope.email,
				wishlist: wishlist
			};
			ParticipantService.updateParticipant(data, clearAddParticipants);
		};

		/* DELETE PARTICIPANTS */

		$scope.deleteParticipant = function (p) {
			if (confirm("Are you sure you want to remove this participant?")) {
				ParticipantService.deleteParticipant(p._id, {});
				ParticipantService.indexParticipants(countParticipants);
			}
		};

		/* OPTIONS MENU */

		$scope.showOptions = function () {
			$scope.optionsVisible = true;
			savedOptions = {
				dollar_amount: $scope.dollar_amount,
				location: $scope.location,
				date: $scope.date,
				time: $scope.date,
				is_secret: $scope.is_secret
			};
		}

		$scope.saveOptions = function () {
			$scope.optionsVisible = false;
			savedOptions = {};
		}

		$scope.cancelOptions = function () {
			$scope.dollar_amount = savedOptions["dollar_amount"];
			$scope.location = savedOptions["location"];
			$scope.date = savedOptions["date"];
			$scope.time = savedOptions["time"];
			$scope.is_secret = savedOptions["is_secret"];
			$scope.optionsVisible = false;
			savedOptions = {};
		};

		$scope.completeGiftExchange = function () {
			alert("Not yet, yer not");
		};

		/* LIST */

		$scope.showWishlist = function (i) {
			current = $scope.wishlistVisible[i];
			$scope.wishlistVisible[i] = !current;
		};

		/* EXECUTE THIS CODE NOW */

		$scope.wishlistVisible = [];
		$scope.wishlist = [];
		var savedOptions = {};
		var currentEditId = "";
		var uid = 0;

		startGiftExchange();
	}
);