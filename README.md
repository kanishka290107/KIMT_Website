# K.I.M.T Computer Classes - Official Website & Portal

A modern, responsive educational web portal for **K.I.M.T Computer Classes** featuring course showcases, institute facilities, an interactive admin certificate issuance system, and an online certificate verification portal for students and employers.

---

## 🌟 Key Features

1. **Modern Responsive Homepage (`index.html`)**
   - High-impact Hero section with digital tech branding.
   - Comprehensive course directory (Basic Computer, C++, Java, Python, AI & Prompt Engineering, 3D Animation, Web Development with AI, CCC).
   - Facility highlights (Modern Computer Labs, Expert Faculty, Career Guidance).
   - Interactive enrollment and callback inquiry form.

2. **Admin Portal (`login.html` & `admin.html`)**
   - Secure login system for institute administrators.
   - **Default Credentials:**
     - **Username:** `admin`
     - **Password:** `admin12345`
   - **Certificate Management:**
     - Upload student certificates with Student Name, Contact Phone, Enrollment Number, Course, and Date.
     - Live certificate image preview with drag & drop upload.
     - Built-in **"Auto-Generate Official Certificate"** tool to generate digital certificates with an official seal directly in-browser.
     - Full directory with instant search, view, download, and delete functions.

3. **Student Certificate Verification Portal (`verify.html`)**
   - Instant verification by Enrollment Number (e.g. `KIMT-2026-001`).
   - Displays official verification status, student information, and course completion details.
   - High-resolution certificate viewer with **Download**, **Print**, and **Share Link** capabilities.
   - Direct link support via query parameters: `verify.html?enroll=KIMT-2026-001`.

---

## 🚀 How to Run Locally

You can run the website using Python's built-in HTTP server:

```bash
# In the project directory:
python -m http.server 8080
```

Then visit:
- **Homepage:** `http://localhost:8080/index.html`
- **Verify Certificate:** `http://localhost:8080/verify.html`
- **Admin Login:** `http://localhost:8080/login.html`

---

## 📁 File Structure

```text
├── index.html       # Main landing page
├── login.html       # Admin login page
├── admin.html       # Admin dashboard & certificate manager
├── verify.html      # Public certificate verification portal
├── db.js            # Storage engine (IndexedDB + localStorage)
└── README.md        # Documentation
```

---

## 🔒 Security & Data Storage

Certificate data and photos are stored locally using client-side **IndexedDB** with **localStorage** fallback, ensuring high performance, zero external database setup, and offline capability.
