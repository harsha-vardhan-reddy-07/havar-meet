import React, { useContext, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import { config } from '../AgoraSetup';
import Grid from '@mui/material/Grid';
import VideoPlayer from '../components/VideoPlayer';
import Controls from '../components/Controls';



const MeetRoom =  () => {
  const {id} = useParams();
  const {socket, setInCall, client, users, setUsers, ready, tracks, setStart, setParticipants, start} = useContext(SocketContext);
  const userId = localStorage.getItem("userId");
    useEffect(() =>{
      socket.emit('join-room', {userId, roomId: id});
      socket.on("user-joined", async ({userId}) =>{
        setInCall(true);
      });
      socket.emit('get-participants', {roomId: id});
      socket.on("participants-list", (usernames)=>{
        setParticipants(usernames);
      })
    }, [socket]);
    
    useEffect(() => {
      let init = async (name) => {
        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "video") {
            setUsers((prevUsers) => {
              return [...prevUsers, user];
          });
          }
          if (mediaType === "audio") {
            user.audioTrack.play();
          }
        });
  
        client.on("user-unpublished", (user, mediaType) => {
          if (mediaType === "audio") {
            if (user.audioTrack) user.audioTrack.stop();
          }
          if (mediaType === "video") {
            setUsers((prevUsers) => {
              return prevUsers.filter((User) => User.uid !== user.uid);
            });
          }
        });
  
        client.on("user-left", (user) => {
          socket.emit("user-left-room", {userId: user.uid, roomId: id});
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        });
  
        try {
          await client.join(config.appId, name, config.token, userId);
        } catch (error) {
          console.log("error");
        }
  
        if (tracks) await client.publish([tracks[0], tracks[1]]);
        setStart(true);
  
        
        
      };
      
        
        if (ready && tracks) {
        try {
          init(id);
        } catch (error) {
          console.log(error);
        }
      }
    }, [id, client, ready, tracks]);

  


 
  return (
    <Grid container direction="column" style={{ height: "150%" }}>
      <Grid item style={{ height: "25%" }}>
        {ready && tracks && (
          <Controls tracks={tracks} />
        )}
      </Grid>
      <Grid item style={{ height: "75%" }}>
        {start && tracks && <VideoPlayer tracks={tracks} users={users} />}
      </Grid>
    </Grid>
  )
}

export default MeetRoom;