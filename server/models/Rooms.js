import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    host: {
        type: String,
        require: true
    },
    participants: {
        type: Array
    },
    currentParticipants: {
        type: Array
    }
}, {timestamps: true});

const Rooms = mongoose.model("rooms", RoomSchema);
export default Rooms;