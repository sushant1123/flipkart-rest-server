const multer = require("multer");
const shortId = require("shortid");
const path = require("path");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(path.dirname(__dirname), "uploads"));
	},
	filename: (req, file, cb) => {
		cb(null, shortId.generate() + "-" + file.originalname);
	},
});

exports.upload = multer({ storage: multerStorage });

const accessKeyId = process.env.ACCESSKEYID;
const secretAccessKey = process.env.SECRETACCESSKEY;

const s3 = new aws.S3({
	accessKeyId,
	secretAccessKey,
});

exports.uploadS3 = multer({
	storage: multerS3({
		s3: s3,
		bucket: "flipkart-app-clone",
		acl: "public-read",
		metadata: function (req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function (req, file, cb) {
			cb(null, shortId.generate() + "-" + file.originalname);
		},
	}),
});
