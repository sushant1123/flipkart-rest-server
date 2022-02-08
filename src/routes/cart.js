const express = require("express");
const { addItemToCart } = require("../controllers/cart");
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

//fetch all carts
// router.get("/getCategories", getAllCategories);

module.exports = router;
