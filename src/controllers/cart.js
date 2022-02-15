const Cart = require("../models/cart");

// exports.addItemToCart = (req, res) => {
// 	//if cart for the requested user already exists,
// 	CartModel.findOne({ user: req.user._id }).exec((error, userCart) => {
// 		if (error) {
// 			return res.status(400).json({ error });
// 		}

// 		// if no error and we have userCart
// 		if (userCart) {
// 			//if user cart is available then push cartItems or update quantity with it

// 			let promiseArray = [];

// 			//update the quantity if product is already in the cart

// 			const requestedProduct = req.body.cartItems.product;
// 			//	1. find if product is already added in the cart or not.
// 			const productAdded = userCart.cartItems.find(
// 				(ci) => ci.product == requestedProduct
// 			);

// 			let queryMatchCondition, queryUpdateAction;
// 			if (productAdded) {
// 				queryMatchCondition = {
// 					user: req.user._id,
// 					"cartItems.product": requestedProduct,
// 				};

// 				queryUpdateAction = {
// 					$set: {
// 						"cartItems.$": {
// 							...req.body.cartItems,
// 							quantity:
// 								productAdded.quantity +
// 								(req.body.cartItems.quantity || 1),
// 						},
// 					},
// 				};
// 			} else {
// 				queryMatchCondition = { user: req.user._id };
// 				queryUpdateAction = {
// 					$push: {
// 						cartItems: req.body.cartItems,
// 					},
// 				};
// 			}

// 			CartModel.findOneAndUpdate(
// 				queryMatchCondition,
// 				queryUpdateAction
// 			).exec((error, _cart) => {
// 				if (error) {
// 					return res.status(400).json({ error });
// 				}

// 				// if we have _cart, send the _cart back as response and return
// 				if (_cart) {
// 					return res.status(201).json({ cart: _cart });
// 				}
// 			});
// 		} else {
// 			//if cart not available
// 			//
// 			//
// 			//create a cart object
// 			const cart = new CartModel({
// 				user: req.user._id,
// 				cartItems: [req.body.cartItems],
// 			});

// 			//save the cart to the db
// 			cart.save((error, createdCart) => {
// 				if (error) {
// 					return res.status(400).json({ error });
// 				}

// 				// if no error and we have createdCart, send the createdCart back as response and return
// 				if (createdCart) {
// 					return res.status(201).json({ cart: createdCart });
// 				}
// 			});
// 		}
// 	});
// };

function runUpdate(condition, updateData) {
	return new Promise((resolve, reject) => {
		//you update code here

		Cart.findOneAndUpdate(condition, updateData, { upsert: true })
			.then((result) => resolve())
			.catch((err) => reject(err));
	});
}

exports.addItemToCart = (req, res) => {
	Cart.findOne({ user: req.user._id }).exec((error, userCart) => {
		if (error) return res.status(400).json({ error });
		if (userCart) {
			//if cart already exists then update cart by quantity
			let promiseArray = [];

			req.body.cartItems.forEach((cartItem) => {
				const product = cartItem.product;
				const item = userCart.cartItems.find(
					(c) => c.product == product
				);

				let condition, update;
				if (item) {
					condition = {
						user: req.user._id,
						"cartItems.product": product,
					};
					update = { $set: { "cartItems.$": cartItem } };
				} else {
					condition = { user: req.user._id };
					update = { $push: { cartItems: cartItem } };
				}
				promiseArray.push(runUpdate(condition, update));
				//Cart.findOneAndUpdate(condition, update, { new: true }).exec();
				// .exec((error, _cart) => {
				//     if(error) return res.status(400).json({ error });
				//     if(_cart){
				//         //return res.status(201).json({ cart: _cart });
				//         updateCount++;
				//     }
				// })
			});
			Promise.all(promiseArray)
				.then((response) => res.status(201).json({ response }))
				.catch((error) => res.status(400).json({ error }));
		} else {
			//if cart not exist then create a new cart
			const cartObj = new Cart({
				user: req.user._id,
				cartItems: req.body.cartItems,
			});

			cartObj.save((error, createdCart) => {
				if (error) return res.status(400).json({ error });
				if (createdCart) return res.status(201).json({ createdCart });
			});
		}
	});
};

exports.getCartItems = (req, res) => {
	//const { user } = req.body.payload;
	//if(user){
	Cart.findOne({ user: req.user._id })
		.populate("cartItems.product", "_id name price productPictures")
		.exec((error, cart) => {
			if (error) return res.status(400).json({ error });
			if (cart) {
				console.log("populated, cart");
				let cartItems = {};
				cart.cartItems.forEach((item, index) => {
					cartItems[item.product._id.toString()] = {
						_id: item.product._id.toString(),
						name: item.product.name,
						img: item.product.productPictures[0].img,
						price: item.product.price,
						qty: item.quantity,
					};
				});

				res.status(200).json({ cartItems });
			}
		});
	//}
};

// exports.getCartItems = (req, res) => {
// 	const { _id, role } = req.user;
// 	return res.status(200).json({
// 		message: `hello ${_id}`,
// 	});
// };
