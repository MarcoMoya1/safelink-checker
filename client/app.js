import React, { useState } from "react";
import QrReader from "react-qr-reader";
import axios from "axios";

function App() {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");

  const handleScan = async (data) => {
    if (data) {
      setResult(data);

      const response = await axios.post("http://localhost:4000/check-url", {
        url: data
      });

      setStatus(response.data.status);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>SafeLink QR Scanner</h1>

      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "300px" }}
      />

      <h3>Scanned URL:</h3>
      <p>{result}</p>

      <h3>Status:</h3>
      <p>{status}</p>
    </div>
  );
}

export default App;
