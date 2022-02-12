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

exports.upload = multer({ storage: multerStorage });
