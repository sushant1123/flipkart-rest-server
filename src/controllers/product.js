const ProductModel = require("../models/product");
const shortId = require("shortid");
const slugify = require("slugify");

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
