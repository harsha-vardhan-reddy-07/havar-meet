export const ADD_PEER = "ADD_PEER";
export const REMOVE_PEER = "REMOVE_PEER";

export const addPeerAction = (userId, stream) =>({
    type: ADD_PEER, 
    payload: {userId, stream},
});

export const removePeerAction = (userId) =>({
    type: REMOVE_PEER,
    payload: {userId},
});