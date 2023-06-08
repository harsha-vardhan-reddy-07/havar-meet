import React, { useContext, useEffect, useState} from 'react';
import '../styles/Home.css';
import { AuthContext } from '../context/authContext';
import { SocketContext } from '../context/SocketContext';
import {CgEnter} from 'react-icons/cg';
import {RiVideoAddFill} from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  
  const [roomName, setRoomName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinRoomError, setJoinRoomError] = useState('');
  const {logout} = useContext(AuthContext);
  const handleLogOut =(e)=>{
    e.preventDefault();
    logout();
  }
  

  const {socket} = useContext(SocketContext);

  const handleCreateRoom = () =>{
    const userId = localStorage.getItem("userId").toString();
    socket.emit("create-room", {userId, roomName});
    
  }

  const handleJoinRoom = async () =>{
    await socket.emit('user-code-join', {roomId: joinRoomId});
    setRoomName('');
  }

  const navigate = useNavigate();
  useEffect(() =>{
    socket.on("room-exists", ({roomId})=>{
      navigate(`/meet/${roomId}`); 

    })
    socket.on("room-not-exist", ()=>{
      setJoinRoomId('');
      setJoinRoomError("Room dosen't exist! please try again..");
    })
  },[socket])

  const userName = localStorage.getItem("userName").toString();


  return (
    <div className='homePage'>
        
        <div className="home-header">
            <div className="home-logo">
              <h2>Smart Meet</h2>
            </div>
          
          <button onClick={handleLogOut}>logout</button>

        </div>

        <div className="home-container container">
          <div className="home-app-intro">
              <span className="welcome">Welcome!! {userName},</span>
              <h2>Unbounded Connections: Elevate Your Meetings with Free, Future-Forward Video Conferencing!!</h2>
          </div>
          <div className="home-meet-container">
            <div className="create-meet">
              <input type="text" placeholder='Name your meet...' onChange={(e)=> setRoomName(e.target.value)}  />
              <button onClick={handleCreateRoom}><RiVideoAddFill/> New meet</button>
            </div>
            <p>or</p>
            <div className="join-meet">
              <input type="text" placeholder='Enter code...' onChange={(e)=> setJoinRoomId(e.target.value)} />
              <button onClick={handleJoinRoom}> <CgEnter /> Join Meet</button>
            </div>
            <span>{joinRoomError}</span>
          </div>
        </div>
        
    </div>
  )
}

export default Home