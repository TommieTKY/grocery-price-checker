const express = require("express");
const session = require("express-session");
const path = require("path"); //needed when setting up static/file paths
const dotenv = require("dotenv");
const cors = require("cors");

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
app.use(cors());

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
  if (request.session.loggedIn) {
    response.render("index", {
      username: request.session.user,
      loggedIn: true,
    });
  } else {
    response.redirect("/user/login");
  }
});

//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
