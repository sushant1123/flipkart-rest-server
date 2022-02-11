const CategoryModel = require("../../models/category");
const ProductModel = require("../../models/product");

exports.initialDataRequest = async (req, res) => {
	//fetch all the data
	const categories = await CategoryModel.find({}).exec();
	const products = await ProductModel.find({})
		.select(
			"_id name price quantity slug description productPictures category"
		)
		.populate({ path: "category", select: "_id name" })
		.exec();

	//return the response
	res.status(200).json({
		categories: createNestedCategoryList(categories),
		products,
	});
};

//nest all the categories as per their parent
const createNestedCategoryList = (categories, parentId = null) => {
	const nestedCategoryList = [];
	let category;

	//if parentId is null, filter all the parent level categories
	if (parentId == null) {
		category = categories.filter(
			(singleCategory) => singleCategory.parentId == undefined
		);
	}
	//if parentId is not null, filter all the categories based on parentId
	else {
		category = categories.filter(
			(singleCategory) => singleCategory.parentId == parentId
		);
	}

	for (let cat of category) {
		nestedCategoryList.push({
			_id: cat._id,
			name: cat.name,
			parentId: cat.parentId,
			slug: cat.slug,
			subCategories: createNestedCategoryList(categories, cat._id),
		});
	}

	return nestedCategoryList;
};