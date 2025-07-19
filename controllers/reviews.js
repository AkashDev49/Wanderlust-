//models
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

//Reviews POST ROUTE
module.exports.createReview = async (req, res) => {
	let listingId = await Listing.findById(req.params.id);
	let newReview = new Review(req.body.Review);
	newReview.author = req.user._id;

	listingId.review.push(newReview);

	await listingId.save();
	await newReview.save();

	req.flash("success", "Review add!");
	res.redirect(`/listings/${listingId._id}`);
};

//REVIEW DELETE ROUTE
module.exports.destroyReview = async (req, res) => {
	let { id, reviewId } = req.params;

	await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
	await Review.findByIdAndDelete(reviewId);

	req.flash("success", "Review deleted!");
	res.redirect(`/listings/${id}`);
};
