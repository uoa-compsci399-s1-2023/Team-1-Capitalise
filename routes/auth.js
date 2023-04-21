const express = require("express");
const router = express.Router();
const passport = require("passport");
const { googleAuth } = require("../middleware/auth");

const {
  authenticateUser,
  googleOAuth,
  protected,
  failure,
  nextPage,
} = require("../controllers/authController");

//Authenticates a user.
router.post("/", authenticateUser);

router.get("/oauth", googleOAuth);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "../protected",
    failureRedirect: "http://localhost:8080/googleFailure",
  })
);

router.get("/failure", failure);

router.get("/nextPage", nextPage);

router.get("/protected", googleAuth, protected);

module.exports = router;
