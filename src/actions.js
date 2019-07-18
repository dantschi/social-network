// ALL of the action creators for the project are stored in the actions.js
// this is the place to make ajax requests
import axios from "./axios";
// import * as io from "socket.io-client";

export function getListOfAnimals() {
    // return is necessary in case of Promise.
    // in case of async/await is not necessary
    return axios.get("/get-list-animals").then(({ data }) => {
        // console.log("data in getListOfAnimals: ", data);
        // EVERY action creator MUST return an object
        // "type" property is required
        return {
            type: "ADD_LIST_ANIMALS",
            listAnimals: data
        };
    });
}

export async function getFriends() {
    let friends = await axios.get("/get-friends");
    // console.log("getFriends in action:", friends);
    // console.log("data in /get-friends", friends.data);
    return {
        type: "ADD_FRIENDSANDWANNBES",
        friendsList: friends.data
    };
}

export async function cancelFriendship(id) {
    // console.log("id in cancelFriendship: ", id);
    let friends = await axios.post("/cancel-friendship", { id: id });
    // let friends = await getFriends();
    return {
        type: "CANCEL_FRIENDSHIP",
        friendsList: friends.data
    };
}

export async function rejectRequest(id) {
    // console.log("reject request", id);
    let friends = await axios.post("/cancel-friendship", { id: id });
    return {
        type: "REJECT_REQUEST",
        friendsList: friends.data
    };
}

export async function acceptFriendshipRequest(id) {
    // console.log("id in acceptFriendshipRequest", id);
    let friends = await axios.post("/accept-friendship-request", { id: id });
    // let friends = await getFriends();
    return {
        type: "ACCEPT_FRIENDSHIP",
        friendsList: friends.data
    };
}

export async function getChatMessages(msgs) {
    // console.log("getChatMessages fires in actions: ", msgs);
    return {
        type: "GET_CHAT_MESSAGES",
        chatMessages: msgs
    };
}

export async function addLastMessage(msg) {
    // console.log("lastMessage in actions: ", msg);
    return {
        type: "LAST_CHAT_MESSAGE",
        chatMessage: msg
    };
}

export function onlineUsers(users) {
    // console.log("onlineUsers in actions", users);
    let tempArr = [];
    for (let prop in users) {
        tempArr.push(users[prop]);
    }
    // console.log("tempArr", tempArr);
    return {
        type: "ONLINE_USERS",
        onlineUsers: tempArr
    };
}

// export function wallMessages(msgs) {
//     console.log("wallMessages in actions", msgs);
//     return {
//         type: "WALL_MESSAGES",
//         wallMessages: msgs
//     };
// }

// export async function sendChatMessage(msg) {
//     console.log("sendChatMessage fires, value to send: ", msg);
//
//     // socket.emit("sendChatMessage", msg);
//
//     // let result = await axios.post("/send-chat-message", {
//     //     message: msg
//     // });
//     return {
//         type: "SEND_CHAT_MESSAGE",
//         result: msg
//     };
// }
