const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "neil",
  database: "spovisdemo1",
  multipleStatements: true,
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/get", (require, response) => {
  const sqlSelect = "SELECT * FROM Song";
  db.query(sqlSelect, (err, result) => {
    response.send(result);
  });
});

app.get("/api/numPlaylist", (require, response) => {
  const sqlSelect = "select count(playlist_id) from playlist;";
  db.query(sqlSelect, (err, result) => {
    response.send(result);
  });
});

app.get("/api/getPlaylists", (require, response) => {
  const sqlSelect = "select * from Playlist;";
  db.query(sqlSelect, (err, result) => {
    response.send(result);
  });
});

app.get("/api/getAlbums", (require, response) => {
  const sqlSelect = "select * from Album;";
  db.query(sqlSelect, (err, result) => {
    response.send(result);
  });
});

app.get("/api/getSongs", (require, response) => {
  const sqlSelect = "select * from song;";
  db.query(sqlSelect, (err, result) => {
    response.send(result);
  });
});

app.delete("/api/trigger", (require, response) => {
  console.log("trigger");
  const sqlSelect =
    "DELIMITER $$ \
     CREATE TRIGGER AlbumDel BEFORE DELETE ON album \
     FOR EACH ROW BEGIN IF old.album_id \
     IN (SELECT album_id FROM song) THEN  \
     UPDATE song SET song.album_id = null \
     WHERE song.album_id = old.album_id; \
     END IF; \
     END; \
     $$ DELIMITER ;";
  db.query(sqlSelect, (err, result) => {
    console.log(err);
    response.send(result);
  });
  console.log("trigger done");
});

app.delete("/api/transaction/:albumName", (require, response) => {
  console.log("transaction");
  const albumName = require.params.albumName;
  console.log(albumName);
  const sqlSelect =
    "SET TRANSACTION ISOLATION LEVEL READ COMMITTED; \
    SET FOREIGN_KEY_CHECKS=0; \
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
    COMMIT;";
  db.query(
    sqlSelect,
    [albumName, albumName, albumName, albumName],
    (err, result) => {
      console.log(err);
      response.send(result);
    }
  );
  console.log("transaction done");
});

app.get("/api/getArtist/:artist_id", (require, response) => {
  const artist_id = require.params.artist_id;
  const sqlSelect = "select artist_name from artist where artist_id= ?;";
  db.query(sqlSelect, artist_id, (err, result) => {
    response.send(result);
    //console.log(result[0]["artist_name"]);
  });
});

app.get("/", (require, response) => {
  response.send("Hello!");
});

app.post("/api/insert", (require, response) => {
  const songName = require.body.songName;
  const sqlInsert =
    "INSERT INTO `song` (`song_id`, `song_name`, `artist_id`,`artist_name` , `album_id`, `song_tempo`, `song_valence`, `song_dance`) VALUES (?,?,?,?,?,?,?,?)";
  db.query(
    sqlInsert,
    [
      Math.floor(Math.random() * 100) + 10000,
      songName,
      -1,
      "no artist",
      2,
      0,
      0,
      0,
    ],
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
