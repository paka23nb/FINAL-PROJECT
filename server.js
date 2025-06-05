const express = require('express');
const fs=require('fs');
const sqlite3 = require('sqlite3');

const port = 8080;

const app = express();

app.use(express.static(__dirname + '/public'));

const dbFile = 'my-project-data.sqlite3.db';
const db = new sqlite3.Database(dbFile);

db.run(`
  CREATE TABLE Person (
    pid INTEGER PRIMARY KEY,
    fname TEXT NOT NULL,
    lname TEXT NOT NULL,
    age INTEGER,
    email TEXT
  )
`, (error) => {
  if (error) {
    console.log("---> ERROR:", error);
  } else {
    console.log("---> Table created!");

    db.run(`
      INSERT INTO Person (fname, lname, age, email)
      VALUES 
        ('John', 'Smith', 25, 'john.smith@example.com'),
        ('Jane', 'Doe', 30, 'jane.doe@mail.com'),
        ('Alex', 'Johnson', 40, 'alex.johnson@company.com'),
        ('Emily', 'Brown', 35, 'emily.brown@business.org'),
        ('Michael', 'Davis', 50, 'michael.davis@email.net'),
        ('Sarah', 'Miller', 28, 'sarah.miller@example.com'),
        ('David', 'Garcia', 45, 'david.garcia@mail.com'),
        ('Laura', 'Rodriguez', 32, 'laura.rodriguez@company.com'),
        ('Chris', 'Wilson', 27, 'chris.wilson@business.org'),
        ('Anna', 'Martinez', 22, 'anna.martinez@email.net'),
        ('James', 'Taylor', 53, 'james.taylor@example.com'),
        ('Patricia', 'Anderson', 44, 'patricia.anderson@mail.com'),
        ('Robert', 'Thomas', 38, 'robert.thomas@company.com'),
        ('Linda', 'Hernandez', 55, 'linda.hernandez@business.org'),
        ('William', 'Moore', 26, 'william.moore@email.net'),
        ('Barbara', 'Jackson', 37, 'barbara.jackson@example.com'),
        ('Richard', 'White', 49, 'richard.white@mail.com'),
        ('Susan', 'Lee', 24, 'susan.lee@company.com'),
        ('Joseph', 'Clark', 41, 'joseph.clark@business.org'),
        ('Jessica', 'Walker', 29, 'jessica.walker@email.net')
    `, (err) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log('---> Rows inserted in the table Person.');
      }
    });
  }
})

// PAGES

app.get('/', function (req, res) {
    //res.sendFile(__dirname + '/views/layouts/main.handlebars');
    res.render('home.handlebars')
});

app.listen(port, function () {
    console.log(`Server is up and running, listening on port ${port}`);
});

app.get('/rawpersons', function (req, res) {
    db.all('SELECT * FROM Person', [], (err, rawPersons) => {
        if (err) {
            console.log('Error: ' +err);
        } else {
            console.log('Data retrieved successfully');
            res.send(rawPersons)
        }
    });
});

app.get('/listpersons', function (req, res) {
    db.all('SELECT * FROM Person', function (err, rawPersons) {
        if (err) {
            console.log('Error: ' + err);
        } else {
            listPersonsHTML = '<ul>';
            rawPersons.forEach( function (onePerson) {
                // Code provided by the copilot
                listPersonsHTML += `<li>${onePerson.fname} ${onePerson.lname}, Age: ${onePerson.age}, Email: ${onePerson.email}</li>`;
            })
            listPersonsHTML += '</ul>';
            res.send(listPersonsHTML);
        } 
    });
});    

app.get('/movies', function (req, res) {
    res.render('movies.handlebars');
});

// HANDLEBARS
const { engine } = require('express-handlebars');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
