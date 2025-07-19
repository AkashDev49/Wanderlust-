const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");

main()
	.then(() => console.log("Connection Successful"))
	.catch((err) => {
		console.log(err);
	});

async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
	await Listing.deleteMany({});

	initData.data = initData.data.map((obj) => ({
		...obj,
		owner: "68680b58a72b3ba95b56898d",
	}));

	await Listing.insertMany(initData.data);
	console.log("Data was saved!!");
};

initDB();
