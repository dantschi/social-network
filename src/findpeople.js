import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "./axios";
import { ProfilePic } from "./profilepic";

export function FindPeople() {
    console.log("findpeople is here!");

    const [users, setUsers] = useState([]);
    const [searchField, setSearchField] = useState("");
    const [initState, changeInitState] = useState(true);
    //

    // async function getLastThree() {}

    // const lastThree = await axios.get("/getlastthree");
    useEffect(
        () => {
            console.log("useEffect fires");
            axios
                .get(`/getusers/${searchField}`)
                .then(rslt => {
                    console.log(rslt);
                    setUsers(rslt.data.result);
                })
                .catch(err => {
                    console.log("/getusers error", err);
                });
            // async () => {
            //     const users = await axios.get("/getusers");
            //     console.log("FindPeople useEffect", getusers);
            //     setUsers(users.data.result)
            // },
            //
        },
        [searchField]
    );

    return (
        <div className="users-list">
            <input
                className="search-user-inputfield"
                placeholder="Search user"
                onChange={e => {
                    console.log("setSearchField fires", e.target.value);
                    setSearchField(e.target.value);
                    e.target.value
                        ? changeInitState(false)
                        : changeInitState(true);
                    console.log(initState);
                }}
            />

            {initState && <h3 className="left">Checkout who just joined!</h3>}
            {users.map(user => (
                <div className="user-container" key={user.id}>
                    <div className="profile-pic-container">
                        <Link to={`/user/${user.id}`}>
                            <div className="user-profile-pic-container">
                                <ProfilePic
                                    imageurl={user.imageurl}
                                    firstname={user.first_name}
                                    lastname={user.last_name}
                                />
                            </div>
                            <h3>
                                {user.first_name} {user.last_name}
                            </h3>
                            {/*<img src={user.imageurl} />
                    {<h3>{`${user.first_name} ${user.last_name}`}</h3>*/}
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}

// <div className="users-list">
//     {users.map(user => (
//         <div key={user.id}>
//             <img src={user.imageurl} />
//             <h3>
//                 `${user.first_name} ${user.last_name}`
//             </h3>
//         </div>
//     ))}
// </div>
// >
