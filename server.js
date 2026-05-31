const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');

// 1️⃣ مسار الصفحة الرئيسية أولاً لزيادة عداد الزيارات
app.get('/', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        let fileData = { visitCount: 0 };
        if (!err) {
            try { fileData = JSON.parse(data); } catch (e) {}
        }
        fileData.visitCount = (fileData.visitCount || 0) + 1;
        fs.writeFile(DATA_FILE, JSON.stringify(fileData, null, 2), (writeErr) => {
            if (writeErr) console.log("Error updating visit count");
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });
    });
});

// 2️⃣ الملفات الثابتة
app.use(express.static(path.join(__dirname, 'public')));

// صفحة الأدمن
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// جلب البيانات
app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.json({ customerCount: 0, visitCount: 0, pharmacyStatus: 'closed' });
        try {
            res.json(JSON.parse(data));
        } catch(e) {
            res.json({ customerCount: 0, visitCount: 0, pharmacyStatus: 'closed' });
        }
    });
});

// تحديث البيانات مع حماية بكلمة مرور
const ADMIN_PASSWORD = "25328";

app.post('/api/data', (req, res) => {
    const { password, newData } = req.body;

    if (password !== ADMIN_PASSWORD) {
        return res.json({ success: false, message: 'كلمة المرور غلط!' });
    }

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        let currentData = {};
        if (!err) {
            try { currentData = JSON.parse(data); } catch(e) {}
        }

        const updatedData = {
            ...newData,
            visitCount: currentData.visitCount || 0 // الحفاظ على عدد الزيارات
        };

        fs.writeFile(DATA_FILE, JSON.stringify(updatedData, null, 2), (err) => {
            if (err) return res.json({ success: false, message: 'خطأ في حفظ البيانات' });
            res.json({ success: true });
        });
    });
});

// API سريع لتغيير الحالة فقط (اختياري - للمستقبل)
app.post('/api/status', (req, res) => {
    const { password, status } = req.body;

    if (password !== ADMIN_PASSWORD) {
        return res.json({ success: false, message: 'كلمة المرور غلط!' });
    }
    if (!['open', 'closed'].includes(status)) {
        return res.json({ success: false, message: 'حالة غير صحيحة' });
    }

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        let currentData = {};
        if (!err) {
            try { currentData = JSON.parse(data); } catch(e) {}
        }
        currentData.pharmacyStatus = status;
        fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), (writeErr) => {
            if (writeErr) return res.json({ success: false, message: 'خطأ في الحفظ' });
            res.json({ success: true, pharmacyStatus: status });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});