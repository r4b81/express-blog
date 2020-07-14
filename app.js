require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const config = require("config");

//import Middleware
const setMiddleware = require("./middleware/middlewares");

//import routes
const setRoutes = require("./routes/routes");

const MongoDB_URI = `mongodb+srv://${config.get("db-username")}:${config.get("db-password")}@cluster0-pnnzp.gcp.mongodb.net/express_blog?retryWrites=true&w=majority`;

const app = express();

if (app.get("env") === "development") {
  app.use(morgan("dev"));
}

//Setup view engine
app.set("view engine", "ejs");
app.set("views", "views");

// Middleware
setMiddleware(app);

// Router
setRoutes(app);
// 404 page
app.use((req, res, next) => {
  let error = new Error("404 not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  if (error.status === 404) {
    return res.render("pages/error/404", { title: "404 Not Found" });
  }
  console.log(error);
  return res.render("pages/error/500", { title: "Internal Error" });
});

const PORT = process.env.PORT || 8080;
mongoose
  .connect(MongoDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    console.log("Database Connected");
    app.listen(PORT, () => {
      console.log(`Server in running on PORT ${PORT}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
