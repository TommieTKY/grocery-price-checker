const express = require("express");
const router = express.Router();
const categoryController = require("./controller");

router.get("/list", categoryController.getCategories);

router.get("/add", categoryController.addCategoryForm);
router.post("/add", categoryController.addCategory);

router.get("/update:id", categoryController.updateCategoryForm);
router.post("/update:id", categoryController.updateCategory);

router.get("/delete/:category", categoryController.deleteCategory);

// http://localhost:8888/admin/category/api
router.get("/api", categoryController.getCategoriesAPI);

module.exports = router;
