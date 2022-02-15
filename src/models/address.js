const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		min: 3,
		max: 50,
	},
	mobileNumber: {
		type: String,
		required: true,
		trim: true,
	},
	pinCode: {
		type: String,
		required: true,
		trim: true,
	},
	locality: {
		type: String,
		required: true,
		trim: true,
		min: 10,
		max: 100,
	},
	address: {
		type: String,
		required: true,
		trim: true,
		min: 10,
		max: 100,
	},
	cityDistrictTown: {
		type: String,
		required: true,
		trim: true,
	},
	state: {
		type: String,
		required: true,
		trim: true,
	},
	landmark: {
		type: String,
		min: 10,
		max: 100,
	},
	alternatePhone: {
		type: String,
	},
	addressType: {
		type: String,
		required: true,
		enum: ["home", "work"],
	},
});

// B
const UserAddressSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		address: [AddressSchema],
	},
	{ timestamps: true }
);

mongoose.model("Address", AddressSchema);
module.exports = mongoose.model("UserAddress", UserAddressSchema);
