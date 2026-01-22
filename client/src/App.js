import React, { useState } from "react";
import axios from "axios";
import { Scanner } from "@yudiel/react-qr-scanner";
import "./App.css";

function App() {
  const [mode, setMode] = useState("camera"); // "camera" | "manual"
  const [manualUrl, setManualUrl] = useState("");

  const [scannedUrl, setScannedUrl] = useState("");
  const [risk, setRisk] = useState("");
  const [score, setScore] = useState(0);
  const [reasons, setReasons] = useState([]);
  const [error, setError] = useState("");

  const handleScan = async (url) => {
    if (!url || scannedUrl) return;

    setScannedUrl(url);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/check-url",
        { url }
      );

      setRisk(response.data.risk);
      setScore(response.data.score);
      setReasons(response.data.reasons);
    } catch (err) {
      setError("Unable to reach server.");
    }
  };

  const resetScanner = () => {
    setScannedUrl("");
    setManualUrl("");
    setMode("camera");
    setRisk("");
    setScore(0);
    setReasons([]);
    setError("");
  };

  return (
    <div className="App">
      <h1>🔍 SafeLink QR Scanner</h1>
      <p>Scan a QR code or paste a link to check if it is safe.</p>

      {/* Mode Toggle Buttons */}
      {!scannedUrl && (
        <div className="controls">
          <button onClick={() => setMode("camera")}>Use Camera</button>
          <button onClick={() => setMode("manual")}>Paste URL</button>
        </div>
      )}

      {/* Camera Mode */}
      {!scannedUrl && mode === "camera" && (
        <Scanner
          onScan={(result) => {
            if (result?.rawValue) {
              handleScan(result.rawValue);
            }
          }}
          onError={(err) => console.error(err)}
          constraints={{ facingMode: "environment" }}
          style={{ width: "100%" }}
        />
      )}

      {/* Manual URL Mode */}
      {!scannedUrl && mode === "manual" && (
        <div className="manual-input">
          <input
            type="text"
            placeholder="Paste a URL here"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
          />
          <button onClick={() => handleScan(manualUrl)}>
            Check Link
          </button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Results */}
      {scannedUrl && (
        <div className="result">
          <h3>Scanned URL</h3>
          <p style={{ wordBreak: "break-all" }}>{scannedUrl}</p>

          <h3>
            Risk Level:{" "}
            <span
              style={{
                color:
                  risk === "SAFE"
                    ? "green"
                    : risk === "SUSPICIOUS"
                    ? "orange"
                    : "red",
              }}
            >
              {risk}
            </span>
          </h3>

          <p>
            <strong>Risk Score:</strong> {score} / 100
          </p>

          <ul>
            {reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>

          <button onClick={resetScanner}>Scan Another</button>
        </div>
      )}
    </div>
  );
}

export default App;
