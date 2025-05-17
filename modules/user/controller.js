const userModel = require("./model");

const getUser = async (request, response) => {
  if (request.session.loggedIn) {
    response.render("index", {
      username: request.session.user,
      loggedIn: true,
    });
  } else {
    response.redirect("/user/login");
  }
};

const loginForm = (request, response) => {
  response.render("user/login");
};

const login = async (request, response) => {
  //authenticate user and redirect to /user
  let auth = await userModel.authenticateUser(request.body.u, request.body.pw);
  if (auth) {
    //set session variables
    request.session.loggedIn = true;
    request.session.user = request.body.u;
    response.redirect("/user");
  } else {
    response.render("user/login", { err: "No user match" });
    // extra: check if user exists
  }
  // extra: if the user already login, redirect to /user
};

const logout = (req, res) => {
  req.session.destroy();
  res.clearCookie("MyUniqueSessID", { path: "/" });
  res.redirect("/user/login");
};

const registerForm = (request, response) => {
  response.render("user/register");
};

const register = async (request, response) => {
  let result = await userModel.addUser(request.body.u, request.body.pw);
  if (result) {
    response.redirect("/user/login");
  } else {
    response.render("user/register", { err: "Username already exists" });
  }
};

module.exports = {
  getUser,
  loginForm,
  login,
  logout,
  registerForm,
  register,
};
