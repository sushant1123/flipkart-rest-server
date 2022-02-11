const Category = require("../models/category");

//slugifies the given content
//e.g. 1. hello world will convert to hello-world
//     2. Sports Books & More will convert to Sports-Books-and-More
const slugify = require("slugify");
const shortid = require("shortid");

exports.createCategory = (req, res) => {
	const categoryObj = {
		name: req.body.name,
		slug: `${slugify(req.body.name)}-${shortid.generate()}`,
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
			parentId: cat.parentId,
			slug: cat.slug,
			subCategories: createNestedCategoryList(categories, cat._id),
		});
	}

	return nestedCategoryList;
};

//update 1 or more categories
exports.updateCategories = async (req, res) => {
	const { _id, name, parentId, type } = req.body;

	const updatedCategories = [];

	if (name instanceof Array) {
		for (let i = 0; i < name.length; i++) {
			const category = {
				name: name[i],
				slug: `${slugify(name[i])}-${shortid.generate()}`,
				type: type[i],
			};

			if (parentId[i] !== "") {
				category.parentId = parentId[i];
			}

			const updatedCategory = await Category.findOneAndUpdate(
				{ _id: _id[i] },
				category,
				{
					new: true,
					runValidators: true,
				}
			);
			updatedCategories.push(updatedCategory);
		}
		return res.status(201).json({
			updatedCategories,
		});
	} else {
		const category = {
			name,
			type,
			slug: slugify(name),
		};
		if (parentId !== "") {
			category.parentId = parentId;
		}

		const updatedCategory = await Category.findOneAndUpdate(
			{ _id: _id },
			category,
			{
				new: true,
				runValidators: true,
			}
		);

		return res.status(201).json({
			updatedCategory,
		});
	}
};

//delete 1 or more categories
exports.deleteCategories = async (req, res) => {
	const { ids } = req.body.payload;
	// console.log(ids);
	const deletedCategoriesList = [];
	for (let i = 0; i < ids.length; i++) {
		const deleteCategory = await Category.findOneAndDelete({
			_id: ids[i]._id,
		});
		deletedCategoriesList.push(deleteCategory);
	}
	if (deletedCategoriesList.length === ids.length) {
		res.status(200).json({ message: "Categories removed successfully" });
	} else {
		res.status(400).json({ message: "Something went wrong...!" });
	}
};
