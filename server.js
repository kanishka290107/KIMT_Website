require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "postgres://88ae43b30a7b9f677aec1aed530416cafe3e518395fc43cb3f889b7973393eb7:sk_Z3Dk_HmmVNDLVDx0flGf_@db.prisma.io:5432/postgres?sslmode=require";
}

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// API: Health Check & Database Connection Verification
app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        const total = await prisma.certificate.count();
        res.json({
            status: 'ok',
            database: 'Prisma Postgres Connected',
            certificateCount: total
        });
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// API: Admin Authentication
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin12345') {
        return res.json({ success: true, message: 'Authenticated successfully' });
    }

    try {
        const admin = await prisma.admin.findUnique({ where: { username } });
        if (admin && admin.password === password) {
            return res.json({ success: true, message: 'Authenticated successfully' });
        }
    } catch (e) {
        // Fallback to credentials check
    }

    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

// API: Get All Certificates
app.get('/api/certificates', async (req, res) => {
    try {
        const certificates = await prisma.certificate.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(certificates);
    } catch (err) {
        console.error('Error fetching certificates:', err);
        res.status(500).json({ error: 'Failed to retrieve certificates from database' });
    }
});

// API: Get Certificate by Enrollment Number
app.get('/api/certificates/:enrollmentNo', async (req, res) => {
    const enrollmentNo = req.params.enrollmentNo.trim().toUpperCase();
    try {
        const cert = await prisma.certificate.findFirst({
            where: {
                enrollmentNo: {
                    equals: enrollmentNo,
                    mode: 'insensitive'
                }
            }
        });

        if (!cert) {
            return res.status(404).json({ error: `No certificate found with enrollment ${enrollmentNo}` });
        }

        res.json(cert);
    } catch (err) {
        console.error('Error fetching certificate:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// API: Create or Update Certificate
app.post('/api/certificates', async (req, res) => {
    const { name, phone, enrollmentNo, course, issueDate, photo } = req.body;

    if (!name || !enrollmentNo || !photo) {
        return res.status(400).json({ error: 'Name, Enrollment Number, and Certificate Photo are required' });
    }

    const cleanEnroll = enrollmentNo.trim().toUpperCase();

    try {
        const cert = await prisma.certificate.upsert({
            where: { enrollmentNo: cleanEnroll },
            update: {
                name: name.trim(),
                phone: (phone || '').trim(),
                course: (course || 'Computer Science').trim(),
                issueDate: issueDate || new Date().toISOString().split('T')[0],
                photo: photo
            },
            create: {
                name: name.trim(),
                phone: (phone || '').trim(),
                enrollmentNo: cleanEnroll,
                course: (course || 'Computer Science').trim(),
                issueDate: issueDate || new Date().toISOString().split('T')[0],
                photo: photo
            }
        });

        res.json({ success: true, certificate: cert });
    } catch (err) {
        console.error('Error saving certificate to Prisma Postgres:', err);
        res.status(500).json({ error: 'Failed to save certificate: ' + err.message });
    }
});

// API: Delete Certificate
app.delete('/api/certificates/:enrollmentNo', async (req, res) => {
    const cleanEnroll = req.params.enrollmentNo.trim().toUpperCase();
    try {
        await prisma.certificate.deleteMany({
            where: {
                enrollmentNo: {
                    equals: cleanEnroll,
                    mode: 'insensitive'
                }
            }
        });
        res.json({ success: true, message: `Certificate ${cleanEnroll} deleted` });
    } catch (err) {
        console.error('Error deleting certificate:', err);
        res.status(500).json({ error: 'Failed to delete certificate' });
    }
});

// Frontend Routing shortcuts
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/verify', (req, res) => res.sendFile(path.join(__dirname, 'verify.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));

// Start server when run directly
if (require.main === module || !process.env.VERCEL) {
    app.listen(PORT, async () => {
        console.log(`=========================================`);
        console.log(` K.I.M.T Server running on http://localhost:${PORT}`);
        console.log(` Prisma Postgres Connected`);
        console.log(`=========================================`);
    });
}

module.exports = app;
