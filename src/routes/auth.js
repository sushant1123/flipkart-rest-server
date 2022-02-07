const express = require("express");
const router = express.Router();

//user controller
const authController = require("../controllers/auth");
const { invalidRoute } = require("../controllers/other");

router.post("/signin", authController.signin);

router.post("/signup", authController.signup);

// router.post("/profile", authController.requireSignin, (req, res) => {
// 	res.status(200).json({ user: "profile" });
// });

// router.all("*", invalidRoute);

module.exports = router;
