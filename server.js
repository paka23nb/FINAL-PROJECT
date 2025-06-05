const { error } = require('console');
const express = require('express');
const fs=require('fs');
const sqlite3 = require('sqlite3');

const port = 8080;

const app = express();

app.use(express.static(__dirname + '/public'));

// DATABASE

const dbFile = 'my-project-data.sqlite3.db';
const db = new sqlite3.Database(dbFile);

db.run(`
  CREATE TABLE authors (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  birth_year INTEGER,
  nationality TEXT
)
`, (error) => {
  if (error) {
    console.log("---> ERROR:", error);
  } else {
    console.log("---> Table created!");

    db.run(`
      INSERT INTO authors (name, birth_year, nationality) VALUES
        ('Christopher Nolan', 1970, 'British-American'),
        ('Greta Gerwig', 1983, 'American'),
        ('Bong Joon-ho', 1969, 'South Korean'),
        ('Steven Spielberg', 1946, 'American'),
        ('Quentin Tarantino', 1963, 'American')
    `, (err) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log('---> Authors inserted.');
      }
    });
  }
});

db.run(`
  CREATE TABLE movies (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    release_year INTEGER,
    author_id INTEGER,
    FOREIGN KEY (author_id) REFERENCES authors(id)
  )
`, (error) => {
  if (error) {
    console.log("---> ERROR creating movies table:", error.message);
  } else {
    console.log("---> movies table created!");



    db.run(`
      INSERT INTO movies (title, release_year, author_id, genre) VALUES
        ('Inception', 2010, 1, 'Sci-Fi'),
        ('Lady Bird', 2017, 2, 'Drama'),
        ('Parasite', 2019, 3, 'Thriller'),
        ('E.T.', 1982, 4, 'Family'),
        ('Pulp Fiction', 1994, 5, 'Crime')
    `, (err) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log('---> Movies inserted.');
      }
    });
  }
});

// PAGES

app.get('/', function (req, res) {
    //res.sendFile(__dirname + '/views/layouts/main.handlebars');
    res.render('home.handlebars')
});

app.listen(port, function () {
    console.log(`Server is up and running, listening on port ${port}`);
});


app.get('/movies', function (req, res) {
  db.all('SELECT * FROM movies', (err, listOfMovies) => {
    if (err) {
      console.log("ERROR: ", err);
    } else {
      model = { movies: listOfMovies };
      res.render('movies.handlebars', model);
    }
  });
});

app.get('/about', function (req, res) {
    res.render('about.handlebars');
});

app.get('/contact', function (req, res) {
    res.render('contact.handlebars');
});
// HANDLEBARS
const { engine } = require('express-handlebars');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
