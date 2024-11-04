const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const db = new sqlite3.Database('./project.db');

app.get('/Products', (req, res) => {
    let Product_Id = req.query.Product_Id; // รับ AlbumId จาก query parameters
    let Year = req.query.Year; // รับ Title จาก query parameters
    let Name = req.query.Name;
    let Price = req.query.Price;
    let query = 'SELECT * FROM Products WHERE 1=1'; 
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});