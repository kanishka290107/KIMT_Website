/**
 * K.I.M.T Computer Classes - Unified Storage Engine
 * Connects to Prisma Postgres backend via REST API with IndexedDB/localStorage fallback.
 */

const DB_NAME = 'KIMT_CertDB';
const DB_VERSION = 1;
const STORE_NAME = 'certificates';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin12345';

// Check if running on backend server with API
async function isApiAvailable() {
    try {
        const res = await fetch('/api/health', { method: 'GET', signal: AbortSignal.timeout(2000) });
        return res.ok;
    } catch (e) {
        return false;
    }
}

// Generate high-resolution digital certificate canvas
function generateCertificateCanvas(studentName, courseName, enrollmentNo, issueDate) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 850;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Borders
    ctx.strokeStyle = '#4338ca'; // Indigo 700
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.strokeStyle = '#e0e7ff'; // Indigo 100
    ctx.lineWidth = 4;
    ctx.strokeRect(46, 46, canvas.width - 92, canvas.height - 92);

    // Corner Ornaments
    const drawCorner = (x, y) => {
        ctx.fillStyle = '#4f46e5';
        ctx.fillRect(x, y, 20, 20);
    };
    drawCorner(30, 30);
    drawCorner(canvas.width - 50, 30);
    drawCorner(30, canvas.height - 50);
    drawCorner(canvas.width - 50, canvas.height - 50);

    // Header Institute Name
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1e1b4b';
    ctx.font = 'bold 36px "Inter", sans-serif';
    ctx.fillText('K.I.M.T COMPUTER CLASSES', canvas.width / 2, 130);

    ctx.fillStyle = '#6366f1';
    ctx.font = '500 16px "Inter", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('INSTITUTE OF INFORMATION TECHNOLOGY & DIGITAL SKILLS', canvas.width / 2, 160);

    // Certificate Title
    ctx.fillStyle = '#312e81';
    ctx.font = 'bold 44px "Georgia", serif';
    ctx.fillText('CERTIFICATE OF EXCELLENCE', canvas.width / 2, 250);

    ctx.fillStyle = '#6b7280';
    ctx.font = 'italic 18px "Inter", sans-serif';
    ctx.fillText('This is proudly presented to', canvas.width / 2, 310);

    // Student Name
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 42px "Georgia", serif';
    ctx.fillText(studentName.toUpperCase(), canvas.width / 2, 380);

    // Underline
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 250, 400);
    ctx.lineTo(canvas.width / 2 + 250, 400);
    ctx.stroke();

    // Body Text
    ctx.fillStyle = '#4b5563';
    ctx.font = '18px "Inter", sans-serif';
    ctx.fillText('for successfully completing the comprehensive professional training program in', canvas.width / 2, 450);

    // Course Name
    ctx.fillStyle = '#4338ca';
    ctx.font = 'bold 30px "Inter", sans-serif';
    ctx.fillText(courseName, canvas.width / 2, 500);

    ctx.fillStyle = '#6b7280';
    ctx.font = '16px "Inter", sans-serif';
    ctx.fillText('with distinguished performance and practical competence.', canvas.width / 2, 540);

    // Footer Info
    ctx.textAlign = 'left';
    ctx.fillStyle = '#374151';
    ctx.font = '600 16px "Inter", sans-serif';
    ctx.fillText(`Enrollment No: ${enrollmentNo}`, 100, 680);
    ctx.font = '400 15px "Inter", sans-serif';
    ctx.fillText(`Issue Date: ${issueDate}`, 100, 710);
    ctx.fillText(`Status: Verified in Prisma Postgres`, 100, 740);

    // Golden Seal
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 700, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OFFICIAL', canvas.width / 2, 695);
    ctx.fillText('SEAL', canvas.width / 2, 712);
    ctx.restore();

    // Authorized Signature
    ctx.textAlign = 'right';
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 18px "Brush Script MT", cursive, sans-serif';
    ctx.fillText('Director / Head of Center', canvas.width - 100, 690);
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width - 300, 710);
    ctx.lineTo(canvas.width - 100, 710);
    ctx.stroke();
    ctx.font = '600 14px "Inter", sans-serif';
    ctx.fillStyle = '#4b5563';
    ctx.fillText('Authorized Signatory - K.I.M.T', canvas.width - 100, 735);

    return canvas.toDataURL('image/jpeg', 0.9);
}

// Local IndexedDB Fallback
function openLocalDB() {
    return new Promise((resolve) => {
        if (!window.indexedDB) {
            resolve(null);
            return;
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'enrollmentNo' });
            }
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = () => resolve(null);
    });
}

const CertificateStore = {
    async getAll() {
        // Try Prisma Postgres API
        try {
            const res = await fetch('/api/certificates', { signal: AbortSignal.timeout(3000) });
            if (res.ok) {
                return await res.json();
            }
        } catch (e) {
            // API not available, proceed to local DB
        }

        // Local IndexedDB fallback
        const db = await openLocalDB();
        if (db) {
            return new Promise((resolve) => {
                const tx = db.transaction(STORE_NAME, 'readonly');
                const store = tx.objectStore(STORE_NAME);
                const req = store.getAll();
                req.onsuccess = () => resolve(req.result || []);
                req.onerror = () => resolve([]);
            });
        }
        return JSON.parse(localStorage.getItem('kimt_certificates') || '[]');
    },

    async getByEnrollment(enrollmentNo) {
        if (!enrollmentNo) return null;
        const cleanCode = encodeURIComponent(enrollmentNo.trim().toUpperCase());

        // Try Prisma Postgres API
        try {
            const res = await fetch(`/api/certificates/${cleanCode}`, { signal: AbortSignal.timeout(3000) });
            if (res.ok) {
                return await res.json();
            }
        } catch (e) {
            // API not available, proceed to local fallback
        }

        // Fallback: check all
        const all = await this.getAll();
        const norm = enrollmentNo.trim().toUpperCase();
        return all.find(c => c.enrollmentNo.trim().toUpperCase() === norm) || null;
    },

    async save(cert) {
        cert.enrollmentNo = cert.enrollmentNo.trim().toUpperCase();

        // 1. Save to Prisma Postgres backend
        let savedToBackend = false;
        try {
            const res = await fetch('/api/certificates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cert),
                signal: AbortSignal.timeout(10000)
            });
            if (res.ok) {
                savedToBackend = true;
            }
        } catch (e) {
            console.warn('API save offline, storing locally:', e);
        }

        // 2. Also mirror to local IndexedDB for instant offline access
        const db = await openLocalDB();
        if (db) {
            await new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const req = store.put(cert);
                req.onsuccess = () => resolve(true);
                req.onerror = (e) => reject(e);
            });
        }

        return true;
    },

    async delete(enrollmentNo) {
        const cleanCode = encodeURIComponent(enrollmentNo.trim().toUpperCase());

        // Delete from Prisma Postgres backend
        try {
            await fetch(`/api/certificates/${cleanCode}`, {
                method: 'DELETE',
                signal: AbortSignal.timeout(5000)
            });
        } catch (e) {
            console.warn('API delete offline, removing locally:', e);
        }

        // Delete from local IndexedDB
        const db = await openLocalDB();
        if (db) {
            await new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const req = store.delete(enrollmentNo.trim().toUpperCase());
                req.onsuccess = () => resolve(true);
                req.onerror = (e) => reject(e);
            });
        }

        return true;
    }
};

const Auth = {
    async login(username, password) {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (res.ok) {
                sessionStorage.setItem('kimt_admin_auth', 'true');
                return true;
            }
        } catch (e) {
            // fallback
        }

        if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
            sessionStorage.setItem('kimt_admin_auth', 'true');
            return true;
        }
        return false;
    },

    isLoggedIn() {
        return sessionStorage.getItem('kimt_admin_auth') === 'true';
    },

    logout() {
        sessionStorage.removeItem('kimt_admin_auth');
        window.location.href = 'login.html';
    },

    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
        }
    }
};
