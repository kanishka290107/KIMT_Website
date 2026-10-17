# K.I.M.T Computer Classes - Official Portal (Prisma Postgres Backend)

A modern, responsive educational web portal and certificate management system for **K.I.M.T Computer Classes**, powered by **Node.js, Express, and Prisma Postgres**.

---

## 🌟 Key Features

1. **Modern Responsive Homepage (`index.html`)**
   - High-impact Hero section with digital tech branding.
   - Comprehensive course directory (Basic Computer, C++, Java, Python, AI & Prompt Engineering, 3D Animation, Web Development with AI, CCC).
   - Facility highlights (Modern Computer Labs, Expert Faculty, Career Guidance).
   - Interactive enrollment inquiry form.

2. **Admin Portal (`login.html` & `admin.html`)**
   - Secure login system for institute administrators.
   - **Default Credentials:**
     - **Username:** `admin`
     - **Password:** `admin12345`
   - **Prisma Postgres Storage:**
     - Upload student certificates with Student Name, Contact Phone, Enrollment Number, Course, and Date.
     - Live certificate image preview with drag & drop upload.
     - Built-in **"Auto-Generate Official Certificate"** tool to generate digital certificates with an official seal directly in-browser.
     - Full directory with instant search, view, download, and delete functions saved directly to the Postgres database.

3. **Student Certificate Verification Portal (`verify.html`)**
   - Instant real-time verification querying Prisma Postgres by Enrollment Number (e.g. `KIMT-2026-001`).
   - Displays official verification status, student information, and course completion details.
   - High-resolution certificate viewer with **Download**, **Print**, and **Share Link** capabilities.
   - Direct link support via query parameters: `verify.html?enroll=KIMT-2026-001`.

---

## 🗄️ Database Architecture (Prisma Postgres)

- **Provider:** PostgreSQL (`db.prisma.io`)
- **ORM:** Prisma Client

### Prisma Schema (`prisma/schema.prisma`):
```prisma
model Certificate {
  id           String   @id @default(uuid())
  name         String
  phone        String
  enrollmentNo String   @unique
  course       String
  issueDate    String
  photo        String   @db.Text
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([enrollmentNo])
}

model Admin {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

---

## 🚀 Setup & Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database Environment
Create a `.env` file from `.env.example`:
```env
DATABASE_URL="postgres://username:password@db.prisma.io:5432/postgres?sslmode=require"
PORT=8080
```

### 3. Push Database Schema & Seed Data
```bash
npx prisma db push
node prisma/seed.js
```

### 4. Start the Application
```bash
npm start
```

Visit:
- **Homepage:** `http://localhost:8080`
- **Verify Certificate:** `http://localhost:8080/verify.html`
- **Admin Login:** `http://localhost:8080/login.html`
- **Health Check API:** `http://localhost:8080/api/health`

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & Prisma Postgres status |
| `POST` | `/api/login` | Admin authentication |
| `GET` | `/api/certificates` | Retrieve all certificates |
| `GET` | `/api/certificates/:enrollmentNo` | Get certificate by enrollment number |
| `POST` | `/api/certificates` | Create or update certificate in Postgres |
| `DELETE` | `/api/certificates/:enrollmentNo` | Delete certificate by enrollment number |
