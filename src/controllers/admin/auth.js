//models
const UserModel = require("../../models/user");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
	//finding if email already exists or not.
	UserModel.findOne({ email: req.body.email }).exec((error, user) => {
		//if error return the error response
		if (error) {
			return res.status(400).json({
				message: "Something went wrong",
				errorMsg: JSON.stringify(error),
			});
		}

		//if email already present/registered
		if (user) {
			return res.status(400).json({
				message: "Admin with the given email already registered",
			});
		}

		//distructure required fields from the req.body to create a userObj
		const { firstName, lastName, email, password } = req.body;

		//User Object
		const userObj = new UserModel({
			firstName,
			lastName,
			email,
			password,
			username: Math.random().toString(), // logic not defined yet
			role: "admin",
		});

		//save method creates ad saves a document in the collection and returns 2 objects
		//1: error obj
		//2: created obj

		userObj.save((error, createdUser) => {
			if (error) {
				return res.status(400).json({
					message: "Something went wrong",
					errorMsg: JSON.stringify(error),
				});
			}
			if (createdUser) {
				return res
					.status(201)
					.json({ message: "Admin created successfully....!" });
			}
		});
	});
};

exports.signin = (req, res) => {
	UserModel.findOne({ email: req.body.email }).exec((error, user) => {
		if (error) {
			return res.status(500).json({
				error,
			});
		}

		if (user) {
			if (user.authenticate(req.body.password) && user.role === "admin") {
				const token = jwt.sign(
					{ _id: user._id },
					process.env.JWT_SECRET,
					{ expiresIn: "3d" }
				);
				const { _id, firstName, lastName, email, role, fullName } =
					user;

				return res.status(200).json({
					token,
					user: {
						_id,
						firstName,
						lastName,
						email,
						role,
						fullName,
					},
				});
			} else {
				return res.status(400).json({
					message: "Invalid admin credentials",
					// errorMsg: error,
				});
			}
		} else {
			return res.status(500).json({
				message: "Something went wrong",
				// errorMsg: error,
			});
		}
	});
};

exports.requireSignin = (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];

	console.log(token);

	//will verify the token and return the data we associated with the sign fn of jwt after decoding.
	// In our case. it is _id

	const user = jwt.verify(token, process.env.JWT_SECRET);

	//attaching the user with request obj
	req.user = user;

	next();
};
