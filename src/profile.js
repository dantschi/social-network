import React from "react";
import { ProfilePic } from "./profilepic";
import { BioEditor } from "./bioeditor";
import { Wall } from "./wall";
// import { Link } from "react-router-dom";
// import axios from "./axios";

export class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.showProps = this.showProps.bind(this);
        // this.deleteAccount = this.deleteAccount.bind(this);
        console.log("profile this.props", this.props);
    }

    // showProps() {
    //     console.log("this.props in Profile: ", this.props);
    // }

    render() {
        // defining "details", so I don't have to type this.props.details always
        // let details = this.props.details;
        console.log("this.props in Profile render()", this.props);
        return (
            <div className="profile-container">
                <div className="own-profile">
                    <div className="profile-pic-container">
                        <ProfilePic
                            imageurl={this.props.imageurl}
                            firstname={this.props.first_name}
                            lastname={this.props.last_name}
                        />
                        <h3>
                            {this.props.first_name} {this.props.last_name}
                        </h3>
                    </div>
                    <div className="bio-container">
                        <BioEditor
                            bio={this.props.bio}
                            setBio={this.props.setBio}
                        />
                    </div>
                    <button
                        className="btn-delete-account"
                        onClick={() => this.props.deleteAccount()}
                    >
                        Delete account
                    </button>
                </div>
                <Wall />
            </div>
        );
    }
}

// <button onClick={this.showProps}>showme</button>
