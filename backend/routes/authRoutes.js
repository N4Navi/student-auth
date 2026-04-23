const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  register,
  login,
  updatePassword,
  updateCourse,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.put("/update-password", auth, updatePassword);
router.put("/update-course", auth, updateCourse);

module.exports = router;