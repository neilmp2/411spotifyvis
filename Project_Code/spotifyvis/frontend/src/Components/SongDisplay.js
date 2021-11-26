import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import Axios from "axios";
import { useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { TextField } from "@mui/material";

function preventDefault(event) {
  event.preventDefault();
}

export default function SongDisplay() {
  const [allSongs, setallSongs] = React.useState([]);
  const [newDanceVal, setnewDanceVal] = React.useState("");

  useEffect(() => {
    Axios.get("http://localhost:3002/api/getSongs").then((response) => {
      setallSongs(response.data);
    });
  });

  const editIcon = (
    <IconButton>
      <EditIcon color="primary" />
    </IconButton>
  );

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
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Song</TableCell>
            <TableCell>Artist</TableCell>
            <TableCell>Dance Value</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
