// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(() => {
  if (!exists) {
    db.run(
      "CREATE TABLE Books (id INTEGER PRIMARY KEY AUTOINCREMENT, title  TEXT, author_id INTEGER)"
    );
    console.log("New table Books created!");
    db.run(
      "CREATE TABLE Authors (id INTEGER PRIMARY KEY AUTOINCREMENT, first_name  TEXT, last_name TEXT)"
    );
    console.log("New table Authors created!");

    // insert default dreams
  } else {
    console.log('Databases "Books" & "Authors" ready to go!');
    db.each("SELECT * from Books", (err, row) => {
      if (row) {
        //console.log(`record: ${row.title}`);
      }
    });
  }
});



// endpoint to get all the books in the database
app.get("/getAuthors", (request, response) => {
  db.all("SELECT * from Authors", (err, rows) => {
    response.send(JSON.stringify(rows));
  });
});

// endpoint to add a book and author to the database
app.post("/addBookAndAuthor", (request, response) => {
  console.log("request.body:", request.body);
  
  //New Author Entered
  console.log("request.body.authorId", request.body.authorId);
  console.log("request.body.bookTitle,", request.body.bookTitle)
  console.log("request.body.authorFirstName", request.body.authorFirstName);
  console.log("request.body.authorLastName", request.body.authorLastName);

  if (request.body.authorId !== undefined) {
    console.log("EXISTING ENTRY!");
    if (!process.env.DISALLOW_WRITE) {
      db.run(
        `INSERT INTO Books (title, author_id) VALUES (?, ?)`,
        request.body.bookTitle,
        request.body.authorId,
        function(error) {
          if (error) {
            response.send({ message: "error!", error });
          } else {
            let lastId = this.lastID;
            response.send({ message: "success", lastAddedId: lastId });
          }
        }
      );
    }
  } else {
    let authorFirstName = request.body.authorFirstName;
    let authorLastName = request.body.authorLastName;
    let bookTitle = request.body.bookTitle;
    console.log('!');
    db.run(
      `INSERT INTO Authors (first_name, last_name) VALUES (?, ?)`,
      //request.body.authorId,
      authorFirstName,
      authorLastName,
      function(error) {
        if (error) {
          response.send({ message: "error!", error });
        } else {
          let lastId = this.lastID;
          db.run(
            `INSERT INTO Books (title, author_id) VALUES (?, ?)`,
            bookTitle,
            lastId,
            function(error) {
              if (error) {
                response.send({ message: "error!", error });
              } else {
                response.send({ message: "success", lastAddedId: lastId });
              }
            }
          );
        }
      }
    );
  
  } 
});


// helper function that prevents html/css/script malice
const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
