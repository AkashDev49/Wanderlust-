const express = require("express");
const router = express.Router({ mergeParams: true });

const { isLoggedin } = require("../middleware.js");
const { validateReview } = require("../middleware.js");
const { isAuthor } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

const reviewController = require("../controllers/reviews.js");

//Reviews POST ROUTE
router.post(
	"/",
	isLoggedin,
	validateReview,
	wrapAsync(reviewController.createReview)
);

//REVIEW DELETE ROUTE
router.delete(
	"/:reviewId",
	isLoggedin,
	isAuthor,
	wrapAsync(reviewController.destroyReview)
);

module.exports = router;
