import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
// import "../public/styles.css";

import { connect } from "react-redux";
import { socket } from "./socket";
import { useState, useEffect } from "react";
// import { useStatfulTextArea } from "./hooks";

export function Wall(props) {
    const [message, setTextAreaValue] = useState("");
    const [wallMessages, setMessages] = useState([]);

    useEffect(() => {
        axios
            .get("/get-wall-messages/" + props.visitedId)
            .then(rslt => {
                console.log(
                    "/get-wall-messages result",
                    rslt.data,
                    wallMessages
                );
                setMessages(rslt.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const sendWallMessage = () => {
        console.log("sendWallMessage", props.visitedId, message);
        if (message) {
            socket.emit("wallMessage", {
                wallMessage: message,
                receiverUser: props.visitedId
            });
            socket.on("lastWallMessage", msg => {
                console.log("wallMessage in socket", msg);
                let tempArr = wallMessages;
                tempArr.unshift(msg);
                console.log("tempArr in lastWallMessage", tempArr);
                setMessages(tempArr);
            });
            // handleChange("");
        } else {
            console.log("There is nothing to send");
        }
    };

    if (!wallMessages) {
        return (
            <div>
                <h2>Page is loading</h2>
                <img className="spinner" src="spinner.gif" />
            </div>
        );
    }

    console.log("wallmessages in wall", wallMessages);

    return (
        <div className="other-wall">
            <div className="other-wall-area">
                <div className="other-wall-area-static">
                    <h3>
                        Wall of {wallMessages.first_name}{" "}
                        {wallMessages.last_name}
                    </h3>
                    <h4>
                        Write something on {wallMessages.first_name}&apos;s
                        wall!
                    </h4>
                    <textarea
                        name="wallTextarea"
                        rows="4"
                        cols="40"
                        onChange={e => {
                            setTextAreaValue(e.target.value);
                        }}
                    />
                    <button
                        type="button"
                        name="send-wall-message"
                        onClick={sendWallMessage}
                    >
                        Share something on {wallMessages.first_name}&apos;s wall
                    </button>
                </div>
            </div>

            <div className="other-wall-content">
                {!!wallMessages.length &&
                    wallMessages.map(msg => (
                        <div
                            key={`${msg.message_id}`}
                            className="other-wall-message-container"
                        >
                            <div className="wall-message-profile-div">
                                <Link to={`/user/${msg.sender_id}`}>
                                    <img
                                        className="wall-user-profile"
                                        src={`${msg.imageurl}`}
                                    />
                                </Link>
                            </div>
                            <div className="wall-text-box">
                                <div className="wall-text-box-header">
                                    <Link to={`/user/${msg.sender_id}`}>
                                        <p>
                                            {`${msg.first_name} ${
                                                msg.last_name
                                            }`}{" "}
                                            {new Date(
                                                msg.created_at
                                            ).toLocaleString()}
                                        </p>
                                    </Link>
                                </div>
                                <div className="wall-text-box-content">
                                    <p>{`${msg.message}`}</p>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
