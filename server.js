// GLOBAL DEFINITIONS

const adminName = 'admin';
const adminPassword = 'admin123';


// PACKAGES

const { error } = require('console');
const express = require('express');
const fs=require('fs');
const sqlite3 = require('sqlite3');

const port = 8080;

const app = express();

// BCRYPT
const bcrypt = require('bcrypt');

const saltRounds = 12;



bcrypt.hash(adminPassword, saltRounds, function(err, hash) {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Hashed password:", hash);
  }
});



// MIDDLEWARE

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// DATABASE

const dbFile = "my-project-data.sqlite3.db";
const db = new sqlite3.Database(dbFile);

const { initTableAuthors } = require(__dirname + '/data/dataAuthors');
const { initTableMovies } = require(__dirname + '/data/dataMovies');

initTableAuthors(db);
initTableMovies(db);

// ROUTES

app.get('/', function (req, res) {
    res.render('home.handlebars')
});

app.listen(port, function () {
    console.log(`Server is up and running, listening on port ${port}`);
});


app.get('/movies', function (req, res) {
  db.all('SELECT * FROM movies', (err, rows) => {
    if (err) {
      console.error("Error loading movies:", err.message);
    } else {
      res.render('movies', { movies: rows });
    }
  });
});

app.get('/authors', function (req, res) {
  db.all('SELECT * FROM authors', (err, rows) => {
    if (err) {
      console.error("Error loading authors:", err.message);
    } else {
      res.render('authors', { authors: rows });
    }
  });
});

app.get('/about', function (req, res) {
    res.render('about.handlebars');
});

app.get('/contact', function (req, res) {
    res.render('contact.handlebars');
});

app.get('/login', function (req, res) {
    res.render('login.handlebars');
});

// LOGIN

app.post('/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        const model = { error: 'Username and password are required', message: 'Please enter both username and password.' };
        return res.status(400).render('login.handlebars', { model });
    }

    if (username == adminName) {
      console.log('The username is admin!');
      bcrypt.compare(password, adminPassword, (err, result) => {
        if (err) {
          const model = { error: 'Error comparing password' + err, message: 'Please try again later.' };
          res.render('login.handlebars', model);
        }

        if (result) {
          console.log('The password is correct!');
          const model = { error: "", message: 'Login successful!' };
          res.render('login.handlebars', model);
        } else {
          const model = { error: 'Incorrect password', message: 'Try again.' };
          res.status(400).render('login.handlebars', model);
        } 
      });

      /*
      if (password == adminPassword) {
        console.log('The password is correct!');
        const model = { error: "", message: 'Login successful!' };
        res.render('login.handlebars', model);
      } else {
        const model = { error: 'Incorrect password', message: 'Try again.' };
        res.status(400).render('login.handlebars',  model);
      }
      */
    } else {
      const model = { error: 'Incorrect username', message: 'Try again.' };
      res.status(400).render('login.handlebars', model);
    }
});



// HANDLEBARS

const { engine } = require('express-handlebars');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

