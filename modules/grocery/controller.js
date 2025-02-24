const groceryModel = require("./model");

const getGroceries = async (request, response) => {
  let groceryList = await groceryModel.getGroceries();
  response.render("admin/grocery/list", { groceries: groceryList });
};

const addGroceryForm = (request, response) => {
  response.render("admin/grocery/add");
};

const addGrocery = async (request, response) => {
  await groceryModel.addGrocery(
    request.body.store,
    request.body.price,
    request.body.unit,
    request.body.price_per_unit,
    request.body.category
  );
  response.redirect("/admin/grocery/list");
};

const updateGroceryForm = (request, response) => {
  response.render("admin/grocery/update");
};

const updateGrocery = async (request, response) => {
  await groceryModel.updateGrocery(
    request.params.id,
    request.body.store,
    request.body.price,
    request.body.unit,
    request.body.price_per_unit,
    request.body.category
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

module.exports = {
  getGroceries,
  addGroceryForm,
  addGrocery,
  updateGroceryForm,
  updateGrocery,
  deleteGrocery,
};
