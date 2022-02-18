const express = require("express");
const router = express.Router();

const { updateOrder, getCustomerOrders } = require("../../controllers/admin/order.admin");
const { requireSignin, adminMiddleware } = require("../../middlewares/requireSignIn");

router.post("/admin/order/update", requireSignin, adminMiddleware, updateOrder);

router.post("/admin/order/getCustomerOrders", requireSignin, adminMiddleware, getCustomerOrders);

module.exports = router;
