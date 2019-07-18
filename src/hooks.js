import React from "react";
import { useState } from "react";

export function useStatfulTextArea() {
    const [message, setMessage] = useState("");

    const handleChange = e => {
        // console.log("handleChange event", e.target);
        // console.log("handleChange event.target.name", e.target.name);
        // console.log("handleChange event.target.value", e.target.value);
        console.log("handleChange", message);
        setMessage({
            ...message,
            [e.target.name]: e.target.value
        });
    };

    return [message, handleChange];
}

// export function useAxiosPostRequest(url) {
//     axios.post(url);
// }
