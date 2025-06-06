//Code provided by Hannah Janson

const movies = [
  {
    mid: 1,
    aid: 1,
    mtype: "sci-fi",
    mtitle: "Inception",
    mdesc: "A mind-bending thriller about dreams within dreams.",
    myear: 2010,
    murl: "./img/inception.jpg",

  },
  {
    mid: 2,
    aid: 2,
    mtype: "drama",
    mtitle: "Lady Bird",
    mdesc: "A heartfelt coming-of-age story set in Sacramento.",
    myear: 2017,
    murl: "./img/ladybird.jpg",

  },
  {
    mid: 3,
    aid: 3,
    mtype: "thriller",
    mtitle: "Parasite",
    mdesc: "A dark social satire on class and survival.",
    myear: 2019,
    murl: "./img/parasite.jpg",
 
  },
  {
    mid: 4,
    aid: 4,
    mtype: "family/sci-fi",
    mtitle: "E.T.",
    mdesc: "A touching tale of friendship between a boy and an alien.",
    myear: 1982,
    murl: "./img/et.jpg",
   
  },
  {
    mid: 5,
    aid: 5,
    mtype: "crime/drama",
    mtitle: "Pulp Fiction",
    mdesc: "A stylish, nonlinear crime saga filled with iconic scenes.",
    myear: 1994,
    murl: "./img/pulpfiction.jpg",
    
  }
];

module.exports = movies;

// Adapted from Hannah Janson's code

function initTableMovies(db) {
	db.run(
		`CREATE TABLE IF NOT EXISTS movies (
			mid INTEGER PRIMARY KEY,
			aid INTEGER,
			mtype TEXT NOT NULL,
			mtitle TEXT NOT NULL,
			mdesc TEXT,
			myear INTEGER,
			murl TEXT,
			FOREIGN KEY (aid) REFERENCES authors(aid)
		)`,
		(error) => {
			if (error) {
				console.log("Error creating movies table:", error);
			} else {
				console.log("---> movies table created!");

				movies.forEach((movie) => {
					db.run(
						`INSERT INTO movies (mid, aid, mtype, mtitle, mdesc, myear, murl)
						VALUES (?, ?, ?, ?, ?, ?, ?)`,
						[
							movie.mid,
							movie.aid,
							movie.mtype,
							movie.mtitle,
							movie.mdesc,
							movie.myear,
							movie.murl
						],
						(err) => {
							if (err) {
								console.log("Insert error (movies):", err);
							} else {
								console.log("---> Movie inserted.");
							}
						}
					);
				});
			}
		}
	);
}

module.exports = { initTableMovies };

