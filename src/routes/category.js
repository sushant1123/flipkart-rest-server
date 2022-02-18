const express = require("express");
const {
	createCategory,
	getAllCategories,
	updateCategories,
	deleteCategories,
} = require("../controllers/category");
const { requireSignin, adminMiddleware } = require("../middlewares/requireSignIn");
const router = express.Router();

const { uploadS3 } = require("../middlewares/fileUploadMiddleware");

//create categories
router.post(
	"/category/create",
	requireSignin,
	adminMiddleware,
	uploadS3.single("categoryPicture"),
	createCategory
);

//fetch all categories
router.get("/category/getCategories", getAllCategories);

router.post(
	"/category/update",
	requireSignin,
	uploadS3.array("categoryPicture"),
	adminMiddleware,
	updateCategories
);

router.post("/category/delete", requireSignin, adminMiddleware, deleteCategories);

module.exports = router;
