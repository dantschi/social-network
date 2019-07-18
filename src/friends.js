import React from "react";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
    getFriends,
    cancelFriendship,
    acceptFriendshipRequest,
    rejectRequest
} from "./actions";
import { ProfilePic } from "./profilepic";
import { Link } from "react-router-dom";

function Friends(props) {
    // const [friendsList, setFriendsList] = useState([]);

    useEffect(() => {
        console.log("friends useEffect is there, props", props);
        props.dispatch(getFriends());
    }, []);

    function cancel(e) {
        console.log("cancel fires:", e);
        props.dispatch(cancelFriendship(e));
    }

    function accept(e) {
        console.log("accept fires", e);
        props.dispatch(acceptFriendshipRequest(e));
    }

    function reject(e) {
        console.log("reject fires", e);
        props.dispatch(rejectRequest(e));
    }

    if (!props.alreadyFriends && !props.stillNotAccepted) {
        return (
            <div>
                <h2>Friends page is rendered</h2>
                <div>Page is loading</div>
            </div>
        );
    }

    return (
        <div className="friends-list">
            <div className="cards">
                <div className="title">
                    <h2>Already {props.alreadyFriends.length} friends</h2>
                </div>
                {props.alreadyFriends.length &&
                    props.alreadyFriends.map(user => (
                        <div className="friend-container" key={user.id}>
                            <Link to={`/user/${user.id}`}>
                                <div className="friend-pic-container">
                                    <ProfilePic
                                        imageurl={user.imageurl}
                                        firstname={user.first_name}
                                        lastname={user.last_name}
                                    />
                                </div>
                                <h3 className="card-text">
                                    {user.first_name} {user.last_name}
                                </h3>
                            </Link>

                            <button onClick={() => cancel(user.id)}>
                                Unfriend
                            </button>
                        </div>
                    ))}
            </div>
            <div className="cards">
                <div className="title">
                    <h2>{props.stillNotAccepted.length} pending requests</h2>
                </div>
                {props.stillNotAccepted.length &&
                    props.stillNotAccepted.map(user => (
                        <div className="friend-container" key={user.id}>
                            <Link to={`/user/${user.id}`}>
                                <div className="friend-pic-container">
                                    <ProfilePic
                                        imageurl={user.imageurl}
                                        firstname={user.first_name}
                                        lastname={user.last_name}
                                    />
                                </div>
                                <h3 className="card-text">
                                    {user.first_name} {user.last_name}
                                </h3>
                            </Link>
                            <div className="btn-container">
                                <button onClick={() => accept(user.id)}>
                                    Accept
                                </button>
                                <button onClick={() => reject(user.id)}>
                                    Reject request
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    console.log("state in Friend mapStateToProps: ", state);

    if (!state.friendsList) {
        // if the list of friends is not there, return empty object
        return {};
    } else {
        // otherwise filter the results and pass the friends and wannabes
        // to the props of components. So I don't change global state,
        // only pass the needed data to the component as props
        return {
            alreadyFriends: state.friendsList.filter(
                user => user.accepted == true
            ),
            stillNotAccepted: state.friendsList.filter(
                user => user.accepted == false
            )
        };
    }
};

export default connect(mapStateToProps)(Friends);
