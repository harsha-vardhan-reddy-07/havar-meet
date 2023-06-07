import Rooms from '../models/Rooms.js';
import User from '../models/User.js';
import { ObjectId } from 'mongoose';


const roomHandler =(socket) =>{

    socket.on('create-room', async ({userId})=>{
        const newRoom = new Rooms({
            host: userId,
            participants: [],
            currentParticipants: []
        });
        const room = await newRoom.save();
        await socket.emit("room-created", {roomId: room._id});
    });

    socket.on('join-room', async ({roomId, userId})=>{
        await Rooms.updateOne({_id: roomId}, {$addToSet: {participants: userId}});
        await Rooms.updateOne({_id: roomId}, {$addToSet: {currentParticipants: userId}});

        await socket.join(roomId);
        console.log(`User : ${userId} joined room: ${roomId}`);
        await socket.broadcast.to(roomId).emit("user-joined", {userId});
    });

    socket.on("get-participants", async ({roomId})=>{
        const room = await Rooms.findOne({ _id: roomId });
        const participants = room.currentParticipants;
        const usernames = {};

        const users = await User.find(
            { _id: { $in: participants } },
            { _id: 1, username: 1 }
          ).exec();
        
        users.forEach(user => {
            const { _id, username } = user;
            usernames[username] = _id.valueOf().toString();
        });
        
        socket.emit("participants-list", usernames);
    })



    socket.on("user-left-room", async({userId, roomId})=>{
        await Rooms.updateOne({_id: roomId}, {$pull: {currentParticipants: userId}});
        await socket.leave(roomId);
    })

    socket.on('user-disconnected', async({userId, roomId})=>{ 
        console.log(`user: ${userId} left room ${roomId}`);
    })
   
}

export default roomHandler;