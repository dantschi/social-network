import {
    getChatMessages,
    addLastMessage,
    onlineUsers,
    wallMessages
} from "./actions";
import * as io from "socket.io-client";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("getChatMessages", msgs => {
            // console.log("getChatMessages message from the server: ", msgs);
            store.dispatch(getChatMessages(msgs));
        });

        socket.on("onlineUsers", users => {
            // console.log("onlineUsers in socket", users);
            store.dispatch(onlineUsers(users));
        });

        // socket.on("wallMessages", msgs => {
        //     console.log("wallMessages in socket", msgs);
        //     store.dispatch(wallMessages(msgs));
        // });

        socket.on("lastMessage", msg => {
            // console.log("lastMessage in socket", msg);
            store.dispatch(addLastMessage(msg));
        });
    }
    return socket;
};
