const express = require("express");
const { authenticateUser } = require("../middleware/auth");
const {
  getAllJobs,
  getJobById,
  addJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const router = express.Router();

// Route publik - dapat diakses tanpa login
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Route terproteksi - hanya admin yang login
router.post("/", authenticateUser, addJob);
router.put("/:id", authenticateUser, updateJob);
router.delete("/:id", authenticateUser, deleteJob);

module.exports = router;