const authRoutes = require("./authRoute");
const dashboradRoute = require("./dashboardRoute");
const playgroundRoute = require("../playground/play");
const uploadRoute = require("./uploadRoute");
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
    path: "/play",
    handler: playgroundRoute,
  },
  {
    path: "/",
    handler: (req, res) => {
      res.json({
        message: "Root directory",
      });
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
