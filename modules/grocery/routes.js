const express = require("express");
const router = express.Router();
const groceryController = require("./controller");

router.get("/list", groceryController.getGroceries);

router.get("/add", groceryController.addGroceryForm);
router.post("/add", groceryController.addGrocery);

router.get("/update:id", groceryController.updateGroceryForm);
router.post("/update:id", groceryController.updateGrocery);

router.get("/delete/:id", groceryController.deleteGrocery);

module.exports = router;
