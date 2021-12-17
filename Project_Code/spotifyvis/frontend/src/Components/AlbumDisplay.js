import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Title from "./Title";
import Axios from "axios";
import { useEffect } from "react";

function preventDefault(event) {
  event.preventDefault();
}

export default function AlbumDisplay() {
  const [allPlaylists, setallPlaylists] = React.useState([]);
  const [albumName, setalbumName] = React.useState(" ");

  const deleteAlbum = (albumName) => {
    console.log("calling");
    Axios.delete(`http://localhost:3002/api/transaction/${albumName}`);
    // Axios.delete(`http://localhost:3002/api/trigger`);
    // Axios.put(`http://localhost:3002/api/update`, {
    //   songName: 'cat',
    //   newDanceVal: '1',
    // });
    console.log("done calling");
  };

  useEffect(() => {
    Axios.get("http://localhost:3002/api/getAlbums").then((response) => {
      setallPlaylists(response.data);
    });
  });

  return (
    <React.Fragment>
      <label> Album Name:</label>
      <input
        type="text"
        name="albumName"
        onChange={(e) => {
          setalbumName(e.target.value);
        }}
      />
      <Button onClick={deleteAlbum(albumName)}> Delete Album</Button>
      <Title>All Your Albums</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Album Name</TableCell>
            <TableCell>Created By:</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allPlaylists.map((row) => (
            <TableRow key={row.playlist_id}>
              <TableCell>{row.album_name}</TableCell>
              <TableCell>Cloud Patel</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
