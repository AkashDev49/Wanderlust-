const express = require("express");
const router = express.Router();

//WrapAsync Error Handler
const wrapAsync = require("../utils/wrapAsync.js");

//middleware's
const { isLoggedin } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");

//controller
const listingController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudCofing.js");
const upload = multer({ storage });

router
	.route("/")
	.get(wrapAsync(listingController.index)) //INDEX ROUTE
	//ADD ROUTE --> New Listing Add
	.post(
		isLoggedin,
		upload.single("listing[image]"),
		validateListing,
		wrapAsync(listingController.addNewListing)
	);

//CREATE ROUTE --> New Form Given
router.get("/new", isLoggedin, listingController.renderNewForm);

router
	.route("/:id")
	.get(wrapAsync(listingController.showAll)) //READ ROUTE --> Show All Listings
	//UPDATE ROUTE --> Updated Listing
	.put(
		isLoggedin,
		isOwner,
		upload.single("listing[image]"),
		validateListing,
		wrapAsync(listingController.updatedListing)
	)
	.delete(isLoggedin, isOwner, wrapAsync(listingController.destroyListing)); //DELETE ROUTE

//EDIT ROUTE --> Edit Form for Lisitng
router.get(
	"/:id/edit",
	isLoggedin,
	isOwner,
	wrapAsync(listingController.editListingFrom)
);

module.exports = router;
