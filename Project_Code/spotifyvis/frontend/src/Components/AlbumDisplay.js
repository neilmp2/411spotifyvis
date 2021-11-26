import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import Axios from "axios";
import { useEffect } from "react";

function preventDefault(event) {
  event.preventDefault();
}

export default function AlbumDisplay() {
  const [allPlaylists, setallPlaylists] = React.useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3002/api/getAlbums").then((response) => {
      setallPlaylists(response.data);
    });
  });

  return (
    <React.Fragment>
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
