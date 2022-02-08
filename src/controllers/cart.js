const CartModel = require("../models/cart");

exports.addItemToCart = (req, res) => {
	//if cart for the requested user already exists,
	CartModel.findOne({ user: req.user._id }).exec((error, userCart) => {
		if (error) {
			return res.status(400).json({
				error,
				message: error.message,
			});
		}

		// if no error and we have userCart
		if (userCart) {
			//if user cart is available then push cartItems or update quantity with it

			//update the quantity if product is already in the cart

			const requestedProduct = req.body.cartItems.product;
			//	1. find if product is already added in the cart or not.
			const productAdded = userCart.cartItems.find(
				(ci) => ci.product == requestedProduct
			);

			let queryMatchCondition, queryUpdateAction;
			if (productAdded) {
				queryMatchCondition = {
					user: req.user._id,
					"cartItems.product": requestedProduct,
				};

				queryUpdateAction = {
					$set: {
						"cartItems.$": {
							...req.body.cartItems,
							quantity:
								productAdded.quantity +
								(req.body.cartItems.quantity || 1),
						},
					},
				};
			} else {
				queryMatchCondition = { user: req.user._id };
				queryUpdateAction = {
					$push: {
						cartItems: req.body.cartItems,
					},
				};
			}

			CartModel.findOneAndUpdate(
				queryMatchCondition,
				queryUpdateAction
			).exec((error, _cart) => {
				if (error) {
					return res.status(400).json({
						error,
						message: error.message,
					});
				}

				// if we have _cart, send the _cart back as response and return
				if (_cart) {
					return res.status(201).json({
						cart: _cart,
					});
				}
			});
		} else {
			//if cart not available
			//
			//
			//create a cart object
			const cart = new CartModel({
				user: req.user._id,
				cartItems: [req.body.cartItems],
			});

			//save the cart to the db
			cart.save((error, createdCart) => {
				if (error) {
					return res.status(400).json({
						error,
						message: error.message,
					});
				}

				// if no error and we have createdCart, send the createdCart back as response and return
				if (createdCart) {
					return res.status(201).json({
						cart: createdCart,
					});
				}
			});
		}
	});
};
