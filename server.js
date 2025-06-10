// GLOBAL DEFINITIONS

const {adminName} = require('./hash.js'); //admin
const {adminPassword} = require('./hash.js'); //admin123


// PACKAGES

const { error } = require('console');
const express = require('express');
const fs=require('fs');
const sqlite3 = require('sqlite3');
const session = require('express-session');
const app = express();
const connectSqlite3 = require('connect-sqlite3');

const port = 8080;


// BCRYPT
const bcrypt = require('bcrypt');
const saltRounds = 12;

// HANDLEBARS

const { engine } = require('express-handlebars');
const { url } = require('inspector');

app.engine('handlebars', 
  engine({
    helpers: {
      eq (a, b) {return a == b; }
    }
  })
);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// MIDDLEWARE

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// DATABASE

const dbFile = "my-project-data.sqlite3.db";
const db = new sqlite3.Database(dbFile);

const { initTableAuthors } = require(__dirname + '/data/dataAuthors');
const { initTableMovies } = require(__dirname + '/data/dataMovies');

//initTableAuthors(db);
//initTableMovies(db);

// SESSION

const SQLiteStore = connectSqlite3(session);

app.use(session({
  store: new SQLiteStore({db: "session-db.db"}),
  "saveUninitialized": false,
  "resave": false,
  "secret": "SomeSecretKey"
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// ROUTES
app.get('/', function (req, res) {
  const model = {
    isLoggedIn: req.session.isLoggedIn,
    name: req.session.name,
    isAdmin: req.session.isAdmin
  }
  console.log("---> Home model: "+JSON.stringify(model));
  res.render('home.handlebars', model);
});

app.get('/movies', function (req, res) {
  db.all('SELECT * FROM movies', (err, rows) => {
    if (err) {
      console.error("Error loading movies:", err.message);
    } else {
      res.render('movies', {
        movies: rows,

        // provided by copilot ---BEGIN
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
        session: req.session 
        // ---END
      });
    }
  });
});

// code provied by copilot ---BEGIN
app.get('/movies/:movieid', function (req, res) {
  db.get("SELECT * FROM movies WHERE mid=?", [req.params.movieid], (error, theMovie) => {
    if (error) {
      console.log("ERROR: "+error)
      return res.status(500).send("Database error");
    }
    if (!theMovie) {
      return res.status(404).send("Movie not found");
    }
    res.render('movie.handlebars', { 
      movie: theMovie,
    isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
        session: req.session  });
  });
})
// code provided by copilot ---END

app.get('/authors', function (req, res) {
  db.all('SELECT * FROM authors', (err, rows) => {
    if (err) {
      console.error("Error loading authors:", err.message);
    } else {
      res.render('authors', { authors: rows,
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
        session: req.session 
       });
    }
  });
});

app.get('/about', function (req, res) {
    res.render('about.handlebars', {
      isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
        session: req.session 
    });
});

app.get('/contact', function (req, res) {
    res.render('contact.handlebars', {
      isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
        session: req.session 
    });
});

app.get('/login', function (req, res) {
    res.render('login.handlebars', {
      isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin,
        session: req.session 
    });
});

app.get('/logout', function (req,res) {
  req.session.destroy(() => {
    res.redirect('/');
  });
})

app.get('/movie/new', function (req, res) {
  res.render('movie-new.handlebars');
});

// DELETE MOVIE
app.get('/movie/delete/:movieid', function(req, res) {
  console.log('Movie route parameter movieid:', +JSON.stringify(req.params.movieid));
  db.run('DELETE FROM movies WHERE mid = ?', [req.params.movieid], (err, theMovie) => {
    if(err) {
      console.log('ERROR:'+ err)
    } else {
      console.log('The movie '+req.params.movieid+' was deleted');
      res.redirect('/movies');
    }
  })
});

// NEW MOVIE
app.post('/movie/new', function(req,res) {
  const name = req.body.mtitle;
  const year = req.body.myear;
  const type = req.body.mdesc;
  const desc = req.body.mdesc;
  const url  = req.body.murl;
  db.run('INSERT INTO movies (mtitle, myear, mtype, mdesc, murl) VALUES (?, ?, ?, ?, ?)', [name, year, type, desc, url], (error)  => {
    if (error) {
      console.error("ERROR:", error);
      res.redirect('/movies');
    } else {
      console.log('Added!');
      res.redirect('/movies');
    }
  });
})

// MODIFY MOVIE


app.post('/movie/modify/:movieid', function (req, res) {
    const id = req.params.movieid; 

    const title = req.body.mtitle;
    const year = req.body.myear;
    const desc = req.body.mdesc;
    const genre = req.body.mtype;
    const url = req.body.murl;
    
    db.run(`UPDATE movies
            SET mtitle = ?,
                myear = ?,
                mdesc = ?,
                mtype = ?,
                murl = ?
            WHERE mid = ?`, 
            [title, year, desc, genre, url, id], 
            (error) => {
                if (error) {
                    console.log("ERROR: ", error);
                    res.redirect('/movies');
                } else {
                    res.redirect('/movies');
                }
            });
});


app.get('/movie/modify/:movieid', function(req,res) {
   const id = req.params.movieid
   db.get('SELECT * FROM movies WHERE mid = ?', [id], (error, theMovie) => {
    if (error) {
      console.log('ERROR:', error);
      res.redirect('/movies');
    } else {
      model = { movie: theMovie }
      res.render('movie-new.handlebars', model)
    }
   })
})



// LOGIN

//This code was adapted from chatGPT ---BEGIN

app.post('/login', function (req, res) {
    const { username, password } = req.body;
    console.log('BODY:', req.body);

    if (!username || !password) {
        return res.status(400).render('login.handlebars', {
            error: 'Username and password are required',
        });
    }

    if (username === adminName) {
        bcrypt.compare(password, adminPassword, (err, result) => {
            if (err) {
                return res.render('login.handlebars', {
                    error: 'Error checking password',
                });
            }

            if (result) {
                // Store the username in the session
                req.session.isAdmin = true;
                req.session.isLoggedIn = true;
                req.session.name = username;
                console.log("Session information: "+JSON.stringify(req.session));

                message: "Login sucessful!";

                res.redirect("/");
            } else {
                return res.render('login.handlebars', {
                    error: 'Incorrect password',
                });
            }
        });
    } else {
        return res.render('login.handlebars', {
            error: 'Incorrect username',
        });
    }
});

//This code was provided by chatGPT ---END

// 404 ERROR

app.use(function (req,res)  {
  res.status(404).render('404.handlebars');
})

// 500 ERROR

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).render('500');
});

// LISTENING
app.listen(port, function () {
    console.log(`Server is up and running, listening on port ${port}`);
});
