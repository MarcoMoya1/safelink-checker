const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SafeLink Scanner API Running");
});

/**
 * Utility helpers
 */
const isIpAddress = (url) => {
  return /^(http(s)?:\/\/)?(\d{1,3}\.){3}\d{1,3}/.test(url);
};

const isShortenedUrl = (url) => {
  const shorteners = [
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "goo.gl",
    "ow.ly",
  ];
  return shorteners.some((service) => url.includes(service));
};

const containsMaliciousKeywords = (url) => {
  const keywords = ["login", "verify", "secure", "update", "account"];
  return keywords.some((word) => url.toLowerCase().includes(word));
};

/**
 * Main check route
 */
app.post("/check-url", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  let risk = "SAFE";
  let reasons = [];

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    risk = "DANGEROUS";
    reasons.push("Invalid or missing protocol");
  }

  if (isIpAddress(url)) {
    risk = "DANGEROUS";
    reasons.push("Uses raw IP address");
  }

  if (containsMaliciousKeywords(url)) {
    risk = "SUSPICIOUS";
    reasons.push("Contains phishing-related keywords");
  }

  if (isShortenedUrl(url)) {
    risk = "SUSPICIOUS";
    reasons.push("Uses URL shortening service");
  }

  res.json({
    url,
    risk,
    reasons,
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
