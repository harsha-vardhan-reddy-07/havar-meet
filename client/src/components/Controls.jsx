import { useContext, useEffect, useRef, useState } from "react";
import { Grid } from "@mui/material";
import { Button } from "@mui/base";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import LogoutIcon from '@mui/icons-material/Logout';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import {BsRecordCircle, BsStopCircle} from 'react-icons/bs'; 
import AgoraRTC from 'agora-rtc-sdk-ng';
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";


import RecordRTC from 'recordrtc';
import download from 'downloadjs';



export default function Controls(props) {
  const { tracks, client, setStart, setInCall,  screenTrack, setScreenTrack} = useContext(SocketContext);
  const [trackState, setTrackState] = useState({ video: true, audio: true });
 
  const [screenSharing, setScreenSharing] = useState(false);
  const [screenSharingOff, setScreenSharingOff] = useState(false);


  // Screen recording
  const [screenRecording, setScreenrecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const recorderRef = useRef(null);

  const startRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const videoStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const stream = new MediaStream([...audioStream.getTracks(), ...videoStream.getTracks()]);
      const recorder = RecordRTC(stream, { type: 'video' });
      recorderRef.current = recorder;
      recorder.startRecording();
      setScreenrecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    recorderRef.current.stopRecording( async() => {
      const blob = recorderRef.current.getBlob();
      setRecordedBlob(blob);
      setScreenrecording(false);
      await downloadVideo();
    });
  };

  const downloadVideo = async () => {
    if (recordedBlob) {
      await download(recordedBlob, 'recorded-video.webm');
    }
  };



  // Screen sharing
  
  const startScreenSharing = async () => {
    try {
      const screenSharingTrack = await AgoraRTC.createScreenVideoTrack({
        encoderConfig: '1080p_1',
      });
      setScreenTrack(screenSharingTrack);
      setScreenSharing(true);
      setScreenSharingOff(false);
    } catch (error) {
      console.error('Failed to create screen sharing track:', error);
    }
  };

  const stopScreenSharing = async () => {
    if (screenTrack) {
      await client.unpublish(screenTrack);
      await client.publish(tracks[1]);
      await screenTrack.stop();
      setScreenTrack(null);
      setScreenSharing(false);
      setScreenSharingOff(true);
    }
  };

  useEffect(() =>{
    if(screenSharing){
      
      if (screenTrack && tracks){
        const fun = async () =>{
          await client.unpublish(tracks[1]);
          await client.publish(screenTrack);
        }
        fun();
      }
    }
    
  }, [screenTrack, client, screenSharing, screenSharingOff]);

 


  // Conference controls (video and audio)

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const navigate = useNavigate()

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
    navigate('/');
  };
  


  return (
    <Grid container spacing={2} alignItems="center">
      
      <Grid item>
        <Button
          variant="contained"
          color={trackState.audio ? "primary" : "secondary"}
          onClick={() => mute("audio")}
        >
          {trackState.audio ? <MicIcon /> : <MicOffIcon />}
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color={trackState.video ? "primary" : "secondary"}
          onClick={() => mute("video")}
        >
          {trackState.video ? <VideocamIcon /> : <VideocamOffIcon />}
        </Button>
      </Grid>
     
      {screenTrack ? (
        <Grid item>
        <Button
          variant="contained"
          color={trackState.video ? "primary" : "secondary"}
          onClick={stopScreenSharing}
        >
           <StopScreenShareIcon />
        </Button>
      </Grid>
      ) : (
        <Grid item>
        <Button
          variant="contained"
          color={trackState.video ? "primary" : "secondary"}
          onClick={startScreenSharing}
        >
          <PresentToAllIcon /> 
        </Button>
      </Grid>
      )}

      {screenRecording ? (
        <Grid item>
        <Button
          variant="contained"
          color={trackState.video ? "primary" : "secondary"}
          onClick={stopRecording}
        >
           <BsStopCircle />
        </Button>
      </Grid>
      ) : (
        <Grid item>
        <Button
          variant="contained"
          color={"danger"}
          onClick={startRecording}
        >
          <BsRecordCircle /> 
        </Button>
      </Grid>
      )}

      <Grid item>
        <Button
          variant="contained"
          color="default"
          onClick={() => leaveChannel()}
        >
          Leave
          <LogoutIcon />
        </Button>
      </Grid>
      {/* {screenTrack && (
        <div>
          <h2>Screen Sharing Preview</h2>
          <video ref={(ref) => (ref ? screenTrack.play(ref) : null)} />
        </div>
      
      )} */}

    </Grid>
  );
}
