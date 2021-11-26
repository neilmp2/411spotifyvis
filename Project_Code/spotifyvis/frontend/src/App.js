import "./App.css";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import Dashboard from "./Components/Dashboard";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";
import NavigationBar from "./Components/NavigationBar";
import Routeslist from "./Components/routeslist";
import Playlists from "./Playlists";
import Albums from "./Albums";

function App() {
  const [movieName, setMovieName] = useState("");
  const [Review, setReview] = useState("");
  const [songList, setsongList] = useState([]);
  const [newDanceVal, setnewDanceVal] = useState("");
  const [songName, setsongName] = useState("");
  const [query1, setquery1] = useState([]);
  const [query2, setquery2] = useState([]);
  const [show1, setshow1] = useState(1);

  useEffect(() => {
    Axios.get("http://localhost:3002/api/get").then((response) => {
      setsongList(response.data);
    });
  }, []);

  const insertSong = () => {
    Axios.post("http://localhost:3002/api/insert", {
      songName: songName,
    });
  };

  const deleteSong = (songName) => {
    Axios.delete(`http://localhost:3002/api/delete/${songName}`);
  };

  const updateDanceVal = (songName) => {
    Axios.put(`http://localhost:3002/api/update`, {
      songName: songName,
      newDanceVal: newDanceVal,
    });
  };

  useEffect(() => {
    Axios.get("http://localhost:3002/api/query1").then((response) => {
      setquery1(response.data);
    });
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:3002/api/query2").then((response) => {
      setquery2(response.data);
    });
  }, []);

  const revealOne = () => {
    setshow1(0);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="Playlists" element={<Playlists />} />
          <Route path="Albums" element={<Albums />} />
        </Routes>

        {/* <h1> CRUD APPLICATIONS</h1>
        <div className="form">
          <label> Song Name:</label>
          <input
            type="text"
            name="movieName"
            onChange={(e) => {
              setsongName(e.target.value);
            }}
          />
          <button onClick={insertSong}> Insert</button>
          <br />
          <button onSubmit={revealOne}>
            Get All Albums and Songs For Artist
          </button>
          {query1.map((val) => {
            return (
              <div>
                Song: {val.song_name} | Album: {val.album_name}
              </div>
            );
          })}

          <br />
          <button>Get All Playlists for User: Cloud</button>
          {query2.map((val) => {
            return <div>{val.name}</div>;
          })}
          <br />
          <br />
          <h4>Search Songs</h4>
          <input></input>
          <h2>All Songs</h2>
          {songList.map((val) => {
            return (
              <div className="card">
                <h3> Song Name: {val.song_name} </h3>
                <p>Dance Value: {val.song_dance}</p>
                <button
                  onClick={() => {
                    deleteSong(val.song_name);
                  }}
                >
                  {" "}
                  Delete
                </button>
                <input
                  type="number"
                  id="updateDanceInput"
                  onChange={(e) => {
                    setnewDanceVal(e.target.value);
                  }}
                />
                <button
                  onClick={() => {
                    updateDanceVal(val.song_name);
                  }}
                >
                  {" "}
                  Update
                </button>
              </div>
            );
          })}
        </div> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
