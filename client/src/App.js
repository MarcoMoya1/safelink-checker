import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkUrlSafety = async () => {
    if (!url) return;

    setLoading(true);
    setError("");
    setStatus("");
    setReasons([]);

    try {
      const response = await axios.post("http://localhost:5000/check", {
        url,
      });

      setStatus(response.data.risk);
      setReasons(response.data.reasons);
    } catch (err) {
      setError("Unable to check URL. Server may be down.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>SafeLink Checker 🔐</h1>

      <input
        type="text"
        placeholder="Paste a URL or scan a QR code"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button onClick={checkUrlSafety} disabled={loading}>
        {loading ? "Checking..." : "Check Link"}
      </button>

      {error && <p className="error">{error}</p>}

      {status && (
        <div className={`status-box ${status.toLowerCase()}`}>
          <h3>Status: {status}</h3>

          {reasons.length > 0 && (
            <>
              <h4>Why?</h4>
              <ul>
                {reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
