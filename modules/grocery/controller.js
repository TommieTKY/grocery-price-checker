const groceryModel = require("./model");
const categoryModel = require("../category/model");

const getGroceries = async (request, response) => {
  let groceryList = await groceryModel.getGroceries();
  if (request.session.loggedIn) {
    response.render("admin/grocery/list", {
      groceries: groceryList,
      loggedIn: true,
    });
  } else {
    response.redirect("/user/login");
  }
};

const addGroceryForm = async (request, response) => {
  if (request.session.loggedIn) {
    const categoryList = await categoryModel.getCategories();
    response.render("admin/grocery/add", {
      loggedIn: true,
      categoryList,
    });
  } else {
    response.redirect("/user/login");
  }
};

const addGrocery = async (request, response) => {
  await groceryModel.addGrocery(
    request.body.store,
    request.body.description,
    request.body.price,
    request.body.unit,
    request.body.price_per_unit,
    request.body.category_id
  );
  response.redirect("/admin/grocery/list");
};

const updateGroceryForm = async (request, response) => {
  if (request.session.loggedIn) {
    const groceryId = request.params.id;
    const grocery = await groceryModel.getGroceryById(groceryId);
    if (!grocery) {
      return response.status(404).send("Grocery not found");
    }

    const categoryList = await categoryModel.getCategories();

    response.render("admin/grocery/update", {
      loggedIn: true,
      grocery,
      categoryList,
    });
  } else {
    response.redirect("/user/login");
  }
};

const updateGrocery = async (request, response) => {
  await groceryModel.updateGrocery(
    request.params.id,
    request.body.store,
    request.body.description,
    request.body.price,
    request.body.unit,
    request.body.price_per_unit,
    request.body.category_id
  );
  response.redirect("/admin/grocery/list");
};

const deleteGrocery = async (request, response) => {
  try {
    await groceryModel.deleteGrocery(request.params.id);
    response.redirect("/admin/grocery/list");
  } catch (error) {
    console.error("Error deleting Grocery:", error);
    response.status(500).send("Error deleting Grocery");
  }
};

const getGroceriesAPI = async (request, response) => {
  let groceryList = await groceryModel.getGroceries();
  response.json(groceryList);
};

module.exports = {
  getGroceries,
  addGroceryForm,
  addGrocery,
  updateGroceryForm,
  updateGrocery,
  deleteGrocery,
  getGroceriesAPI,
};
