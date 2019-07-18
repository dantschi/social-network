import React from "react";

// passing onClick function from the parent. The parent has to trigger the visibility,
// even if we click on its child.
export function ProfilePic({ imageurl, firstname, lastname, showModal }) {
    // console.log("imageurl", imageurl);
    // console.log("firstname", firstname);
    // console.log("lastname", lastname);
    // console.log("showmodal", showmodal);
    return (
        <img
            src={imageurl}
            alt={`${firstname} ${lastname}`}
            onClick={showModal}
        />
    );
}
