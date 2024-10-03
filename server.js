// import dependencies
const express = require('express')
   const app = express()
   const mysql = require('mysql2');
   const dotenv = require ('dotenv')

   // configure environment variables
   dotenv.config();

  // create a connection object
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })


  // test the connection
  db.connect((err) => {
    // connection is unsuccessful
    if (err) {
        return console.log("Error connecting to the database:", err)
    }

    // connection is successful
    console.log("Successfully connected to MySQL:", db.threadID)
  })


// retrieve all patients
app.get('/patients', (req, res) => {
    const query = `
      SELECT 
        patient_id, 
        first_name, 
        last_name, 
        date_of_birth 
      FROM 
        patients
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving patients:', err);
        res.status(500).send({ message: 'Error retrieving patients' });
      } else {
        res.json(results);
      }
    });
  });

  // Retrieve all providers
  app.get('/providers', (req, res) => {
    const query = `
      SELECT 
        first_name, 
        last_name, 
        provider_specialty 
      FROM 
        providers
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving providers:', err);
        res.status(500).send({ message: 'Error retrieving providers' });
      } else {
        res.json(results);
      }
    });
  });

  //  Filter patients by First Name
  app.get('/patients/:firstName', (req, res) => {
    const firstName = req.params.firstName;
    const query = `
      SELECT 
        patient_id, 
        first_name, 
        last_name, 
        date_of_birth 
      FROM 
        patients 
      WHERE 
        first_name = ?
    `;
    db.query(query, firstName, (err, results) => {
      if (err) {
        console.error('Error retrieving patients:', err);
        res.status(500).send({ message: 'Error retrieving patients' });
      } else {
        res.json(results);
      }
    });
  });

  
  // Retrieve all providers by their specialty
  app.get('/providers/specialty/:specialty', (req, res) => {
    const specialty = req.params.specialty;
    const query = `
      SELECT 
        provider_id,
        first_name,
        last_name,
        provider_specialty
      FROM 
        providers
      WHERE 
        provider_specialty = ?
    `;
    db.query(query, specialty, (err, results) => {
      if (err) {
        console.error('Error retrieving providers:', err);
        res.status(500).send({ message: 'Error retrieving providers' });
      } else {
        res.json(results);
      }
    });
  });


   // start and listen to the server
   app.listen(3306, () => {
    console.log(`server is runnig on port 3306...`)
  })