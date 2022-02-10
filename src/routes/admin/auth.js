const express = require("express");
const router = express.Router();

//user controller
const { signin, signout, signup } = require("../../controllers/admin/auth");
const { invalidRoute } = require("../../controllers/other");
const {
	validateSignInRequest,
	isRequestValidated,
	validateSignupRequest,
} = require("../../validators/authValidator");
const { requireSignin } = require("../../middlewares/requireSignIn");

router.post(
	"/admin/signin",
	validateSignInRequest, //calls the given fn and validate the request
	isRequestValidated, //calls the given fn and returns if request is validated successfully or not
	signin //if request is validated, result is then passed to the signup controller fn
);

router.post(
	"/admin/signup",
	validateSignupRequest, //calls the given fn and validate the request
	isRequestValidated, //calls the given fn and returns if request is validated successfully or not
	signup //if request is validated, result is then passed to the signup controller fn
);

router.post("/admin/signout", requireSignin, signout);

module.exports = router;
