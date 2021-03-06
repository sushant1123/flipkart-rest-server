//models
const UserModel = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

exports.signup = (req, res) => {
	//finding if admin email already exists or not.
	UserModel.findOne({ email: req.body.email }).exec(async (error, user) => {
		//if error return the error response
		if (error) {
			return res.status(400).json({
				message: "Something went wrong",
				errormsg: JSON.stringify(error),
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
		const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS);

		const hashed_password = await bcrypt.hash(password, saltRounds);

		//User Object
		const userObj = new UserModel({
			firstName,
			lastName,
			email,
			hashed_password,
			username: email.split("@")[0] + shortid.generate(),
			role: "admin",
		});

		//save method creates and saves a document in the collection and have 2 objects in its callback
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
				return res.status(201).json({ message: "Admin created successfully....!" });
			}
		});
	});
};

exports.signin = (req, res) => {
	//find if email already exists or not

	UserModel.findOne({ email: req.body.email }).exec(async (error, user) => {
		if (error) {
			return res.status(500).json({
				error,
			});
		}

		//if use exists with email then check its password and for admin check if role is admin or not
		if (user) {
			const isPasswordCorrect = await user.authenticate(req.body.password);
			if (isPasswordCorrect && user.role === "admin") {
				//jwt sign with the payload (any data) as 1st, secret key as 2nd and expiresIn as 3rd argument
				const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
					expiresIn: "3d",
				});

				//saving token as a cookie
				res.cookie("token", token, { expiresIn: "3d" });

				// destructure from the user obj
				const { _id, firstName, lastName, email, role, fullName } = user;

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
				});
			}
		} else {
			return res.status(500).json({
				message: "Something went wrong",
			});
		}
	});
};

exports.signout = (req, res) => {
	res.clearCookie("token");
	res.status(200).json({
		message: "Signed-out successfully...!",
	});
};
