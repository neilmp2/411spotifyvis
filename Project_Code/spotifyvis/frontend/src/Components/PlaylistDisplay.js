import * as React from "react";
import Link from "@mui/material/Link";
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

export default function PlaylistDisplay() {
  const [allPlaylists, setallPlaylists] = React.useState([]);

  useEffect(() => {
    Axios.get("http://localhost:3002/api/getPlaylists").then((response) => {
      setallPlaylists(response.data);
    });
  });

  return (
    <React.Fragment>
      <Title>All Playlists</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Playlist Name</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allPlaylists.map((row) => (
            <TableRow key={row.playlist_id}>
              <TableCell>{row.playlist_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
