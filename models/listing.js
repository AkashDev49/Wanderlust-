const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	desc: String,
	image: {
		url: String,
		filename: String,
	},
	price: Number,
	location: String,
	country: String,
	review: [
		{
			type: Schema.Types.ObjectId,
			ref: "Review",
		},
	],
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	geometry: {
		type: {
			type: String, // Don't do `{ location: { type: String } }`
			enum: ["Point"], // 'location.type' must be 'Point'
			required: true,
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	},
});

// middleware for deleting listing with review
listingSchema.post("findOneAndDelete", async (deletedListingData) => {
	if (deletedListingData) {
		await Review.deleteMany({ _id: { $in: deletedListingData.review } });
	}
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
