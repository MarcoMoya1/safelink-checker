# 🔐 SafeLink QR Scanner

SafeLink QR Scanner is a web application that scans QR codes and analyzes the embedded URLs for potential security risks before allowing users to visit them. The goal of this project is to help prevent phishing, malware, and scam links commonly hidden inside QR codes.

---

## 🚀 Project Purpose

QR codes are convenient—but they can also be dangerous. Many scams rely on users blindly scanning codes that lead to malicious websites.

This project aims to:

- Allow users to safely scan QR codes  
- Extract and analyze the URL inside  
- Check the link against security APIs  
- Warn users before they open unsafe websites  

---

## 🛠 Tech Stack

### Frontend
- React  
- JavaScript  
- Axios  
- react-qr-reader  
- HTML / CSS  

### Backend
- Node.js  
- Express  
- Axios  
- CORS  
- Dotenv  

---

## ✨ Features

- 📷 Scan QR codes using webcam or mobile camera  
- 🔍 Extract URLs from scanned codes  
- 🔐 Analyze URLs for safety risks  
- ⚠ Display security status:
  - 🟢 **Safe**
  - 🟡 **Suspicious**
  - 🔴 **Dangerous**
- ❌ Does not automatically open links  
- Simple and user-friendly interface  

---

## 📁 Project Structure

