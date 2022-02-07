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
	validateSignInRequest, //calls the given fn and validate the request
	isRequestValidated, //calls the given fn and returns if request is validated successfully or not
	authController.signin //if request is validated, result is then passed to the signup controller fn
);

router.post(
	"/signup",

	validateSignupRequest, //calls the given fn and validate the request
	isRequestValidated, //calls the given fn and returns if request is validated successfully or not
	authController.signup //if request is validated, result is then passed to the signup controller fn
);

// router.post("/profile", authController.requireSignin, (req, res) => {
// 	res.status(200).json({ user: "profile" });
// });

// router.all("*", invalidRoute);

module.exports = router;
