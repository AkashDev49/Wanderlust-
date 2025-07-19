const User = require("../models/user.js");

//SignUp --> Given Form
module.exports.signUpFrom = (req, res) => {
	res.render("./users/signup.ejs");
};

//Add SignUp
module.exports.signUp = async (req, res) => {
	try {
		let { username, email, password } = req.body;
		const newUser = new User({ email, username });

		let registeredUser = await User.register(newUser, password);
		// console.log(registeredUser);

		req.login(registeredUser, (err) => {
			if (err) {
				return next(err);
			}
			req.flash("success", "Welcome to Wanderlust	!");
			res.redirect("/listings");
		});
	} catch (err) {
		console.log(err);
		req.flash("error", err.message);
		res.redirect("/signup");
	}
};

//Login --> Given Form
module.exports.loginFrom = (req, res) => {
	res.render("./users/login.ejs");
};

//Add Login
module.exports.login = async (req, res) => {
	req.flash("success", "Welcome Back to Wanderlust!");
	let redirectUrl = res.locals.redirectUrl || "/listings";
	res.redirect(redirectUrl);
};

//logged out
module.exports.logOut = (req, res, next) => {
	req.logOut((err) => {
		if (err) {
			return next(err);
		}
		req.flash("success", "Logged Out Successfully!");
		res.redirect("/listings");
	});
};
