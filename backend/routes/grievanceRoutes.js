const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createGrievance,
  getGrievances,
  getGrievanceById,
  updateGrievance,
  deleteGrievance,
  searchGrievances,
} = require("../controllers/grievanceController");

// ALL routes protected
router.post("/", auth, createGrievance);
router.get("/", auth, getGrievances);
router.get("/search", auth, searchGrievances);
router.get("/:id", auth, getGrievanceById);
router.put("/:id", auth, updateGrievance);
router.delete("/:id", auth, deleteGrievance);

module.exports = router;