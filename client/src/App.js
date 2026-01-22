import React, { useState } from "react";
import axios from "axios";
import { QrScanner } from "@yudiel/react-qr-scanner";
import "./App.css";

function App() {
  const [scannedUrl, setScannedUrl] = useState("");
  const [status, setStatus] = useState("");
  const [reasons, setReasons] = useState([]);
  const [error, setError] = useState("");

  const handleScan = async (data) => {
    if (!data) return;

    // Prevent re-scanning
    if (scannedUrl) return;

    setScannedUrl(data);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/check-url",
        { url: data }
      );

      setStatus(response.data.risk);
      setReasons(response.data.reasons);
    } catch (err) {
      setError("Failed to scan URL. Server not responding.");
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError("Camera error or permission denied.");
  };

  const resetScanner = () => {
    setScannedUrl("");
    setStatus("");
    setReasons([]);
    setError("");
  };

  return (
    <div className="App">
      <h1>🔍 SafeLink QR Scanner</h1>

      {!scannedUrl && (
        <>
          <p>Scan a QR code to check if a link is safe.</p>

          <QrScanner
  onDecode={handleScan}
  onError={handleError}
  constraints={{ facingMode: "environment" }}
  style={{ width: "100%" }}
/>

        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {scannedUrl && (
        <>
          <h3>Scanned URL</h3>
          <p style={{ wordBreak: "break-all" }}>{scannedUrl}</p>

          <h3>
            Risk Level:{" "}
            <span
              style={{
                color:
                  status === "SAFE"
                    ? "green"
                    : status === "SUSPICIOUS"
                    ? "orange"
                    : "red",
              }}
            >
              {status}
            </span>
          </h3>

          <ul>
            {reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>

          <button onClick={resetScanner}>Scan Another Code</button>
        </>
      )}
    </div>
  );
}

export default App;
