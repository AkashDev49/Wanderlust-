const mongoose = require("mongoose");
const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
require("dotenv").config();

const mapToken =
	"pk.eyJ1IjoiYWFrYXNoZGVsdGEiLCJhIjoiY21jdXA0ZGl3MDJjcjJpczh5cnE3ejBjcyJ9.xiyQbLbKBhTb5dNTfs7MiQ";
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

main().catch((err) => console.error(err));

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
	console.log("✅ Connected to DB");

	const listings = await Listing.find({ geometry: { $exists: false } });

	console.log(`Found ${listings.length} listings without geometry.`);

	for (let listing of listings) {
		try {
			const geoData = await geocodingClient
				.forwardGeocode({
					query: listing.location,
					limit: 1,
				})
				.send();

			if (geoData.body.features.length > 0) {
				listing.geometry = geoData.body.features[0].geometry;
				await listing.save();
				console.log(`✅ Updated geometry for: ${listing.title}`);
			} else {
				console.log(`⚠️ No result for: ${listing.title}`);
			}
		} catch (err) {
			console.log(`❌ Error for: ${listing.title}: ${err.message}`);
		}
	}

	console.log("🎉 Done!");
	mongoose.connection.close();
}
