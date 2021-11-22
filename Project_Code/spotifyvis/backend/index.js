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

app.get("/api/query1", (require, response) => {
  const sqlSelect =
    "SELECT song_name, album_name FROM Song NATURAL JOIN Album WHERE album_id IN (SELECT album_id FROM Album NATURAL JOIN Artist WHERE artist_name LIKE '%Yu-Peng Chen') GROUP BY album_name, song_name;";
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

app.get("/api/getSongs", (require, response) => {
  const sqlSelect = "select * from song;";
  db.query(sqlSelect, (err, result) => {
    response.send(result);
  });
});

app.get("/api/getArtist/:artist_id", (require, response) => {
  const artist_id = require.params.artist_id;
  const sqlSelect = "select artist_name from artist where artist_id= ?;";
  db.query(sqlSelect, artist_id, (err, result) => {
    response.send(result);
    //console.log(result[0]["artist_name"]);
  });
});

app.get("/api/query2", (require, response) => {
  const sqlSelect =
    "SELECT user_id, name FROM User WHERE (user_id = 1) GROUP BY name UNION SELECT user_id, playlist_name FROM Playlist WHERE (user_id = 1) ORDER BY user_id;";
  db.query(sqlSelect, (err, result) => {
    response.send(result);
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
