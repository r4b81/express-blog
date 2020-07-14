const authRoutes = require("./authRoute");
const dashboradRoute = require("./dashboardRoute");
const playgroundRoute = require("../playground/play");
const uploadRoute = require("./uploadRoute");
const postRoute = require("./postRoute");
const apiRoutes = require("../api/routes/apiRoute");
const explorerRoute = require("./explorerRoute");
const searchRoute = require('./searchRoute')
const authorRoute = require('./authorRoute')
const routes = [
  {
    path: "/auth",
    handler: authRoutes,
  },
  {
    path: "/dashboard",
    handler: dashboradRoute,
  },
  {
    path: "/uploads",
    handler: uploadRoute,
  },
  {
    path: "/posts",
    handler: postRoute,
  },
  {
    path: "/api",
    handler: apiRoutes,
  },
  {
    path: "/explorer",
    handler: explorerRoute,
  },
  {
    path: '/search',
    handler: searchRoute
  },
  {
    path: '/profile',
    handler: authorRoute
  },
  {
    path: "/play",
    handler: playgroundRoute,
  },
  {
    path: "/",
    handler: (req, res) => {
      res.redirect("/explorer");
    },
  },
];

module.exports = (app) => {
  routes.forEach((r) => {
    if (r.path === "/") {
      app.get(r.path, r.handler);
    } else {
      app.use(r.path, r.handler);
    }
  });
};
