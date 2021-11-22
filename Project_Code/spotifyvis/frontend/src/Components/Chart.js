import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import Title from "./Title";
import { Typography } from "@mui/material";
import Axios from "axios";

export default function Chart() {
  const theme = useTheme();
  const [numPlaylist, setnumPlaylist] = React.useState(0);

  useEffect(() => {
    Axios.get("http://localhost:3002/api/numPlaylist").then((response) => {
      setnumPlaylist(response.data[0]["count(playlist_id)"]);
    });
  });

  return (
    <React.Fragment>
      <Title>Your Statistics</Title>
      <Typography variant="h7">Number of Playlists: {numPlaylist} </Typography>
      <Typography variant="h7">Number of Songs: </Typography>
    </React.Fragment>
  );
}
