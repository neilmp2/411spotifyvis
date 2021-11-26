import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import Axios from "axios";
import { useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import { Divider, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function preventDefault(event) {
  event.preventDefault();
}

export default function SongDisplay() {
  const [allSongs, setallSongs] = React.useState([]);
  const [newDanceVal, setnewDanceVal] = React.useState("");
  const [songName, setsongName] = React.useState(" ");
  const [songArtist, setsongArtist] = React.useState(" ");

  useEffect(() => {
    Axios.get("http://localhost:3002/api/getSongs").then((response) => {
      setallSongs(response.data);
    });
  });

  const deleteSong = (songName) => {
    Axios.delete(`http://localhost:3002/api/delete/${songName}`);
  };

  const insertSong = () => {
    Axios.post("http://localhost:3002/api/insert", {
      songName: songName,
    });
  };

  const deleteIcon = (songName) => {
    return (
      <IconButton>
        <DeleteIcon
          color="primary"
          fontSize="medium"
          onClick={() => {
            deleteSong(songName);
          }}
        />
      </IconButton>
    );
  };

  const setArtist = (name) => {
    return name;
  };

  const getArtist = (artist_id) => {
    Axios.get(`http://localhost:3002/api/getArtist/${artist_id}`).then(
      (response) => {
        setArtist(response.data[0]["artist_name"]);
      }
    );
  };

  const updateDanceVal = (songName) => {
    Axios.put(`http://localhost:3002/api/update`, {
      songName: songName,
      newDanceVal: newDanceVal,
    });
  };

  return (
    <React.Fragment>
      <Title>All Songs</Title>
      <Box>
        <TextField
          required
          size="small"
          label="Song Name"
          onChange={(e) => {
            setsongName(e.target.value);
          }}
        />{" "}
        <TextField
          disabled
          size="small"
          label="Artist Name"
          onChange={(e) => {
            setsongArtist(e.target.value);
          }}
        />{" "}
        <Button
          variant="outlined"
          onClick={() => {
            insertSong(songName);
          }}
        >
          Insert
        </Button>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <h3>Song</h3>
            </TableCell>
            <TableCell>
              <h3>Artist</h3>
            </TableCell>
            <TableCell>
              <h3>Dance Value</h3>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allSongs.map((row) => (
            <TableRow key={row.song_id}>
              <TableCell>{row.song_name}</TableCell>
              <TableCell>{row.artist_name}</TableCell>
              <TableCell>{row.song_dance}</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  onChange={(e) => {
                    setnewDanceVal(e.target.value);
                  }}
                ></TextField>
                <Button
                  onClick={() => {
                    updateDanceVal(row.song_name);
                  }}
                >
                  Update
                </Button>
              </TableCell>
              {deleteIcon(row.song_name)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
