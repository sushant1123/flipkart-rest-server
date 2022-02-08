const express = require("express");
const { createCategory, getAllCategories } = require("../controllers/category");
const {
	requireSignin,
	adminMiddleware,
} = require("../middlewares/requireSignIn");
const router = express.Router();

const multer = require("multer");
const shortId = require("shortid");
const path = require("path");

const multerStorage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, path.join(path.dirname(__dirname), "uploads"));
	},
	filename: (req, file, callback) => {
		callback(null, shortId.generate() + "-" + file.originalname);
	},
});

const multerUpload = multer({ storage: multerStorage });

//create categories
router.post(
	"/category/create",
	requireSignin,
	adminMiddleware,
	multerUpload.single("categoryPicture"),
	createCategory
);

//fetch all categories
router.get("/category/getCategories", getAllCategories);

module.exports = router;