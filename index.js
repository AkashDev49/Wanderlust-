if (process.env.NODE_ENV != "production") {
	require("dotenv").config();
}

//Express setup
const express = require("express");
const app = express();
let port = 8080;

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const mongoose = require("mongoose");
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//Routes
const listingRotuer = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const dbUrl = process.env.ATLAS_URL;

main()
	.then(() => console.log("Connection Successful"))
	.catch((err) => {
		console.log(err);
	});

async function main() {
	await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
	mongoUrl: dbUrl,
	crypto: {
		secret: process.env.SECRET,
	},
	touchAfter: 24 * 3600,
});

store.on("error", (err) => {
	console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOpt = {
	store,
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		exprires: Date.now() + 7 * 24 * 60 * 60 * 1000,
		maxAge: 7 * 24 * 60 * 60 * 1000,
		httpOnly: true,
	},
};

app.use(session(sessionOpt));
app.use(flash());

//Password authentications
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.currUser = req.user;
	next();
});

// app.get("/demouser", async (req, res) => {
// 	let fakeUser = new User({
// 		email: "abc23@gmail.com",
// 		username: "delta-student",
// 	});

// 	let registeredUser = await User.register(fakeUser, "HelloWorld");
// 	res.send(registeredUser);
// });

app.listen(port, () => {
	console.log(`server is running on port${port}`);
});

//Router
app.use("/listings", listingRotuer);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//ERROR HANDLER
app.all(/.*/, (req, res, next) => {
	next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
	const { statusCode = 500, message = "Somthing went wrong" } = err;
	// res.status(statusCode).send(message);
	res.status(statusCode).render("error.ejs", { message });
});

//Sample Data listing
// app.get("/testlisting", async (req, res) => {
// 	let smapleListing = new Listing({
// 		title: "Billa de Villa",
// 		desc: "Best Beach Villa in State",
// 		price: 29000,
// 		location: "Goa",
// 		country: "India",
// 	});

// 	await smapleListing.save();
// 	console.log("Sample Create Successful!!");

// 	res.send("Testing Completed!");
// });
