import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            error: ""
        };

        this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        // const target = event.target;
        // const value = target.value;
        // const name = target.name;

        this.setState({
            data: {
                ...this.state.data,
                [event.target.name]: event.target.value
            },
            error: ""
        });

        console.log(event.target, event.target.value, this.state);

        // this.setState({
        //     [event.target.name]: event.target.value
        // });
    }

    // handleSubmit(event) {
    //     event.preventDefault();
    // }

    submit() {
        console.log("submit event this.state", this.state.data);
        const {
            first_name,
            last_name,
            email,
            password,
            password2
        } = this.state.data;
        if (!first_name || !last_name || !email || !password || !password2) {
            console.log("field is empty");
            this.setState({ error: "Please fill every field" });
            console.log(this.state);
        } else {
            if (password === password2) {
                axios
                    .post("/registration", {
                        first_name,
                        last_name,
                        email,
                        password
                    })
                    .then(rslt => {
                        console.log("/register POST result: ", rslt.data);
                        if (rslt.data.success) {
                            location.replace("/");
                        } else {
                            this.setState({ error: rslt.data.error });
                        }
                    })
                    .catch(err => {
                        console.log("/register POST error", err);
                        this.setState({ error: "Something went wrong" });
                    });
            } else {
                this.setState({ error: "Passwords should be identical" });
            }
        }
    }

    render() {
        return (
            <div className="form-container">
                {this.state.error && (
                    <p className="error-message">{this.state.error}</p>
                )}
                <input
                    name="first_name"
                    type="text"
                    onChange={this.handleChange}
                    placeholder="First name"
                    autoComplete="new-password"
                    required
                />
                <input
                    name="last_name"
                    type="text"
                    onChange={this.handleChange}
                    placeholder="Last name"
                    autoComplete="new-password"
                    required
                />
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
                <input
                    name="password2"
                    type="password"
                    onChange={this.handleChange}
                    placeholder="Password again"
                    autoComplete="new-password"
                    required
                />

                <button onClick={() => this.submit()}>Register</button>
                <Link to="/login">Click here to Log in!</Link>
            </div>
        );
    }
}
