const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use('/img', express.static('img'));

const db = new sqlite3.Database('./project.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the Project database.');
    }
});

// ดึงข้อมูลสินค้า
app.get('/Products', (req, res) => {
    db.all('SELECT * FROM Products', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// เพิ่มข้อมูลสินค้า
app.post('/Products', (req, res) => {
    const { Name, Year, Price, img } = req.body;
    const query = `INSERT INTO Products (Name, Year, Price, img) VALUES (?, ?, ?, ?)`;
    db.run(query, [Name, Year, Price, img], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, Name, Year, Price, img });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
