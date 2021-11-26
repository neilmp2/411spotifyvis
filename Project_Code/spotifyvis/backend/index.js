const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "My#123def",
  database: "cs411_demo",
});

// db.connect(function(err) {
//     if (err) throw err;
//     var sql = "INSERT INTO `movie_reviews` (`id`,`movieName`, `movieReview`) VALUES (5,'inception', 'good movie');";
//     db.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log(result.affectedRows + " record(s) updated");
//     });
//   });

// app.get('/', (require, response) => {
//     const sqlInsert = "INSERT INTO `movie_reviews` (`movieName`, `movieReview`) VALUES ('Spider2', 'good movie');";
//     db.query(sqlInsert, (err, result) => {
//         response.send("Hello world!!!");
//     })
// })

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/get", (require, response) => {
  const sqlSelect = "SELECT * FROM Song";
  db.query(sqlSelect, (err, result) => {
    response.send(result);
  });
});

app.get("/api/query1", (require, response) => {
  const sqlSelect =
    "SELECT song_name, album_name FROM Song NATURAL JOIN Album WHERE album_id IN (SELECT album_id FROM Album NATURAL JOIN Artist WHERE artist_name LIKE '%Yu-Peng Chen') GROUP BY album_name, song_name;";
  db.query(sqlSelect, (err, result) => {
    response.send(result);
  });
});

app.get("/api/query2", (require, response) => {
  const sqlSelect =
    "SELECT user_id, name FROM User WHERE (user_id = 1) GROUP BY name UNION SELECT user_id, playlist_name FROM Playlist WHERE (user_id = 1) ORDER BY user_id;";
  db.query(sqlSelect, (err, result) => {
    response.send(result);
  });
});

app.get("/api/trigger", (require, response) => {
  const sqlSelect =
    "DROP TRIGGER IF EXISTS AlbumDel; \
    DELIMITER $$ \
    CREATE TRIGGER AlbumDel \
    BEFORE DELETE ON album \
    FOR EACH ROW \
        BEGIN \
        IF old.album_id IN (SELECT album_id FROM song) \
            THEN \
            UPDATE song \
            SET song.album_id = null \
            WHERE song.album_id = old.album_id; \
    END IF; \
    END; \
    $$ \
    DELIMITER ;"
  db.query(sqlSelect, (err, result) => {
    response.send(result);
  });
});

app.get("/api/transaction", (require, response) => {
  const albumName = require.body.albumName;
  const sqlSelect =
    "SET TRANSACTION ISOLATION LEVEL READ COMMITTED; \
    SELECT song_name, album_name \
    FROM Song NATURAL JOIN Album \
    WHERE album_name = ? \
    GROUP BY album_name, song_name \
    ORDER BY album_name; \
    SELECT AVG(song_tempo), AVG(song_valence), AVG(song_dance) \
    FROM Song NATURAL JOIN Album \
    WHERE album_name = ? AND song_tempo IS NOT NULL AND song_valence IS NOT NULL AND song_dance IS NOT NULL \
    GROUP BY album_name, song_name; \
    DELETE FROM album \
    WHERE album_name IN (?); \
    SELECT song_name, album_name \
    FROM Song NATURAL JOIN Album \
    WHERE album_id IN (SELECT album_id \
                       FROM Album NATURAL JOIN Artist \
                       WHERE artist_id IN (SELECT artist_id \
                                           FROM Album \
                                           WHERE album_name = ?)) \
    GROUP BY album_name, song_name \
    ORDER BY album_name; \
    COMMIT;"
  db.query(sqlSelect, 
    [albumName, albumName, albumName, albumName],
    (err, result) => {
    response.send(result);
  });
});

app.delete("/api/delete/:albumName", (require, response) => {
  const albumName = '';
  console.log(albumName);
  const sqlDelete =
    "delete from album WHERE album_id = 2";
  db.query(sqlDelete, albumName, (err, result) => {
    if (err) console.log(err);
  });
});

app.get("/", (require, response) => {
  response.send("Hello!");
});

app.post("/api/insert", (require, response) => {
  const songName = require.body.songName;
  const sqlInsert =
    "INSERT INTO `song` (`song_id`, `song_name`, `artist_id`, `album_id`, `song_tempo`, `song_valence`, `song_dance`) VALUES (?,?,?,?,?,?,?)";
  db.query(
    sqlInsert,
    [Math.floor(Math.random() * 100) + 10000, songName, 1, 2, 0, 0, 0],
    (err, result) => {
      console.log(err);
    }
  );
});

app.delete("/api/delete/:songName", (require, response) => {
  const songName = require.params.songName;
  console.log(songName);
  const sqlDelete =
    "delete from song where song_id in (SELECT sid FROM (SELECT song_id as sid FROM song WHERE song_name=?) as a)";
  db.query(sqlDelete, songName, (err, result) => {
    if (err) console.log(err);
  });
});

app.put("/api/update", (require, response) => {
  const songName = require.body.songName;
  const danceValue = require.body.newDanceVal;

  const sqlUpdate =
    "UPDATE song SET song_dance = ? where song_id in (SELECT sid FROM (SELECT song_id as sid FROM song WHERE song_name= ?) as a);";
  db.query(sqlUpdate, [danceValue, songName], (err, result) => {
    if (err) console.log(err);
  });
});

app.listen(3002, () => {
  console.log("running on port 3002");
});
