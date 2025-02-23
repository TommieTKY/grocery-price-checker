const categoryModel = require("./model");

const getCategories = async (request, response) => {
  let categoryList = await categoryModel.getCategories();
  response.render("admin/category/list", { categories: categoryList });
};

const addCategory = async (request, response) => {
  await db.addCategory("beef", "67b4debafcddcdab7fea543f");
  response.render("admin/category/list");
};

const updateCategory = async (request, response) => {
  await db.updateCategory("beefs", "67b4debafcddcdab7fea543f");
  response.render("admin/category/list");
};

const deleteCategory = async (request, response) => {
  await db.deleteCategory("beef");
  response.render("admin/category/list");
};

module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
