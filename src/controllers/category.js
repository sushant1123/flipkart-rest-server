const Category = require("../models/category");

//slugifies the given content
//e.g. 1. hello world will convert to hello-world
//     2. Sports Books & More will convert to Sports-Books-and-More
const slugify = require("slugify");

exports.createCategory = (req, res) => {
	const categoryObj = {
		name: req.body.name,
		slug: slugify(req.body.name),
	};

	if (req.file) {
		categoryObj.categoryPicture =
			`http://localhost:${process.env.PORT}/public/` + req.file.filename;
	}

	//if we get parentId in the req.body then only add to categoryObj
	if (req.body.parentId) {
		categoryObj.parentId = req.body.parentId;
	}

	//create a new obj of category
	const category = new Category(categoryObj);

	//save it in the category collection
	category.save((error, createdCategory) => {
		//if error, send the error back as response and return
		if (error) {
			return res.status(400).json({
				error,
				message: error.message,
			});
		}

		// if no error and we have createdCategory, send the createdCategory back as response and return
		if (createdCategory) {
			return res.status(201).json({
				category: createdCategory,
			});
		}
	});
};

exports.getAllCategories = (req, res) => {
	Category.find({}).exec((error, categories) => {
		//if error, send the error back as response and return
		if (error) {
			return res.status(400).json({
				error,
				message: error.message,
			});
		}

		// if no error and we have categories, send the categories back as response and return
		if (categories) {
			const nestedCategoryList = createNestedCategoryList(categories);

			return res.status(200).json({
				categories: nestedCategoryList,
			});
		}
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
			slug: cat.slug,
			subCategories: createNestedCategoryList(categories, cat._id),
		});
	}

	return nestedCategoryList;
};
