const express = require("express");
const cors = require("cors");
const { analyzeUrl } = require("./services/urlAnalyzer");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check (optional but professional)
app.get("/", (req, res) => {
  res.send("SafeLink API is running");
});

// Main URL check endpoint
app.post("/check-url", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      risk: "DANGEROUS",
      score: 100,
      reasons: ["No URL provided"],
    });
  }

  const analysis = analyzeUrl(url);
  res.json(analysis);
});

// Server start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 SafeLink server running on http://localhost:${PORT}`);
});
