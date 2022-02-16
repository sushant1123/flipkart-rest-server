const Cart = require("../models/cart");
const Order = require("../models/order");

exports.addOrder = (req, res) => {
	//we need to remove items from the users cart after placing an order

	Cart.deleteOne({ user: req.user._id }).exec((error, result) => {
		//after placing an order, remove cart of the user
		if (error) return res.status(400).json({ error });
		if (result) {
			req.body.user = req.user._id;
			const order = new Order(req.body);

			//if cart got removed, then place the order
			order.save((error, createdOrder) => {
				if (error) return res.status(400).json({ error });
				if (createdOrder) return res.status(201).json({ order: createdOrder });
			});
		}
	});
};

exports.getOrders = (req, res) => {
	Order.find({ user: req.user._id })
		.select("_id paymentStatus items")
		.populate("items.productId", "_id name productPictures")
		.exec((error, orders) => {
			if (error) return res.status(400).json({ error });
			if (orders) return res.status(200).json({ orders });
		});
};
