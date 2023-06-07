import React, { useContext, useState} from 'react';
import '../styles/Home.css';
import { AuthContext } from '../context/authContext';
import { SocketContext } from '../context/SocketContext';



const Home = () => {

  


  const {logout} = useContext(AuthContext);
  const handleLogOut =(e)=>{
    e.preventDefault();
    logout();
  }
  

  const {socket} = useContext(SocketContext);

  const handleCreateRoom = () =>{
    const userId = localStorage.getItem("userId").toString();
    socket.emit("create-room", {userId});
    
  }

  


  return (
    <div className='homePage'>
        welcome home
        <button onClick={handleLogOut}>logout</button>
        

        <div className="createMeetContainer">
          <button onClick={handleCreateRoom}>Create new meet</button>
        </div>

    </div>
  )
}

export default Home