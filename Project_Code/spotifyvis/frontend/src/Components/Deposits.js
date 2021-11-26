import * as React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Title from "./Title";

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits() {
  return (
    <React.Fragment>
      <Title>Welcome!</Title>
      <Typography component="p" variant="h5">
        Cloud Patel
      </Typography>

      <div>
        <Link
          color="primary"
          href="https://spotify.com"
          onClick={preventDefault}
        >
          View Profile
        </Link>
      </div>
    </React.Fragment>
  );
}
