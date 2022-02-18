const express = require("express");
const multer = require("multer");
const router = express.Router();
const { createPage, getPage } = require("../../controllers/admin/page");
const { uploadS3 } = require("../../middlewares/fileUploadMiddleware");
const { adminMiddleware, requireSignin } = require("../../middlewares/requireSignIn");

router.post(
	"/page/create",
	uploadS3.fields([{ name: "banners" }, { name: "products" }]),
	requireSignin,
	adminMiddleware,
	createPage
);

router.get("/page/:category/:type", getPage);

module.exports = router;
