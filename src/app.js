import React from "react";
import axios from "./axios";
// import { ProfilePic } from "./profilepic";
import { Uploader } from "./uploader";
// import { Logo } from "./logo";
import Header from "./header";
import { Profile } from "./profile";
import { BrowserRouter, Route } from "react-router-dom";
import { OtherProfile } from "./otherprofile";
import { Logout } from "./logout";
import { FindPeople } from "./findpeople";
// import Particles from "react-particles-js";
// import { particleOpt } from "./particleopt";
import CuteAnimals from "./cuteanimals";
import Friends from "./friends";
import Chat from "./chat";

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        // binding methods
        this.closeIt = this.closeIt.bind(this);
        this.setBio = this.setBio.bind(this);
        this.clickHandlerForCloseModal = this.clickHandlerForCloseModal.bind(
            this
        );
        this.clickHandlerForProfilePic = this.clickHandlerForProfilePic.bind(
            this
        );
        this.logout = this.logout.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
    }

    componentDidMount() {
        //this one is only important for the <Header />
        this.setState({
            ...this.state,
            loggedIn: true
        });

        ///////////////////////////////////////////////////////////////
        // still not really understanding this "hipster" syntax
        // axios.get("/getuserdata").then(({ data }) => this.setState(data));
        ///////////////////////////////////////////////////////////////

        //getting user data when App mounts, and setting this.state.
        axios
            .get("/getuserdata")
            .then(rslt => {
                console.log(rslt.data);
                this.setState(rslt.data);
                // console.log("App did mount:", this.state);
            })
            .catch(err => {
                console.log(err);
            });
        //
    }

    // changeImage(e) {
    //     console.log("changeImage fires in 'App'", e);
    //
    //     this.setState({
    //         uploaderVisible: false
    //     });
    // }

    clickHandlerForCloseModal() {
        console.log("clickHandlerForCloseModal fires");
        this.setState({
            uploaderVisible: false
        });
    }

    clickHandlerForProfilePic(e) {
        console.log("clickHandlerForProfilePic fires: ", e);
        this.setState({
            uploaderVisible: true
        });
    }

    setBio(e) {
        console.log("setBio fires in App: ", e);
        this.setState({
            bio: e
        });
    }

    closeIt(e) {
        console.log("closeIt fires", e);
        this.setState({
            uploaderVisible: false
        });
    }

    async deleteAccount(e) {
        console.log("deleteAccount fires", e);
        await axios.post("/delete-account", {
            url: this.state.imageurl
        });
        location.replace("/");
    }

    async logout(e) {
        console.log("logout fires", e);
        this.setState({
            loggedIn: false
        });
        let rslt = await axios.post("/logout", { wantToLogout: true });
        console.log("/logout response from server", rslt);
        location.replace("/");
    }

    render() {
        // if (!this.state.id) {
        //     return <img src="/spinner.gif" />;
        // }
        return (
            <div className="app-main-container">
                <div className="background-container" />

                <BrowserRouter>
                    <div>
                        <Header
                            loggedIn={this.state.loggedIn}
                            firstname={this.state.first_name}
                            lastname={this.state.last_name}
                            imageurl={this.state.imageurl}
                            // closeModal={this.clickHandlerForCloseModal}
                            showModal={this.clickHandlerForProfilePic}
                        />

                        {this.state.uploaderVisible && (
                            <Uploader
                                clickHandlerForCloseModal={() =>
                                    this.setState({ uploaderVisible: false })
                                }
                                changeImage={img => {
                                    // console.log(img);
                                    this.setState({
                                        ...this.state,
                                        imageurl: img,
                                        uploaderVisible: false
                                    });
                                }}
                            />
                        )}
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    // details={this.state}
                                    id={this.state.id}
                                    first_name={this.state.first_name}
                                    last_name={this.state.last_name}
                                    imageurl={this.state.imageurl}
                                    bio={this.state.bio}
                                    setBio={this.setBio}
                                    deleteAccount={this.deleteAccount}
                                />
                            )}
                        />
                        <Route
                            path="/user/:id"
                            render={props => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route
                            path="/users"
                            render={props => (
                                <FindPeople
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route path="/friends" component={Friends} />
                        <Route path="/chat" component={Chat} />
                        <Route path="/cuteanimals" component={CuteAnimals} />
                        <Logout logout={this.logout} />
                    </div>
                </BrowserRouter>
            </div>
        );
        //
    }
}

// during the development phase, no particles background, it makes the page slower
// and my laptop suffer
// <div className="background-container">
//     <Particles params={particleOpt} />
// </div>
