//Npm packages
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();
const passport = require("passport");
var session = require("express-session");
const cors = require("cors");

//packages within our repo
const projects = require("./routes/projects");
const s3 = require("./routes/s3Routes");
const users = require("./routes/users");
const auth = require("./routes/auth");
const about = require("./routes/about");
const parameters = require("./routes/parameters");
const tags = require("./routes/tags")
const { User } = require("./models/user");
const { Project } = require("./models/project");

const app = express();

// Enable CORS for all methods
app.use(cors())
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "*, x-auth-token")

	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
		return res.status(200).end();
	  }
	
	next()
  });

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.MONGO_URL)
  //.then(() => console.log("Connected to MongoDB..."))
  .then(() => {})
  .catch((err) => console.error("Could not connect to MongoDB..." + err));

app.use(express.json());
app.use("/api/projects", projects);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/parameters", parameters);
app.use("/api/about", about);
app.use("/api/s3", s3);
app.use("/api/tags", tags);

module.exports = app;
