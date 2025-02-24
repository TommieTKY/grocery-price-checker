const categoryModel = require("./model");

const getCategories = async (request, response) => {
  let categoryList = await categoryModel.getCategories();
  response.render("admin/category/list", { categories: categoryList });
};

const addCategoryForm = (request, response) => {
  response.render("admin/category/add");
};

const addCategory = async (request, response) => {
  let result = await categoryModel.addCategory(
    request.body.name,
    request.body.parentCategoryId
  );
  if (result) {
    response.redirect("/admin/category/list");
  } else {
    response.render("admin/category/add", {
      err: "Category Name already exists",
    });
  }
};

const updateCategoryForm = (request, response) => {
  response.render("admin/category/update");
};

const updateCategory = async (request, response) => {
  await categoryModel.updateCategory(
    request.params.id,
    request.body.category,
    request.body.parent_category_id
  );
  response.redirect("/admin/category/list");
};

const deleteCategory = async (request, response) => {
  try {
    await categoryModel.deleteCategory(request.params.category);
    response.redirect("/admin/category/list");
  } catch (error) {
    console.error("Error deleting category:", error);
    response.status(500).send("Error deleting category");
  }
};

module.exports = {
  getCategories,
  addCategoryForm,
  addCategory,
  updateCategoryForm,
  updateCategory,
  deleteCategory,
};
