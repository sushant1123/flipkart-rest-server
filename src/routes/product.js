const express = require("express");
const {
	createProduct,
	getAllProductsBySlug,
	getProducts,
	getProductDetailsById,
	deleteProductById,
} = require("../controllers/product");

const { requireSignin, adminMiddleware } = require("../middlewares/requireSignIn");
const router = express.Router();

const { uploadS3 } = require("../middlewares/fileUploadMiddleware");

//create a product
router.post(
	"/product/create",
	requireSignin,
	adminMiddleware,
	uploadS3.array("productPicture"),
	createProduct
);

router.delete("/admin/product/deleteProductById", requireSignin, adminMiddleware, deleteProductById);

router.post("/admin/products/getProducts", requireSignin, adminMiddleware, getProducts);

//fetch product by slug id
router.get("/products/:slug", getAllProductsBySlug);

//fetch product by productId id
router.get("/product/:productId", getProductDetailsById);

module.exports = router;
