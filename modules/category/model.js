const mongoose = require("mongoose");

const db = require("../../db"); //shared db stuff

//set up Schema and model
const CategorySchema = new mongoose.Schema({
  category: String,
  parent_category_id: String,
});
const Category = mongoose.model("Category", CategorySchema);

//MONGODB FUNCTIONS
async function getCategories() {
  await db.connect();
  return await Category.find({});
}

async function addCategory(categoryName, parentCategoryId) {
  await db.connect();
  let newCategory = new Category({
    category: categoryName,
    parent_category_id: parentCategoryId,
  });
  let result = await newCategory.save(); //save to the DB collection
  console.log(result);
}

async function updateCategory(categoryName, parentCategoryId) {
  await db.connect();
  let result = await Pet.updateOne(
    { category: categoryName },
    { parent_category_id: parentCategoryId }
  );
}

async function deleteCategory(categoryName) {
  await db.connect();
  let result = await Pet.deleteOne({ category: categoryName });
}

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
