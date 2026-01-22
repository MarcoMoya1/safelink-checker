const { URL } = require("url");

function analyzeUrl(inputUrl) {
  const reasons = [];
  let risk = "SAFE";
  let score = 0;

  let parsedUrl;

  try {
    parsedUrl = new URL(inputUrl);
  } catch {
    return {
      risk: "DANGEROUS",
      score: 100,
      reasons: ["Invalid or malformed URL"],
    };
  }

  // Rule 1: HTTP instead of HTTPS
  if (parsedUrl.protocol === "http:") {
    score += 30;
    reasons.push("Uses insecure HTTP protocol");
  }

  // Rule 2: URL shorteners
  const shorteners = ["bit.ly", "tinyurl.com", "t.co", "goo.gl"];
  if (shorteners.includes(parsedUrl.hostname)) {
    score += 40;
    reasons.push("URL is a shortened link");
  }

  // Rule 3: IP address instead of domain
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(parsedUrl.hostname)) {
    score += 50;
    reasons.push("Uses raw IP address instead of domain");
  }

  // Rule 4: Suspicious keywords
  const suspiciousWords = ["login", "verify", "secure", "account", "update"];
  if (suspiciousWords.some(word => parsedUrl.pathname.includes(word))) {
    score += 20;
    reasons.push("Contains phishing-related keywords");
  }

  // Final risk assessment
  if (score >= 70) risk = "DANGEROUS";
  else if (score >= 30) risk = "SUSPICIOUS";

  return {
    risk,
    score,
    reasons,
  };
}

module.exports = { analyzeUrl };
