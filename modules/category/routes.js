const express = require("express");
const router = express.Router();
const categoryController = require("./controller");

router.get("/list", categoryController.getCategories);

router.get("/add", categoryController.addCategoryForm);
router.post("/add", categoryController.addCategory);

router.get("/update:id", categoryController.updateCategoryForm);
router.post("/update:id", categoryController.updateCategory);

router.get("/delete/:category", categoryController.deleteCategory);

module.exports = router;
