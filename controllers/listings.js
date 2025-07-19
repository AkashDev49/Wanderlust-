const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//INDEX ROUTE
module.exports.index = async (req, res) => {
	let allListings = await Listing.find();
	res.render("./listings/index.ejs", { allListings });
};

//CREATE ROUTE --> New Form Given
module.exports.renderNewForm = (req, res) => {
	res.render("./listings/new.ejs");
};

//ADD ROUTE --> New Listing Add
module.exports.addNewListing = async (req, res, next) => {
	let locationListing = await geocodingClient
		.forwardGeocode({
			query: req.body.listing.location,
			limit: 1,
		})
		.send();

	let url = req.file.path;
	let filename = req.file.filename;

	let newListing = new Listing(req.body.listing);

	newListing.owner = req.user._id;
	newListing.image = { url, filename };

	newListing.geometry = locationListing.body.features[0].geometry;

	let savedListing = await newListing.save();
	console.log(savedListing);

	req.flash("success", "New Listing Created");
	res.redirect("/listings");
};

//READ ROUTE --> Show All Listings
module.exports.showAll = async (req, res) => {
	let { id } = req.params;
	let listing = await Listing.findById(id)
		.populate({
			path: "review",
			populate: { path: "author" },
		})
		.populate("owner");

	if (!listing) {
		req.flash("error", "Listing does not exist!");
		res.redirect("/listings");
	} else {
		res.render("./listings/show.ejs", {
			listing,
			mapToken: process.env.MAP_TOKEN, // :white_check_mark: add this line
		});
	}
};

//EDIT ROUTE --> Edit Form for Lisitng
module.exports.editListingFrom = async (req, res) => {
	let { id } = req.params;
	let listing = await Listing.findById(id);
	if (!listing) {
		req.flash("error", "Listing does not exist!");
		res.redirect("/listings");
	} else {
		let originalImgUrl = listing.image.url;
		originalImgUrl = originalImgUrl.replace("/upload", "/upload/h_300,w_250");
		res.render("./listings/edit.ejs", { listing, originalImgUrl });
	}
};

//UPDATE ROUTE --> Updated Listing
module.exports.updatedListing = async (req, res) => {
	let { id } = req.params;

	let listing = await Listing.findByIdAndUpdate(id, {
		...req.body.listing,
	});

	if (typeof req.file !== "undefined") {
		let url = req.file.path;
		let filename = req.file.filename;

		listing.image = { url, filename };
		await listing.save();
	}

	req.flash("success", "Listing updated!");
	// console.log({ id });
	res.redirect(`/listings/${id}`);
};

//DELETE ROUTE
module.exports.destroyListing = async (req, res) => {
	let { id } = req.params;
	let deleteList = await Listing.findByIdAndDelete(id);
	req.flash("success", "Delete Successfully!");
	res.redirect("/listings");
};
