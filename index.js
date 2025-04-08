const express = require("express");
const session = require("express-session");
const path = require("path"); //needed when setting up static/file paths
const dotenv = require("dotenv");

const cors = require("cors");
app.use(cors());

//load the environment variables from .env
dotenv.config();

const db = require("./db"); //load db.js

//set up the Express app
const app = express();
const port = process.env.PORT || "8888";
// const categoryRouter = require("./routes/category");

//set up application template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//set up folder for static files
app.use(express.static(path.join(__dirname, "public")));

//set up app to use sessions
app.use(
  session({
    secret: process.env.SESSIONSECRET,
    name: "MyUniqueSessID",
    saveUninitialized: false,
    resave: false,
    cookie: {},
  })
);

app.use("/user", require("./modules/user/routes"));
app.use("/admin/category", require("./modules/category/routes"));
app.use("/admin/grocery", require("./modules/grocery/routes"));

//USE PAGE ROUTES FROM ROUTER(S)
app.get("/", async (request, response) => {
  // let groceryData = await db.getGrocery();
  response.render("index");
});

app.get("/admin/admin", (request, response) => {
  response.render("admin/admin");
});

// /api/convert/cmtoin?cm=10
app.get("/api/convert/cmtoin", (request, response) => {
  let cm = request.query.cm;
  let converted = {
    length: cm / 2.54,
  }; //convert cm value to inches
  response.json(converted); //send JSON object with appropriate JSON headers
});

//  expect to receive data { "celsius": 100 }
//  returns: { temperature: <converted_value> }
app.post("/api/convert/ctof", (req, res) => {
  let celsius = req.body.celsius;
  let convert = (celsius * 9) / 5 + 32;
  let fahrenheit = {
    temperature: convert,
  };
  res.json(fahrenheit);
});

//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
