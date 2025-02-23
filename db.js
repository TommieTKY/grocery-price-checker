const mongoose = require("mongoose");

//const dbUrl = `mongodb://${process.env.DBUSER}:${process.env.DBPWD}@${process.env.DBHOST}/?authSource=testdb`;
const dbUrl = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@${process.env.DBHOST}:${process.env.DBNAME}`;

let Grocery;
// Function to set up the schema and model dynamically
function setGroceryModel() {
  const GrocerySchema = new mongoose.Schema(
    {
      store: String,
      price: Number,
      unit: Number,
      price_per_unit: Number,
    },
    { collection: "egg" }
  );
  Grocery = mongoose.model("Grocery", GrocerySchema);
}

//MONGODB FUNCTIONS
async function connect() {
  await mongoose.connect(dbUrl); //connect to mongodb
}

//Get all pets from the pets collection
async function getGrocery(collectionName) {
  await connect();
  setGroceryModel(collectionName);
  return await Grocery.find({}); //return array for find all
}

module.exports = {
  connect,
  getGrocery,
};
