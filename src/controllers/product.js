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
			return { img: file.filename };
		});
	}

	const productObj = new ProductModel({
		name,
		slug: slugify(name),
		category,
		price,
		quantity,
		description,
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
		.select("_id")
		.exec((error, category) => {
			if (error) {
				return res.status(400).json({
					error,
				});
			}
			if (category) {
				// res.status(200).json({
				// 	category,
				// });
				ProductModel.find({ category: category._id })
					// .populate({ path: "category", select: "_id name" })
					.exec((productError, productsList) => {
						if (productError) {
							return res.status(400).json({
								error: productError,
							});
						}

						res.status(200).json({
							products: productsList,
							productsByPrice: {
								under5k: productsList.filter(
									(product) => product.price <= 5000
								),
								under10k: productsList.filter(
									(product) =>
										product.price > 5000 &&
										product.price <= 10000
								),
								under15k: productsList.filter(
									(product) =>
										product.price > 10000 &&
										product.price <= 15000
								),
								under20k: productsList.filter(
									(product) =>
										product.price > 15000 &&
										product.price <= 20000
								),
								under40k: productsList.filter(
									(product) =>
										product.price > 20000 &&
										product.price <= 40000
								),
								premiumPhones: productsList.filter(
									(product) => product.price >= 40000
								),
							},
						});
					});
			} else {
				res.status(200).json({
					message: "Category not found",
				});
			}
		});
};
