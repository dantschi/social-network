import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            error: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleChange(event) {
        this.setState({
            data: {
                ...this.state.data,
                [event.target.name]: event.target.value
            },
            error: ""
        });
        console.log(event.target.value, this.state);
    }

    handleLogin() {
        const { email, password } = this.state.data;
        if (!email || !password) {
            console.log("field is missing from login form");
            this.setState({ error: "Please fill every field" });
        } else {
            axios
                .post("/login", { email, password })
                .then(rslt => {
                    if (rslt.data.success) {
                        location.replace("/");
                    } else {
                        console.log("/login POST result: ", rslt.data);
                        this.setState({ error: rslt.data.error });
                    }
                })
                .catch(err => {
                    console.log("/login POST response error", err);
                });
        }
    }

    render() {
        return (
            <div className="form-container">
                {this.state.error && (
                    <p className="error-message">{this.state.error}</p>
                )}
                <input
                    name="email"
                    type="email"
                    onChange={this.handleChange}
                    placeholder="Email address"
                    autoComplete="new-password"
                    required
                />
                <input
                    name="password"
                    type="password"
                    onChange={this.handleChange}
                    placeholder="Password"
                    autoComplete="new-password"
                    required
                />
                <button onClick={() => this.handleLogin()}>Login</button>
                <Link to="/">Click here to register!</Link>
            </div>
        );
    }
}
