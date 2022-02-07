const express = require("express");
const router = express.Router();

//user controller
const authController = require("../controllers/auth");
const { invalidRoute } = require("../controllers/other");

//auth validators
const {
	validateRequest,
	isRequestValidated,
	validateSignupRequest,
	validateSignInRequest,
} = require("../validators/authValidator");

router.post(
	"/signin",
	validateSignInRequest,
	isRequestValidated,
	authController.signin
);

router.post(
	"/signup",

	validateSignupRequest,
	isRequestValidated,
	//result is then passed to the signup controller fn
	authController.signup
);

// router.post("/profile", authController.requireSignin, (req, res) => {
// 	res.status(200).json({ user: "profile" });
// });

// router.all("*", invalidRoute);

module.exports = router;
