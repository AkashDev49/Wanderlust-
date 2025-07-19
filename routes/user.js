const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const usersController = require("../controllers/users.js");

router
	.route("/signup")
	.get(usersController.signUpFrom) //SignUp --> Given Form
	.post(wrapAsync(usersController.signUp)); //Add SignUp

router
	.route("/login")
	.get(usersController.loginFrom) //Login --> Give Form
	//Add Login User
	.post(
		saveRedirectUrl,
		passport.authenticate("local", {
			failureRedirect: "/login",
			failureFlash: true,
		}),
		usersController.login
	);

//logged out
router.get("/logout", usersController.logOut);

module.exports = router;
