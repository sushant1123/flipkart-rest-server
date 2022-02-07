const { check, validationResult } = require("express-validator");

exports.validateSignupRequest = [
	//with check fn present in the express-validator, we validate the input
	check("firstName").notEmpty().withMessage("firstName is required"),
	check("lastName").notEmpty().withMessage("lastName is required"),
	check("email").isEmail().withMessage("Valid email is required"),
	check("password")
		.isLength({ min: 6, max: 20 })
		.withMessage(
			"password must be atleast 6 characters and atmost 20 characters long"
		),
];

exports.validateSignInRequest = [
	check("email").isEmail().withMessage("Valid email is required"),
	check("password")
		.isLength({ min: 6, max: 20 })
		.withMessage(
			"password must be atleast 6 characters and atmost 20 characters long"
		),
];

exports.isRequestValidated = (req, res, next) => {
	const errors = validationResult(req);

	if (errors.array().length) {
		return res.status(400).json({
			error: errors.array()[0].msg,
		});
	}
	next();
};
