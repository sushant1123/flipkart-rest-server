const express = require("express");
const { getOrders, addOrder, getOrder } = require("../controllers/order");
const router = express.Router();
const { requireSignin, userMiddleware } = require("../middlewares/requireSignIn");

//get all the requests
router.post("/user/getOrder", requireSignin, userMiddleware, getOrder);
router.get("/user/getOrders", requireSignin, userMiddleware, getOrders);

router.post("/user/order/create", requireSignin, userMiddleware, addOrder);

module.exports = router;
