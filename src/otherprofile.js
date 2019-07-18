import React from "react";
import axios from "./axios";
// import "../public/styles.css";
import { FriendButton } from "./friendbutton";
import { Link } from "react-router-dom";
// import { connect } from "react-redux";
import { socket } from "./socket";
import { Wall } from "./wall";

export class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {
            wallMessages: {},
            error: ""
        };
        // this.textAreaChange = this.textAreaChange.bind(this);
        // this.sendWallMessage = this.sendWallMessage.bind(this);
    }

    // textAreaChange(e) {
    //     console.log("textAreaChange", e.target.value);
    //     this.setState({
    //         ...this.state,
    //         wallMessage: e.target.value
    //     });
    // }

    componentDidMount() {
        console.log("this.props in OtherProfile", this.props);
        axios.get("/getotheruser/" + this.props.match.params.id).then(rslt => {
            console.log("/getotheruser GET response from server", rslt.data);
            if (rslt.data.sameuser) {
                this.props.history.push("/");
            } else {
                console.log("result in OtherProfile: ", rslt.data);
                this.setState(rslt.data);
            }
        });

        // socket.on("wallMessages", msgs => {
        //     console.log("wallMessages in socket, componentDidMount", msgs);
        //     this.setState({
        //         ...this.state,
        //         wallMessages: msgs
        //     });
        // });
    }

    render() {
        let { first_name, last_name, imageurl, bio } = this.state;

        return (
            <div className="other-profile-container">
                <div className="other-profile">
                    <h3 className="other-name">
                        {first_name} {last_name}{" "}
                    </h3>
                    <img
                        className="other-profile-image"
                        src={imageurl}
                        alt={`Profile picture of ${first_name} ${last_name}`}
                    />
                    <div className="other-profile-bio">
                        <p className="other-bio">{bio}</p>
                    </div>
                    <FriendButton userId={this.props.match.params.id} />
                </div>
                <Wall visitedId={this.props.match.params.id} />
            </div>
        );
    }
}
