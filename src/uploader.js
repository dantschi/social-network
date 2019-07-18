// The Uploader component should be passed a function for setting the profilePicUrl of the App component's state.
// After a successful upload, it should call this function and pass to it the url of the image
// that was just uploaded (your POST route on the server will have to include this url in the response it sends).
// This should cause ProfilePic to automatically switch to the new image.
// The function for setting profilePicUrl should also set uploaderIsVisible to false.

import React from "react";
import axios from "./axios";

export class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        // this.closeThis = this.closeThis.bind(this);
    }

    handleUpload() {
        console.log("uploader file:", this.state.file);
        if (!this.state.file) {
            this.setState({
                ...this.state,
                error: "There is no file selected, please select a file!"
            });
        } else {
            let formData = new FormData();
            formData.append("file", this.state.file);
            console.log("handleUpload tihs.state", this.state, formData);
            axios
                .post("/changeuserimage", formData)
                .then(rslt => {
                    console.log("/changeuserimage POST response", rslt);
                    this.props.changeImage(rslt.data.url);
                })
                .catch(err => {
                    console.log("/changeuserimage POST error", err);
                });
        }
    }

    handleFileChange(e) {
        console.log("handleFileChange", e.target.files[0]);
        if (e.target.files[0].size > 2097152) {
            this.setState({
                ...this.state,
                error: "Maximal file size is 2MB"
            });
        } else {
            this.setState({
                file: e.target.files[0],
                error: null
            });
        }
        // console.log("this state after handleFileChange", this.state);
        // makes no sense consoling here because this.setState is asynchronous
    }

    // closeThis() {
    //     // closeThis fires
    //     // this is not gonna work like this. Close must be handled in "App" =>
    //     // this.setState({this.state.uploaderVisible: false})
    // }

    render() {
        return (
            <div className="uploader">
                <span
                    className="closeIt"
                    onClick={this.props.clickHandlerForCloseModal}
                >
                    X
                </span>
                <h2>Want to change your image?</h2>
                <label htmlFor="file">
                    Choose file
                    <input
                        className="inputfile"
                        id="file"
                        name="file"
                        type="file"
                        onChange={this.handleFileChange}
                    />
                </label>
                {this.state.error && (
                    <p className="error-message">{this.state.error}</p>
                )}

                <button disabled={!this.state.file} onClick={this.handleUpload}>
                    Upload
                </button>
            </div>
        );
    }
}
