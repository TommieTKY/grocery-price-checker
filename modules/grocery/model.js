const mongoose = require("mongoose");

const db = require("../../db"); //shared db stuff

//set up Schema and model
const GrocerySchema = new mongoose.Schema({
  store: String,
  price: Number,
  unit: Number,
  price_per_unit: Number,
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
});
const Grocery = mongoose.model("Grocery", GrocerySchema);

//MONGODB FUNCTIONS
async function getGroceries() {
  await db.connect();
  const groceries = await Grocery.find({}).populate("category_id", "name");

  groceries.sort((a, b) => {
    const catA = a.category_id?.name || "";
    const catB = b.category_id?.name || "";
    if (catA !== catB) {
      return catA.localeCompare(catB);
    }
    return a.price_per_unit - b.price_per_unit;
  });
  return groceries;
}

async function addGrocery(store, price, unit, price_per_unit, category_id) {
  await db.connect();
  let newGrocery = new Grocery({
    store: store,
    price: price,
    unit: unit,
    price_per_unit: price_per_unit,
    category_id: category_id,
  });
  let result = await newGrocery.save();
  if (result === newGrocery) return true;
  else return false;
}

async function updateGrocery(
  id,
  store,
  price,
  unit,
  price_per_unit,
  category_id
) {
  await db.connect();
  let updateGrocery = await Grocery.updateOne({
    store: store,
    price: price,
    unit: unit,
    price_per_unit: price_per_unit,
    category_id: category_id,
  });
  let result = await updateGrocery.findByIdAndUpdate(id);
  if (result === updateGrocery) return true;
  else return false;
}

async function deleteGrocery(id) {
  await db.connect();
  console.log("Model Deleting Grocery:", id);
  await Grocery.findByIdAndDelete(id);
}

module.exports = {
  getGroceries,
  addGrocery,
  updateGrocery,
  deleteGrocery,
};
