const express = require("express");
const router = express.Router();
const { initialDataRequest } = require("../../controllers/admin/initialData");

router.get("/initialdata", initialDataRequest);

module.exports = router;
