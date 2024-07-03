const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3307;

app.use(cors());
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'zaq1xsw2cde3vfr4bgt5nhy6mju7ki8lo9p0', // Replace with your MySQL password
  database: 'dental', // Replace with your database name
});

// Connect to MySQL
db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});

// API endpoint to handle patient signup
app.post('/patientsignup', (req, res) => {
  const { name, email, password, contactNo, age, gender } = req.body;

  const query = `INSERT INTO patient_details (name, email, password, contactno, age, gender) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [name, email, password, contactNo, age, gender], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ success: false, message: 'Error registering patient' });
      return;
    }
    res.status(200).send({ success: true, message: 'Patient registered successfully' });
  });
});

// API endpoint to handle doctor signup
app.post('/doctorsignup', (req, res) => {
  const { name, email, password, contactNo, specialization, experience } = req.body;

  const query = `INSERT INTO doctor_details (name, email, password, contactno, specialization, experience) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [name, email, password, contactNo, specialization, experience], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ success: false, message: 'Error registering doctor' });
      return;
    }
    res.status(200).send({ success: true, message: 'Doctor registered successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
