import React from "react";
import axios from "./axios";

export class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditMode: false
        };
        this.textAreaChange = this.textAreaChange.bind(this);
        this.sendBio = this.sendBio.bind(this);
        this.editProfile = this.editProfile.bind(this);
        this.closeEditMode = this.closeEditMode.bind(this);
    }

    // componentDidMount will be called ONLY once, after the first rendering
    // componentDidMount() {
    // console.log("BioEditor did mount", this.props);
    // if (typeof this.props.bio === "undefined" || this.props.bio == "") {
    //     this.setState({
    //         isEditMode: true
    //     });
    // } else {
    //     this.setState({
    //         isEditMode: false,
    //         bio: this.props.bio
    //     });
    // }
    // }

    // componentDidMount() {
    //     this.setState({
    //         bio: this.props.details.bio
    //     });
    //     // let initBio = this.props.details.bio;
    // }

    componentDidMount() {
        this.setState({
            ...this.state,
            bio: this.props.bio
        });
    }

    textAreaChange(e) {
        // console.log("textarea value:", e.target.value);
        this.setState({
            ...this.state,
            bio: e.target.value
        });
    }

    editProfile() {
        this.setState({
            ...this.state,
            isEditMode: true
        });
        console.log("editProfile fires, this.state", this.state);
    }

    closeEditMode() {
        this.setState({
            isEditMode: false
        });
    }

    sendBio() {
        if (this.state.bio) {
            axios
                .post("/sendbio", { bio: this.state.bio })
                .then(rslt => {
                    console.log("/sendbio POST response", rslt, this.state.bio);
                    if (rslt.data.success) {
                        this.props.setBio(this.state.bio);
                        this.setState({
                            ...this.state,
                            isEditMode: false
                        });
                    }
                })
                .catch(err => {
                    console.log("/sendbio POST error", err);
                });
        } else {
            this.closeEditMode();
        }

        //
    }

    render() {
        console.log("BioEditor this.props", this.props);

        // let initBio = this.props.details.bio;
        // let bioIsNotEmpty = this.props.details.bio;
        return (
            <div className="bio-editor">
                <h2>Bio</h2>
                <div className="bio-text">
                    <h3>{this.props.bio}</h3>
                </div>
                {!this.state.isEditMode && (
                    <div className="bio-editor-edit-mode-off">
                        <p
                            className="btn-edit-profile"
                            onClick={this.editProfile}
                        >
                            Edit bio
                        </p>
                    </div>
                )}
                {this.state.isEditMode && (
                    <div className="bio-editor-edit-mode-on">
                        <textarea
                            defaultValue={
                                this.state.bio ||
                                this.props.bio ||
                                "There is no bio yet"
                            }
                            name="bioeditor"
                            rows="8"
                            cols="40"
                            // placeholder={this.props.details.bio}
                            onChange={this.textAreaChange}
                        />
                        <button
                            type="button"
                            name="submit-bio"
                            onClick={this.sendBio}
                        >
                            Add
                        </button>
                        <button
                            onClick={this.closeEditMode}
                            type="button"
                            name="close-bio"
                        >
                            Close without editing
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
