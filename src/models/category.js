const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
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
		categoryPicture: {
			type: String,
		},
		parentId: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = new mongoose.model("Category", CategorySchema);
