const { check, validationResult } = require("express-validator");

//validation for signup request obj
exports.validateSignupRequest = [
	//with check fn present in the express-validator package, we validate the input
	check("firstName").notEmpty().withMessage("firstName is required"),
	check("lastName").notEmpty().withMessage("lastName is required"),
	check("email").isEmail().withMessage("Valid email is required"),
	check("password")
		.isLength({ min: 6, max: 20 })
		.withMessage(
			"password must be atleast 6 characters and atmost 20 characters long"
		),
];

//validation for signin request obj
exports.validateSignInRequest = [
	check("email").isEmail().withMessage("Valid email is required"),
	check("password")
		.isLength({ min: 6, max: 20 })
		.withMessage(
			"password must be atleast 6 characters and atmost 20 characters long"
		),
];

//is our req. validated with the help of validationResult
exports.isRequestValidated = (req, res, next) => {
	//returns an array of errors
	const errors = validationResult(req);

	// if errors array length is greater than 1
	if (errors.array().length) {
		return res.status(400).json({
			error: errors.array()[0].msg,
		});
	}
	//if no errors then pass the control to the next middleware fn
	next();
};
