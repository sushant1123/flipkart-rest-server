const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

//env variables or constants
dotenv.config();

//user schema to have data integrity in the application

const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			trim: true,
			required: true,
			min: 3,
			max: 20,
		},
		lastName: {
			type: String,
			trim: true,
			required: true,
			min: 3,
			max: 20,
		},
		username: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			index: true,
			lowercase: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			index: true,
			lowercase: true,
		},
		hashed_password: {
			type: String,
			required: true,
			trim: true,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		contactNumber: {
			type: String,
		},
		profilePicture: {
			type: String,
		},
	},

	{ timestamps: true } // used to add timestamps (createdat and updatedat)
);

// virtual is a property that is not stored in the mongodb but we can accept it as a req.body. Typically used for computed properties

// console.log(process.env.PASSWORD_SALT_ROUNDS);

// UserSchema.virtual("password").set(function (password) {
// 	//hashSync method returns a hashed password by applying salt rounds (more encryption) on the password
// 	this.hashed_password = bcrypt.hashSync(
// 		password,
// 		parseInt(process.env.PASSWORD_SALT_ROUNDS)
// 	);
// });

//creates a virtual field called 'fullName'
UserSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

//instance methods (own custom document instance methods )
UserSchema.methods = {
	authenticate: async function (password) {
		// arrow fn won't work here
		//compare method compares the given password and hashed_password and return the result
		return await bcrypt.compare(password, this.hashed_password);
	},
};

module.exports = mongoose.model("User", UserSchema); //exporting model (like a collection)
