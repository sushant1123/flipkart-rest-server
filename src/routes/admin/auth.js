const express = require("express");
const router = express.Router();

//user controller
const authController = require("../../controllers/admin/auth");
const { invalidRoute } = require("../../controllers/other");
const {
	validateSignInRequest,
	isRequestValidated,
	validateSignupRequest,
} = require("../../validators/authValidator");

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
	authController.signup
);

// router.post("/profile", authController.requireSignin, (req, res) => {
// 	res.status(200).json({ user: "profile" });
// });

// router.all("*", invalidRoute);

module.exports = router;
