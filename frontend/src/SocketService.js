import io from "socket.io-client";

let socket;
export const initializeSocket = (userId) => {
    if(!socket) {
        socket = io.connect("https://localhost:3001", {query : {userId}});
        console.log("Socket Initialized, ");
        console.log(socket.id);
    }
}


export const getSocket = () => {
    return socket;
}

export const disconnectSocket = () => {
    console.log("socket is disconnected");
    socket.removeListener("receive_message");
}