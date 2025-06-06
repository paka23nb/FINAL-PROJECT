const authors = [
  {
    aid: 1,
    aname: "Christopher Nolan",
    abirth: 1970,
    anation: "British-American",
    aimg: "./img/nolan.jpg"
  },
  {
    aid: 2,
    aname: "Greta Gerwig",
    abirth: 1983,
    anation: "American",
    aimg: "./img/gerwig.jpg"
  },
  {
    aid: 3,
    aname: "Bong Joon-ho",
    abirth: 1969,
    anation: "South Korean",
    aimg: "./img/bong.jpg"
  },
  {
    aid: 4,
    aname: "Steven Spielberg",
    abirth: 1946,
    anation: "American",
    aimg: "./img/spielberg.jpg"
  },
  {
    aid: 5,
    aname: "Quentin Tarantino",
    abirth: 1963,
    anation: "American",
    aimg: "./img/tarantino.jpg"
  }
];

module.exports = authors;

// Adapted from Hannah Janson's code

function initTableAuthors(db) {
	db.run(
		`CREATE TABLE IF NOT EXISTS authors (
			aid INTEGER PRIMARY KEY,
			aname TEXT NOT NULL,
			abirth INTEGER,
			anation TEXT,
			aimg TEXT
		)`,
		(error) => {
			if (error) {
				console.log("Error creating authors table:", error);
			} else {
				console.log("---> authors table created!");

				authors.forEach((author) => {
					db.run(
						`INSERT INTO authors (aid, aname, abirth, anation, aimg)
						VALUES (?, ?, ?, ?, ?)`,
						[
							author.aid,
							author.aname,
							author.abirth,
							author.anation,
							author.aimg
						],
						(err) => {
							if (err) {
								console.log("Insert error (authors):", err);
							} else {
								console.log("---> Author inserted.");
							}
						}
					);
				});
			}
		}
	);
}

module.exports = { initTableAuthors };
