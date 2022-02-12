const express = require("express");
const multer = require("multer");
const router = express.Router();
const { createPage } = require("../../controllers/admin/page");
const { upload } = require("../../middlewares/fileUploadMiddleware");
const {
	adminMiddleware,
	requireSignin,
} = require("../../middlewares/requireSignIn");

router.post(
	"/page/create",
	upload.fields([{ name: "banners" }, { name: "products" }]),
	requireSignin,
	adminMiddleware,
	createPage
);

module.exports = router;
