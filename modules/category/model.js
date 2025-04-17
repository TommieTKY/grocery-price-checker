const mongoose = require("mongoose");

const db = require("../../db"); //shared db stuff

//set up Schema and model
const CategorySchema = new mongoose.Schema({
  name: String,
  parent_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
});
const Category = mongoose.model("Category", CategorySchema);

//MONGODB FUNCTIONS
async function getCategories() {
  await db.connect();
  return await Category.find({});
}

async function addCategory(categoryName, parentCategoryId) {
  await db.connect();
  let category = await Category.findOne({ category: categoryName });
  if (!parentCategoryId) {
    parentCategoryId = null; //Convert empty string to null
  }
  if (!category) {
    let newCategory = new Category({
      category: categoryName,
      parent_category_id: parentCategoryId,
    });
    let result = await newCategory.save(); //save to the DB collection
    if (result === newCategory) return true;
    else return false;
  } else {
    return false;
  }
}

async function updateCategory(categoryId, categoryName, parentCategoryId) {
  await db.connect();
  let updateCategory = await Category.updateOne(
    { category: categoryName },
    { parent_category_id: parentCategoryId }
  );
  let result = await updateCategory.findByIdAndUpdate(categoryId);
  if (result === updateCategory) return true;
  else return false;
}

async function deleteCategory(name) {
  await db.connect();
  console.log("Model Deleting category:", name);
  await Category.findOneAndDelete({ category: name });
}

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
