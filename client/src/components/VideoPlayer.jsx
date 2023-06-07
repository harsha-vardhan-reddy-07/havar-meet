import { Grid } from "@mui/material";
import { AgoraVideoPlayer } from "agora-rtc-react";

import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../context/SocketContext";

export default function Video(props) {
  const { users, tracks, userId} = useContext(SocketContext);
  const [gridSpacing, setGridSpacing] = useState(12);

  useEffect(() => {
    setGridSpacing(Math.max(Math.floor(12 / (users.length + 1)), 4));
  }, [users, tracks]);

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid item xs={gridSpacing}>
        <AgoraVideoPlayer
          videoTrack={tracks[1]}
          // key={userId}
          style={{ height: "100%", width: "100%" }}
          />
      </Grid>
      {users.length > 0 &&
        users.map((user) => {
          if (user.videoTrack) {
            return (
              <Grid item xs={gridSpacing}>
                <AgoraVideoPlayer
                  videoTrack={user.videoTrack}
                  key={user.uid}
                  style={{ height: "100%", width: "100%" }}
                />
              </Grid>
            );
          } else return null;
        })}
    </Grid>
  );
}
