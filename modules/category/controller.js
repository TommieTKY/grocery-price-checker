const categoryModel = require("./model");

const getCategories = async (request, response) => {
  let categoryList = await categoryModel.getCategories();
  if (request.session.loggedIn) {
    response.render("admin/category/list", {
      categories: categoryList,
      loggedIn: true,
    });
  } else {
    response.redirect("/user/login");
  }
};

const addCategoryForm = async (request, response) => {
  if (request.session.loggedIn) {
    const parents = await categoryModel.getParentCategories();
    response.render("admin/category/add", {
      loggedIn: true,
      parents,
    });
  } else {
    response.redirect("/user/login");
  }
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

const updateCategoryForm = async (request, response) => {
  if (request.session.loggedIn) {
    const categoryId = request.params.id;
    const category = await categoryModel.getCategoryById(categoryId);
    if (!category) {
      return response.status(404).send("Category not found");
    }

    const parents = await categoryModel.getParentCategories();

    response.render("admin/category/update", {
      loggedIn: true,
      category,
      parents,
    });
  } else {
    response.redirect("/user/login");
  }
};

const updateCategory = async (request, response) => {
  await categoryModel.updateCategory(
    request.params.id,
    request.body.name,
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

const getCategoriesAPI = async (request, response) => {
  let categoryList = await categoryModel.getCategories();
  response.json(categoryList);
};

module.exports = {
  getCategories,
  addCategoryForm,
  addCategory,
  updateCategoryForm,
  updateCategory,
  deleteCategory,
  getCategoriesAPI,
};
