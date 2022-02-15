const express = require("express");
const {
	requireSignin,
	userMiddleware,
} = require("../middlewares/requireSignIn");
const { addAddress, getAddress } = require("../controllers/address");
const router = express.Router();

router.post("/user/address/create", requireSignin, userMiddleware, addAddress);
router.post("/user/getAddress", requireSignin, userMiddleware, getAddress);

module.exports = router;
