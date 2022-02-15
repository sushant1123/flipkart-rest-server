const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		cartItems: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: { type: Number, default: 1 },
				//price not needed as we are getting it from product
				// price: {
				// 	type: Number,
				// 	required: true,
				// },
			},
		],
	},
	{ timestamps: true }
);

module.exports = new mongoose.model("Cart", CartSchema);
