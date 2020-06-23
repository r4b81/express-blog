const router = require("express").Router();
const upload = require("../middleware/uploadMiddleware");

router.get("/", (req, res) => {
  res.render("playground/play", { title: "file upload Playground" });
});
router.post("/", upload.single("image"), (req, res) => {
  res.render("playground/play", { title: "Validator Playground" });
});

module.exports = router;
