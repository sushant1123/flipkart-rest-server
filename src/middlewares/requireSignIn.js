const jwt = require("jsonwebtoken");

exports.requireSignin = (req, res, next) => {
	// check if user logged in or not

	if (req.headers.authorization) {
		const token = req.headers.authorization.split(" ")[1];

		// console.log(token);

		//will verify the token and return the data we associated with the sign fn of jwt after decoding.
		// In our case. it is _id

		const user = jwt.verify(token, process.env.JWT_SECRET);

		//attaching the user with request obj
		req.user = user;

		//pass the control to the next middleware
		next();
	} else {
		return res.status(401).json({
			message: "Authorization required",
		});
	}
};

//middleware for a user
exports.userMiddleware = (req, res, next) => {
	// if it is not a user, return access denied response
	if (req.user.role !== "user") {
		return res.status(403).json({
			message: "User access denied",
		});
	}
	next();
};

//middleware for an admin
exports.adminMiddleware = (req, res, next) => {
	// if user is not an admin return access denied response
	if (req.user.role !== "admin") {
		return res.status(403).json({
			message: "Admin access denied",
		});
	}
	next();
};
