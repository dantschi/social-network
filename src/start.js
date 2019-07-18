// every component is imported in this file
// my application starts here
// everything ends up in start.js
// everything in src folder will be handled by bundle-server.
// therefore only the react stuff shall be there
import React from "react";
import ReactDOM from "react-dom";
import { Welcome } from "./welcome";
// import { Logo } from "./logo";
import { App } from "./app";

/////////////// REDUX STUFF \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
import reducer from "./reducers";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

///////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// SOCKET IO
import { init } from "./socket";

let elem;

if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));

// function HelloWorld() {
//     return <div>Hello, World!</div>;
// }
