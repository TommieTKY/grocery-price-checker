const express = require("express");
const router = express.Router();
const categoryController = require("./controller");

router.get("/list", categoryController.getCategories);

router.get("/add", categoryController.addCategory);

router.post("/update", categoryController.updateCategory);

router.get("/delete", categoryController.deleteCategory);

module.exports = router;
