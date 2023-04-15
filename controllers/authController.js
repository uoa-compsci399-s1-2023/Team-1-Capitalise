const { User } = require("../models/user");
const { Project } = require("../models/project");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const { postGoogleUser } = require("../controllers/userController");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

//Main authentication handler
const authenticateUser = async (req, res) => {
  //Use Joi to validate the req.body. POST JSON object should have a username and password.
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = "";
  //Check if a user exists with the same username specified in the request.
  if (req.body.email) {
    user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password.");
  } else if (req.body.username) {
    user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send("Invalid username or password.");
  } else {
    return res.status(400).send("You didn't provide a username or email!");
  }

  //Check if they were created using OAuth
  if (user.isGoogleCreated === true)
    return res.status(400).send("Please sign in using Google!");

  //Compare the password specified in the request password with that stored in the database.
  bcrypt.compare(req.body.password, user.password, function (err, result) {
    if (result === false) {
      return res.status(400).send("Invalid username or password.");
    } else {
      const token = user.generateAuthToken();
      res.send(token);
    }
  });
};

//Creates a Joi schema which requires a JSON object containing username and password specifiied by the client.
function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(3),
    username: Joi.string().min(3),
    password: Joi.string().min(3).required(),
  });

  return schema.validate(req);
}

//OAuth Handling

//Sets up the google strategy for OAuth via Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      //callbackURL: "http://localhost:3000/api/auth/google/callback",
      callbackURL:
        "https://bh71phacjb.execute-api.ap-southeast-2.amazonaws.com/api/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      let user = await User.findOne({ email: profile.email });
      if (!user) {
        user = await postGoogleUser(profile._json);
      }
      return done(null, user);
    }
  )
);

//Serialization
passport.serializeUser(function (user, done) {
  done(null, user);
});

//Deserialization
passport.deserializeUser(function (user, done) {
  done(null, user);
});

//Function which links to google OAuth handler
const googleOAuth = async (req, res) => {
  res.send('<a href="../auth/google/">Authenticate with Google</a>');
};

//Endpoint which is called once callback has occured. Provides a JSON Web Token in the response header. Session is destroyed, so can only be called once.
const protected = async (req, res) => {
  let user = await User.findOne({ email: req.user.email });
  if (!user) return res.status(400).send("Error: No user provided!");
  const token = user.generateAuthToken();
  req.session.destroy();
  res
    .header("x-auth-token", token)
    .send(
      token + "<br><p>x-auth-token should have been added to the response.</p>"
    );
};

//Called if Google sign in goes wrong
const failure = async (req, res) => {
  res.send("Something went wrong, authentication failed!");
};

//Placeholder for redirect.
const nextPage = async (req, res) => {
  //res.redirect('https://www.capitalise.space');
  let myHTML = `<!DOCTYPE html>
    <html>
    
    <head>
        <script>
    
            function fetchHtml() {
                fetch('../auth/protected')
                    .then((response) => {
                        return response.text();
                    })
                    .then((html) => {
                        document.body.innerHTML = html
                    });
            }
    
    
        </script>
    </head>
    <body>
        <button onclick = "fetchHtml()" > Waddup top g? - Get your token! </button>
    </body>
    
    </html>`;
  res.send(myHTML);
};

module.exports = {
  authenticateUser,
  googleOAuth,
  protected,
  failure,
  nextPage,
};
