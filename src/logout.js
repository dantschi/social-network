import React from "react";

export class Logout extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="logout">
                <img onClick={this.props.logout} src="/logout.svg" />
            </div>
        );
    }
}
