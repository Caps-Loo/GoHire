const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const { authenticateUser } = require("./middleware/auth");
const path = require("path"); // Import path module
const app = express();
const jobRoutes = require("./routes/jobRoutes");

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Atau gunakan '*' untuk semua origin (tidak disarankan untuk production)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/applications", authenticateUser, applicationRoutes);
app.use("/api/jobs", jobRoutes);

// Menyajikan file statis dari direktori "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route untuk mengunduh PDF
app.get('/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'uploads', fileName);
  res.download(filePath); // Untuk mengunduh file PDF
});

app.get("/", (req, res) => {
  res.send("Backend sudah berjalan!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));