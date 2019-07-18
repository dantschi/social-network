import React from "react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// import * as io from "socket.io-client";
import { getChatMessages, sendChatMessage } from "./actions";
import { connect } from "react-redux";
import { socket } from "./socket";

// const socket = io.connect();
//
// socket.on("welcome", data => {
//     console.log(data);
//     socket.emit("thanks", {
//         message: "I say thank you now!"
//     });
// });

export function Chat(props) {
    const [chatMessage, setValue] = useState("");

    const scrollToBottom = () => {
        try {
            console.log(
                "scrolltobottom: ",
                msgRef,
                msgRef.current.scrollHeight
            );
            msgRef.current.scrollTop =
                msgRef.current.offsetTop + msgRef.current.offsetHeight;
        } catch (err) {
            console.log(err);
        }
    };

    const handleKeyDown = e => {
        if (!chatMessage) {
            // e.preventDefault();

            return;
        } else {
            console.log("handleKeyDown fires:", e);
            if (e.key == "Enter") {
                e.preventDefault();
                sendMessage();
            }
        }
    };

    useEffect(
        () => {
            scrollToBottom();
            // console.log("Chat useEffect fires");
            // props.dispatch(getChatMessages());
        },
        [props.chatMessages]
    );

    // useEffect(scrollToBottom, [props.chatMessages]);

    const msgRef = useRef();

    const sendMessage = () => {
        console.log("socket in sendMessage: ", socket);
        socket.emit("sendChatMessage", chatMessage);
        setValue("");
    };

    if (!props.chatMessages) {
        return (
            <div>
                <h2>Page is loading</h2>
                <img className="spinner" src="spinner.gif" />
            </div>
        );
    }

    return (
        <div className="chat-room">
            <div className="chat-messages-container">
                <h2>Chatroom</h2>
                <div ref={msgRef} className="chat-messages">
                    {props.chatMessages.length &&
                        props.chatMessages.map(msg => (
                            <div className="chat-message-wrapper" key={msg.id}>
                                <div className="chat-user-profile-div">
                                    <Link to={`/user/${msg.user_id}`}>
                                        <img
                                            className="chat-user-profile"
                                            src={msg.imageurl}
                                            alt={msg.first_name}
                                        />
                                    </Link>
                                </div>
                                <div className="chat-text-box">
                                    <div className="chat-text-box-header">
                                        <p>
                                            <span className="bold">
                                                <Link
                                                    to={`/user/${msg.user_id}`}
                                                >
                                                    {msg.first_name}{" "}
                                                    {msg.last_name}
                                                </Link>
                                            </span>
                                            ,{" "}
                                            {new Date(
                                                msg.created_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="chat-text-box-text">
                                        <p>{msg.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    <div>
                        <textarea
                            name="chat-textarea"
                            rows="4"
                            cols="40"
                            value={chatMessage}
                            onChange={e => {
                                setValue(e.target.value);
                            }}
                            onKeyDown={e => {
                                handleKeyDown(e);
                            }}
                        />
                    </div>
                    <button onClick={() => sendMessage()}>Send message</button>
                </div>
            </div>
            <div className="online-users-wrapper">
                <h2>Online users</h2>
                <div className="online-users">
                    {props.onlineUsers.length &&
                        props.onlineUsers.map(user => (
                            <div className="online-user" key={user.id}>
                                <Link to={`/user/${user.id}`}>
                                    <div className="online-user-img">
                                        <img
                                            src={user.imageurl}
                                            alt={`${user.first_name} ${
                                                user.last_name
                                            }`}
                                        />
                                    </div>
                                    <div className="online-user-name">
                                        <p>
                                            {user.first_name} {user.last_name}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    if (!state.chatMessages || !state.onlineUsers) {
        return {};
    } else {
        return {
            chatMessages: state.chatMessages,
            onlineUsers: state.onlineUsers
        };
    }
};

export default connect(mapStateToProps)(Chat);
