const Listing = require("./models/listing");
const Review = require("./models/review");
//WrapAsync Error Handler
const ExpressError = require("./utils/ExpressError.js");
//joi
const { listingSchema } = require("./Schema.js");
const { reviewSchema } = require("./Schema.js");

//Page Loggedin
module.exports.isLoggedin = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.redirectUrl = req.originalUrl;
		req.flash("error", "Please Logged in First");
		return res.redirect("/login");
	}
	next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
	if (req.session.redirectUrl) {
		res.locals.redirectUrl = req.session.redirectUrl;
	}
	next();
};

//Listing Owner
module.exports.isOwner = async (req, res, next) => {
	let { id } = req.params;
	let listing = await Listing.findById(id);

	if (!listing.owner._id.equals(res.locals.currUser._id)) {
		req.flash("error", "you dont have permission to access this Listing!");
		return res.redirect(`/listings/${id}`);
	}
	next();
};

//joi Listing validation
module.exports.validateListing = (req, res, next) => {
	let { error } = listingSchema.validate(req.body);

	if (error) {
		let errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, errMsg);
	} else {
		next();
	}
};

//Joi Review Validation
module.exports.validateReview = (req, res, next) => {
	let { error } = reviewSchema.validate(req.body);

	if (error) {
		let errMsg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(400, errMsg);
	} else {
		next();
	}
};

//for delete Review
module.exports.isAuthor = async (req, res, next) => {
	let { id, reviewId } = req.params;
	let review = await Review.findById(reviewId);

	if (!review.author.equals(res.locals.currUser._id)) {
		req.flash("error", "you did not delete this review!");
		return res.redirect(`/listings/${id}`);
	}
	next();
};
