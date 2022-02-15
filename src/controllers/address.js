const address = require("../models/address");
const UserAddress = require("../models/address");

exports.addAddress = (req, res) => {
	const { payload } = req.body;

	if (payload.address) {
		UserAddress.findOneAndUpdate(
			{ user: req.user._id },
			{ $push: { address: payload.address } },
			{ new: true, upsert: true }
		).exec((error, address) => {
			if (error) return res.status(400).json({ error });
			if (address) return res.status(201).json({ address });
		});
	} else {
		res.status(400).json({ error: "Params address required" });
	}
};

exports.getAddress = (req, res) => {
	console.log("in get address");
	UserAddress.findOne({ user: req.user._id }).exec((error, userAddress) => {
		if (error) return res.status(400).json({ error });
		if (userAddress) {
			return res.status(200).json({ userAddress });
		} else {
			return res.status(200).json({ message: "Address not available" });
		}
	});
};
