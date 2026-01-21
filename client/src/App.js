import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

function App() {
  const [scannedUrl, setScannedUrl] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (scannedUrl) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        scanner.clear();
        setScannedUrl(decodedText);

        try {
          const response = await axios.post("http://localhost:4000/check-url", {
            url: decodedText,
          });
          setStatus(response.data.status);
        } catch (err) {
          console.error(err);
          setStatus("error");
        }
      },
      (error) => {
        // ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scannedUrl]);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>🔐 SafeLink QR Scanner</h1>

      {!scannedUrl && <div id="reader" style={{ width: "300px", margin: "auto" }} />}

      {scannedUrl && (
        <>
          <h3>Scanned URL</h3>
          <p>{scannedUrl}</p>

          <h3>Status</h3>
          <p>{status}</p>

          <button onClick={() => window.location.reload()}>
            Scan Another Code
          </button>
        </>
      )}
    </div>
  );
}

export default App;
