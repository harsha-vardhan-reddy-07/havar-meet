import React, { useContext } from 'react'
import { SocketContext } from '../context/SocketContext';
import SendIcon from '@mui/icons-material/Send';

const Chat = () => {

    const { chatsContainerOpen} = useContext(SocketContext);

  return (
    <div className='chats-page' 
    style={chatsContainerOpen ? {right: "1vw"} : {right: "-25vw"}}
    >
        <h3>Chat Room..</h3>
        <hr id='h3-hr' />
        <div className="chat-container">
          <div className="chat-messages-box">
            <div className="message-body">
              <span className="sender-name">Akash</span>
              <p className="message">Hola everyone!!</p>
            </div>
            <div className="message-body">
              <span className="sender-name">Jackson</span>
              <p className="message">Hola everyone!!</p>
            </div>
          </div>
          <div className="send-messages-box">
            <input type="text" />
            <button><SendIcon /></button>
          </div>
        </div>
    </div>
  )
}

export default Chat