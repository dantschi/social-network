import React from "react";
import { HashRouter, Route } from "react-router-dom";
import { Registration } from "./registration";
import Header from "./header";
import { Logo } from "./logo";
import { Login } from "./login";

export class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="main-wrapper">
                <Header />
                <Logo />
                <HashRouter>
                    <div>
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                    </div>
                </HashRouter>
            </div>
        );
    }
}
