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
  const categories = await Category.find({}).populate(
    "parent_category_id",
    "name"
  );

  categories.sort((a, b) => {
    const parentA = a.parent_category_id?.name || "";
    const parentB = b.parent_category_id?.name || "";
    // if different parents, compare parent names
    if (parentA !== parentB) {
      return parentA.localeCompare(parentB);
    }
    // same parent (or both top-level) → compare category names
    return a.name.localeCompare(b.name);
  });

  return categories;
}

async function getParentCategories() {
  await db.connect();
  const parents = await Category.find({ parent_category_id: null }).sort({
    name: 1,
  });
  return parents;
}

async function addCategory(categoryName, parentCategoryId) {
  await db.connect();
  let category = await Category.findOne({ category: categoryName });
  if (!parentCategoryId) {
    parentCategoryId = null; //Convert empty string to null
  }
  if (!category) {
    let newCategory = new Category({
      name: categoryName,
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
    { name: categoryName },
    { parent_category_id: parentCategoryId }
  );
  let result = await updateCategory.findByIdAndUpdate(categoryId);
  if (result === updateCategory) return true;
  else return false;
}

async function deleteCategory(categoryId) {
  await db.connect();
  await Category.findByIdAndDelete(categoryId);
}

module.exports = {
  getCategories,
  getParentCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
