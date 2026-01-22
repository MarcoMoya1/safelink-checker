const express = require("express");
const cors = require("cors");
const { URL } = require("url");

const app = express();

app.use(cors());
app.use(express.json());

const scamKeywords = [
  "login",
  "verify",
  "account",
  "update",
  "secure",
  "bank",
  "wallet",
  "free",
  "claim",
];

const shorteners = [
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "ow.ly",
];

function isIpAddress(hostname) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
}

app.post("/check-url", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return res.json({
      risk: "DANGEROUS",
      reasons: ["Invalid URL format"],
    });
  }

  const reasons = [];
  let risk = "SAFE";

  // 🚨 HTTP is dangerous
  if (parsedUrl.protocol === "http:") {
    risk = "DANGEROUS";
    reasons.push("Uses insecure HTTP");
  }

  // 🚨 IP address instead of domain
  if (isIpAddress(parsedUrl.hostname)) {
    risk = "DANGEROUS";
    reasons.push("Uses IP address instead of domain");
  }

  // ⚠️ URL shortener
  if (shorteners.includes(parsedUrl.hostname)) {
    if (risk !== "DANGEROUS") risk = "SUSPICIOUS";
    reasons.push("Uses URL shortener");
  }

  // ⚠️ Suspicious keywords
  scamKeywords.forEach((keyword) => {
    if (parsedUrl.href.toLowerCase().includes(keyword)) {
      if (risk === "SAFE") risk = "SUSPICIOUS";
      reasons.push(`Contains keyword: ${keyword}`);
    }
  });

  // ⚠️ Very long URL
  if (parsedUrl.href.length > 120) {
    if (risk === "SAFE") risk = "SUSPICIOUS";
    reasons.push("URL is unusually long");
  }

  if (reasons.length === 0) {
    reasons.push("No obvious security risks detected");
  }

  res.json({
    url,
    risk,
    reasons,
  });
});

app.get("/", (req, res) => {
  res.send("SafeLink Scanner API Running");
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
