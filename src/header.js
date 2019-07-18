import React from "react";
import { Logo } from "./logo";
import { ProfilePic } from "./profilepic";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

export default function Header(props) {
    console.log("header props", props, typeof props);
    return (
        <header>
            <div className="header-content-container">
                {props.loggedIn && (
                    <Link to="/">
                        <div className="logo-container">
                            <Logo />
                        </div>
                    </Link>
                )}

                {props.loggedIn && (
                    <div className="header-links">
                        <Link to="/chat">
                            <p>Chat</p>
                        </Link>
                        <Link to="/friends">
                            <p>Friends</p>
                            <div className="pending-number">
                                <span>{props.stillNotAcceptedNr || "?"}</span>
                            </div>
                        </Link>
                        <Link to="/users">
                            <p>Find user</p>
                        </Link>

                        <ProfilePic
                            firstname={props.firstname}
                            lastname={props.lastname}
                            imageurl={props.imageurl}
                            showModal={props.showModal}
                        />
                    </div>
                )}
            </div>
        </header>
    );
}

// const mapStateToProps = (state, props) => {
//     console.log("header mapStateToProps props", props);
//     if (!state.friendsList) {
//         return {};
//     } else {
//         console.log(
//             state.friendsList.filter(user => user.accepted == false).length
//         );
//         return {
//             stillNotAcceptedNr: state.friendsList.filter(
//                 user => user.accepted == false
//             ).length
//         };
//     }
// };
//
// export default connect(mapStateToProps)(Header);

// <div className="profile-pic-container">
//     <ProfilePic />
// </div>

// <h1 className={loggedIn ? "logged-in" : "logged-out"}>
//     social
// </h1>
