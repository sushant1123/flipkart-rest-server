const ProductModel = require("../models/product");
const shortId = require("shortid");
const slugify = require("slugify");
const Category = require("../models/category");

exports.createProduct = (req, res) => {
	// res.status(200).json({ file: req.files, body: req.body });
	let { name, category, price, description, quantity } = req.body;

	//since ProductPictures is an array
	let productPictures = [];

	if (req.files.length) {
		productPictures = req.files.map((file) => {
			return { img: file.location };
		});
	}

	const productObj = new ProductModel({
		name,
		slug: `${slugify(name)}-${shortId.generate()}`,
		category,
		price,
		quantity,
		description: description ? description : "NA",
		productPictures,
		createdBy: req.user._id,
	});

	productObj.save((error, createdProduct) => {
		//if error, send the error back as response and return
		if (error) {
			return res.status(400).json({
				error,
				message: error.message,
			});
		}
		// if no error and we have createdProduct, send the createdProduct back as response and return
		if (createdProduct) {
			return res.status(201).json({
				product: createdProduct,
			});
		}
	});
};

exports.getAllProductsBySlug = (req, res) => {
	const { slug } = req.params;

	Category.findOne({ slug: slug })
		.select("_id type")
		.exec((error, category) => {
			if (error) {
				return res.status(400).json({ error });
			}
			if (category) {
				ProductModel.find({ category: category._id })
					// .populate({ path: "category", select: "_id name" })
					.exec((productError, productsList) => {
						if (productError) {
							return res.status(400).json({ error: productError });
						}

						if (category.type) {
							if (productsList.length > 0) {
								res.status(200).json({
									products: productsList,
									priceRange: {
										under5k: 5000,
										under10k: 10000,
										under15k: 15000,
										under20k: 20000,
										under40k: 40000,
									},
									productsByPrice: {
										under5k: productsList.filter((product) => product.price <= 5000),
										under10k: productsList.filter(
											(product) => product.price > 5000 && product.price <= 10000
										),
										under15k: productsList.filter(
											(product) => product.price > 10000 && product.price <= 15000
										),
										under20k: productsList.filter(
											(product) => product.price > 15000 && product.price <= 20000
										),
										under40k: productsList.filter(
											(product) => product.price > 20000 && product.price <= 40000
										),
										premiumPhones: productsList.filter(
											(product) => product.price >= 40000
										),
									},
								});
							}
						} else {
							res.status(200).json({ products: productsList });
						}
					});
			} else {
				res.status(404).json({ message: "Category not found" });
			}
		});
};

//new
exports.getProducts = async (req, res) => {
	const products = await ProductModel.find({ createdBy: req.user._id })
		.select("_id name price quantity slug description productPictures category")
		.populate({ path: "category", select: "_id name" })
		.exec();

	res.status(200).json({ products });
};

exports.getProductDetailsById = async (req, res) => {
	try {
		const { productId } = req.params;
		if (productId) {
			ProductModel.findOne({ _id: productId }).exec((error, product) => {
				if (error) {
					return res.status(400).json({ error });
				}

				if (product) {
					return res.status(200).json({ product });
				}
			});
		} else {
			return res.status(400).json({ message: "Params required" });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error });
	}
};

exports.deleteProductById = (req, res) => {
	const { productId } = req.body.payload;
	if (productId) {
		ProductModel.deleteOne({ _id: productId }).exec((error, result) => {
			if (error) return res.status(400).json({ error });
			if (result) {
				res.status(202).json({ result });
			}
		});
	} else {
		res.status(400).json({ error: "Params required" });
	}
};
