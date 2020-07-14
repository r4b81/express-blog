const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const config = require('config')

//import Middleware
const { bindUserWithRequest } = require("./authMiddleware");
const setLocals = require("./setLocals");

const MongoDB_URI = `mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@cluster0-pnnzp.gcp.mongodb.net/express_blog?retryWrites=true&w=majority`;
var store = new MongoDBStore({
  uri: MongoDB_URI,
  collection: "sessions",
});

const middleware = [
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
  session({
    secret: config.get('secret'),
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
    },
    store: store,
  }),
  bindUserWithRequest(),
  setLocals(),
  flash(),
];

module.exports = app => {
  middleware.forEach(m => {
    app.use(m)
  })
}