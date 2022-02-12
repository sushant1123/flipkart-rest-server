const express = require("express");
const router = express.Router();
const { initialDataRequest } = require("../../controllers/admin/initialData");
const {
	requireSignin,
	adminMiddleware,
} = require("../../middlewares/requireSignIn");

router.get("/initialdata", requireSignin, adminMiddleware, initialDataRequest);

module.exports = router;
