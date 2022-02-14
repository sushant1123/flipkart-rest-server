const express = require("express");
const {
	createProduct,
	getAllProductsBySlug,
	getAllProductsData,
	getProductDetailsById,
} = require("../controllers/product");
const {
	requireSignin,
	adminMiddleware,
} = require("../middlewares/requireSignIn");
const router = express.Router();
const multer = require("multer");
const shortId = require("shortid");
const path = require("path");

const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(path.dirname(__dirname), "uploads"));
	},
	filename: (req, file, cb) => {
		cb(null, shortId.generate() + "-" + file.originalname);
	},
});

const upload = multer({ storage: multerStorage });

//create a product
router.post(
	"/product/create",
	requireSignin,
	adminMiddleware,
	upload.array("productPicture"),
	createProduct
);

router.get("/products/getProducts", getAllProductsData);

//fetch product by slug id
router.get("/products/:slug", getAllProductsBySlug);

//fetch product by productId id
router.get("/product/:productId", getProductDetailsById);

module.exports = router;
