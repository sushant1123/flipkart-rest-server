const mongoose = require("mongoose");

const ProducSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		slug: {
			type: String,
			required: true,
			unique: true,
		},

		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},

		price: {
			type: Number,
			required: true,
		},

		description: {
			type: String,
			required: true,
			trim: true,
		},

		quantity: {
			type: Number,
			required: true,
		},

		offer: {
			type: Number,
		},

		productPictures: [
			{
				img: {
					type: String,
				},
			},
		],

		reviews: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					review: String,
				},
			},
		],

		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		updatedAt: Date,
	},
	{ timestamps: true }
);

module.exports = new mongoose.model("Product", ProducSchema);
