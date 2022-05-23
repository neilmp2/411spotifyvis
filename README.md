# Spotify Data Visualization

**A course project for CS411 Databases where I handled frontend and backend. The project is essentially a CRUD application, connected to a MySQL database**

## Frontend

Simple website made using ReactJS and MaterialUI for overall styling and components.

Pages/Components for:

- Displaying user playlists
- Adding and editing songs
- Displaying albums
- Adding and deleting albums

These actions are performed via the backend:

## Backend

API requests sent from frontend using Axios. The APIs connect to a local
MySQL database (using MySQL Workbench). Originally the application was configured to use a database made on Google Cloud Platform -- but we eventually ran low on credits, prompting a switch to local.

Here is one of the GET requests. The code essentially sends an SQL query to the database. Here, it returns the number of playlists the user has.

```javascript
app.get("/api/numPlaylist", (require, response) => {
  const sqlSelect = "select count(playlist_id) from playlist;";
  db.query(sqlSelect, (err, result) => {
    response.send(result);
  });
});
```

### SQL

The SQL queries were designed and written as a group, taking into account the type of data we wanted to display. All of the queries are located in the backend folder in index.js.

## Database Design

Six tables: User, Artist, Album, Playlist, Song and Contains.

DDL Commands:

```sql
CREATE TABLE User
(user_id INT NOT NULL,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
PRIMARY KEY(user_id, name));

CREATE TABLE Artist
(artist_id INT NOT NULL,
artist_name VARCHAR(255) NOT NULL UNIQUE,
PRIMARY KEY (artist_id));

CREATE TABLE Album
(album_id INT NOT NULL,
artist_id INT NOT NULL,
album_name VARCHAR(255) NOT NULL,
PRIMARY KEY(album_id),
FOREIGN KEY (artist_id) REFERENCES Artist(artist_id));

CREATE TABLE Playlist
(playlist_id INT NOT NULL,
playlist_name VARCHAR(255),
user_id INT NOT NULL,
PRIMARY KEY(playlist_id),
FOREIGN KEY (user_id) REFERENCES User(user_id));

CREATE TABLE Song
(song_id INT NOT NULL,
song_name VARCHAR(255),
artist_id INT NOT NULL,
artist_name VARCHAR(255) NOT NULL,
album_id INT,
song_tempo INT,
song_valence INT,
song_dance INT,
PRIMARY KEY(song_id),
FOREIGN KEY (artist_id) REFERENCES Artist(artist_id),
FOREIGN KEY (artist_name) REFERENCES Artist(artist_name),
FOREIGN KEY (album_id) REFERENCES Album(album_id));

CREATE TABLE Contains
(playlist_id INT NOT NULL,
song_id INT NOT NULL,
PRIMARY KEY(playlist_id, song_id),
FOREIGN KEY (playlist_id) REFERENCES Playlist(playlist_id),
FOREIGN KEY (song_id) REFERENCES Song(song_id));


```
