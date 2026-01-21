const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SafeLink Scanner API Running");
});

app.post("/check-url", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  // Placeholder logic for now
  res.json({
    url,
    status: "unchecked"
  });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
