//Npm packages
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();
const passport = require("passport");
var session = require("express-session");

//packages within our repo
const projects = require("./routes/projects");
const users = require("./routes/users");
const auth = require("./routes/auth");
const parameters = require("./routes/parameters");
const { User } = require("./models/user");
const { Project } = require("./models/project");

const app = express();

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
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..." + err));

app.use(express.json());
app.use("/api/projects", projects);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/parameters", parameters);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
