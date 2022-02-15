const express = require("express");
const { addItemToCart, getCartItems } = require("../controllers/cart");
const {
	requireSignin,
	userMiddleware,
} = require("../middlewares/requireSignIn");
const router = express.Router();

//create cart
router.post(
	"/user/cart/addtocart",
	requireSignin,
	userMiddleware,
	addItemToCart
);

//fetch all cart items
router.post("/user/getCartItems", requireSignin, userMiddleware, getCartItems);

module.exports = router;
