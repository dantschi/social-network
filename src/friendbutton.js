import React from "react";
import axios from "./axios";
import { useState, useEffect } from "react";

export function FriendButton(userId) {
    const [userDetails, setUserDetails] = useState(userId);

    console.log(userDetails);

    useEffect(() => {
        console.log("FriendButton has been rendered, userDetails");
        axios
            .get(`/getfriendshipstatus/${userId.userId}`)
            .then(rslt => {
                console.log("/getfriendshipstatus response from server", rslt);
                setUserDetails({
                    ...userDetails,
                    buttonText: rslt.data.message,
                    functionToTrigger: rslt.data.functionToTrigger
                });
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    let changeStatus = async function(e) {
        console.log("changeStatus fires!", e);
        // const fn = async axios
        //     .post(`/sendfriendrequest/${userId.userId}`);
        //
        // await fn()

        try {
            let rslt = await axios.post(`/changestatus`, {
                id: userDetails.userId,
                functionToTrigger: userDetails.functionToTrigger
            });

            console.log(rslt.data);
            setUserDetails({
                ...userDetails,
                buttonText: rslt.data.message,
                functionToTrigger: rslt.data.functionToTrigger
            });
            console.log(
                "/sendfriendrequest POST response from server",
                rslt.data
            );
        } catch (err) {
            // .then(rslt => {
            //     setUserDetails({
            //         ...userDetails,
            //         buttonText: rslt.data.message,
            //         functionToTrigger: rslt.data.functionToTrigger
            //     });
            //     console.log(
            //         "/sendfriendrequest POST response from server",
            //         rslt.data
            //     );
            // })
            console.log("/sendfriendrequest POST error", err);
        }
    };

    return (
        <div>
            <button onClick={changeStatus}>{userDetails.buttonText}</button>
        </div>
    );
}
