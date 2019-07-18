const express = require("express");
const app = express();

////////////////////////////////////////////////////
// socket.io boilerplate
const server = require("http").Server(app);
// 'origins' prevents csrf kind attack, you define which url and port to listen to
const io = require("socket.io")(server, { origins: "localhost:8080" });
////////////////////////////////////////////////////

const compression = require("compression");
const db = require("./utils/db");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bc = require("./utils/bc");
const s3 = require("./utils/s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const csurf = require("csurf");
const cheerio = require("cheerio");
const https = require("https");
const god = require("./utils/getogdetails");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    },
    onError: function(err) {
        console.log("multer error", err);
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/////////////////////////////////////////////////////////////
// SOCKET IO SETTINGS
const cookieSessionMiddleware = cookieSession({
    secret: "this is my crazy secret text",
    maxAge: 1000 * 60 * 60 * 24 * 14 // 2 weeks
});

app.use(cookieSessionMiddleware);
io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

/////////////////////////////////////////////////////////////

// app.use(
//     cookieSession({
//         secret: "this is my crazy secret text",
//         maxAge: 1000 * 60 * 60 * 24 * 14 // 2 weeks
//     })
// );

app.use(compression());

app.use(express.static(__dirname + "/public"));

app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//////////////////// CLASS NOTES \\\\\\\\\\\\\\\\\\\\\\\\\
// Making registration with async

// app.post("/registration", async (req, res) => {
//     const { first_name, last_name, email, password } = req.body;
//     try {
//         // in the "hash" variable the password hash is stored
//         const hash = await bc.hashPassword(password);
//         // the result of the query db.newUser is stored in the variable "data"
//         const data = await db.newUser(first_name, last_name, email, hash);
//         //
//         req.session.userId = data.rows[0].id;
//         res.json({ success: true });
//     } catch (e) {
//         console.log("error in POST /register", e);
//     }
// });

app.post("/registration", (req, res) => {
    console.log("/registration req.body", req.body);
    let { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
        console.log("missing field in registration form");
        return res.redirect("/");
    }
    bc.hashPassword(password)
        .then(rslt => {
            console.log("password hashed");
            db.addUser(first_name.trim(), last_name.trim(), email.trim(), rslt)
                .then(rslt => {
                    console.log("user added, user id is: ", rslt);
                    req.session.userId = rslt.rows[0].id;
                    console.log("req.session: ", req.session);
                    res.json({ success: true });
                })
                .catch(err => {
                    console.log("error in adding user", err);
                    if (err.detail == "Key (email)=(a) already exists.")
                        res.json({
                            error:
                                "There is already a registered user with this email address"
                        });
                });
        })
        .catch(err => {
            console.log("error in adding user: ", err);
        });

    // res.json({ status: "worked" });
});

// app.get("/login", (req, res) => {
//     res.sendFile(__dirname + "/index.html");
// });

app.post("/login", (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        console.log("missing field in login form");

        res.redirect("/");
    }
    console.log("/login POST req.body: ", req.body);
    db.getUserPwd(email)
        .then(rslt => {
            if (rslt.rows.length) {
                console.log("/login get user password: ", rslt);
                let userId = rslt.rows[0].id;
                bc.checkPassword(password, rslt.rows[0].password)
                    .then(rslt => {
                        console.log("password check result: ", rslt);
                        if (rslt) {
                            // if it is true, the user is logged in
                            // session loggedIn must be set, redirect
                            req.session.userId = userId;
                            console.log("req.session: ", req.session);
                            res.json({ success: true });
                        } else {
                            console.log("Wrong credentials");
                            res.json({ error: "Wrong credentials" });
                        }
                    })
                    .catch(err => {
                        userId = null;
                        console.log("password check error: ", err);
                        res.json({ error: "Something went wrong, try again" });
                    });
            } else {
                res.json({ error: "There is no user with this email address" });
                console.log("There is no user with this email address");
            }
        })
        .catch(err => {
            console.log("/login POST error ", err);
        });
});

app.get("/getuserdata", (req, res) => {
    db.getUserData(req.session.userId).then(rslt => {
        if (!rslt.rows[0].imageurl) {
            rslt.rows[0].imageurl = "./logo.svg";
        }
        res.json(rslt.rows[0]);
    });
});

app.get("/getotheruser/:id", (req, res) => {
    console.log("/getotheruser GET req.params", req.params, req.session.userId);
    console.log(parseInt(req.params.id) === req.session.userId);
    if (req.session.userId === parseInt(req.params.id)) {
        res.json({
            sameuser: "true"
        });
    } else {
        db.getOtherUserData(req.params.id)
            .then(rslt => {
                console.log("/getotheruser query result", rslt.rows);
                if (rslt.rows[0].imageurl == null) {
                    rslt.rows[0].imageurl = "/user.svg";
                }
                res.json(rslt.rows[0]);
            })
            .catch(err => {
                console.log("/getotheruser query ERROR", err);
            });
    }
});

app.get("/getusers/:searchfieldvalue?", (req, res) => {
    console.log("/getlastthree reached server", req.body, req.params);
    if (req.params.searchfieldvalue == undefined) {
        console.log("empty searchfield");
        db.getLastThree()
            .then(rslt => {
                console.log("db.getLastThree result", rslt);
                res.json({
                    message: "db.getLastThree GET server response",
                    result: rslt.rows
                });
            })
            .catch(err => {
                console.log("/getlastthree error", err);
            });
    } else {
        console.log(req.params.searchfieldvalue);
        db.getUsers(req.params.searchfieldvalue).then(rslt => {
            console.log("db.getUsers", rslt);
            res.json({
                message: "db.getUsers GET server response",
                result: rslt.rows
            });
        });
    }
});

app.get("/getfriendshipstatus/:id", (req, res) => {
    console.log(
        "/getfriendshipstatus session, params:",
        req.session,
        req.params
    );
    db.getFriendshipStatus(req.session.userId, req.params.id).then(rslt => {
        console.log("/getfriendshipstatus query result", rslt);
        if (!rslt.rowCount) {
            res.json({
                message: "Send friend request",
                functionToTrigger: "send"
            });
        } else {
            if (!rslt.rows[0].accepted) {
                if (req.session.userId === rslt.rows[0].sender_id) {
                    res.json({
                        message: "Cancel friend request",
                        functionToTrigger: "delete"
                    });
                } else {
                    res.json({
                        message: "Accept friend request",
                        functionToTrigger: "accept"
                    });
                }
            } else {
                res.json({
                    message: "Unfriend",
                    functionToTrigger: "delete"
                });
            }
        }
    });
});

app.get("/get-friends", (req, res) => {
    console.log("/get-friends GET");
    db.getFriends(req.session.userId)
        .then(rslt => {
            // console.log("getFriends query success", rslt);
            // if (rslt.rows[0].imageurl == null || undefined) {
            //     rslt.rows[0].imageurl = "/user.svg";
            // }
            res.json(rslt.rows);
        })
        .catch(err => {
            console.log("getFriends query error: ", err);
            // rslt.rows[0].imageurl = "/user.svg";
            // res.json(rslt.rows);
        });
});

app.post("/cancel-friendship", (req, res) => {
    console.log("/cancel-friendship req.body", req.body);
    (async () => {
        console.log("async fires!");
        try {
            await db.deleteFriendship(req.session.userId, req.body.id);
            let rslt = await db.getFriends(req.session.userId);
            console.log(
                "getFriends query result in /cancel-friendship: ",
                rslt
            );
            res.json(rslt.rows);
        } catch (err) {
            console.log("getFriends query error in /cancel-friendship", err);
        }
    })();
});

app.post("/accept-friendship-request", async (req, res) => {
    console.log("/accept-friendship-request req.body", req.body);

    try {
        await db.acceptFriendship(req.session.userId, req.body.id);
        let rslt = await db.getFriends(req.session.userId);
        console.log("getFriends query result in /accept", rslt);
        res.json(rslt.rows);
    } catch (err) {
        console.log("getFriends query error in /accept", err);
    }
});

app.post("/changestatus", (req, res) => {
    console.log(
        "/sendfriendrequest POST session, params",
        req.session,
        req.body
    );

    if (req.body.functionToTrigger == "send") {
        db.addFriendship(req.session.userId, req.body.id)
            .then(rslt => {
                console.log(rslt);
                res.json({
                    message: "Cancel friend request",
                    functionToTrigger: "delete"
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
    if (req.body.functionToTrigger == "delete") {
        db.deleteFriendship(req.session.userId, req.body.id).then(rslt => {
            console.log("result deleting friendship", rslt);
            res.json({
                message: "Send friend request",
                functionToTrigger: "send"
            });
        });
    }
    if (req.body.functionToTrigger == "accept") {
        db.acceptFriendship(req.session.userId, req.body.id).then(rslt => {
            console.log("result accepting friendship", rslt);
            res.json({
                message: "Unfriend",
                functionToTrigger: "delete"
            });
        });
    }
});

app.post("/sendbio", (req, res) => {
    console.log("/sendbio POST request", req.session.userId, req.body.bio);
    db.addBio(req.session.userId, req.body.bio)
        .then(rslt => {
            console.log("addBio", rslt);
            res.json({
                success: true
            });
        })
        .catch(err => {
            console.log("addBio error", err);
        });
});

app.post("/logout", (req, res) => {
    console.log("/logout POST req.body", req.session);
    if (req.body.wantToLogout) {
        req.session = null;
        // res.json("want to logout");
        res.redirect("/");
    } else {
        res.json("Something went wrong with logout");
    }
});

app.post("/delete-account", async (req, res) => {
    console.log("/delete-account fires", req.body.url);
    let fileName = req.body.url.replace(
        "https://s3.amazonaws.com/danielvarga-salt/",
        ""
    );
    console.log(fileName);
    try {
        await s3.deleteImage(fileName);
        await db.deleteFriendships(req.session.userId);
        await db.deleteChatMessages(req.session.userId);
        await db.deleteAccount(req.session.userId);
        req.session = null;
        res.json("/delete-account answers");
        res.redirect("/");
    } catch (err) {
        console.log("/delete-account error", err);
    }
});

app.post("/changeuserimage", uploader.single("file"), s3.upload, function(
    req,
    res
) {
    console.log("/changeuserimage POST", req.body);
    let imageurl =
        "https://s3.amazonaws.com/danielvarga-salt/" + req.file.filename;
    console.log(
        "/changeuserimage POST req.file.filename, imageurl, req.session: ",
        req.file.filename,
        imageurl,
        req.session
    );

    db.addImageUrl(req.session.userId, imageurl)
        .then(rslt => {
            console.log("/changeuserimage result", rslt);
            res.json({
                status: "success",
                url: imageurl
            });
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/get-wall-messages/:id", async (req, res) => {
    console.log("/get-wall-messages", req.params.id);
    let rslt = await db.getWallMessages(req.params.id);
    console.log("getWallMessages result", rslt.rows);
    res.json(rslt.rows);
    // let arrayOfIds = [];
    // for (let i = 0; i < rslt.rows.length; i++) {
    //     if (arrayOfIds.indexOf(rslt.rows[i].sender_id != -1)) {
    //         arrayOfIds.push(rslt.rows[i].sender_id);
    //     }
    // }
    // console.log(arrayOfIds);
});

/////////////// CLASS ROUTE FOR REDUX \\\\\\\\\\\\\\\\\\\\
app.get("/get-list-animals", (req, res) => {
    // db query
    let animals = ["dogs", "cats", "otters", "seagulls"];
    res.json(animals);
});
/////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.get("/welcome", (req, res) => {
    req.session.userId
        ? res.redirect("/")
        : res.sendFile(__dirname + "/index.html");
});

app.get("*", (req, res) => {
    !req.session.userId
        ? res.redirect("/welcome")
        : res.sendFile(__dirname + "/index.html");
});

// app.get("*", function(req, res) {
//     res.sendFile(__dirname + "/index.html");
// });

// because the dependency socket is called,
// "server" can be used for listening to the requests

server.listen(8080, function() {
    console.log("I'm listening.");
});

const onlineUsers = {};
io.on("connection", async socket => {
    console.log("new socket connection", socket.request.session);
    console.log(`socket with the id ${socket.id} is now connected`);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    try {
        let userData = await db.getUserData(socket.request.session.userId);
        console.log("userData", userData.rows);
        onlineUsers[socket.id] = userData.rows[0];
        console.log("onlineUsers: ", onlineUsers);
        io.sockets.emit("onlineUsers", onlineUsers);

        // await db.addOnlineUser(socket.id, socket.request.session.userId);
        // let rslt = await db.getOnlineFriends();
        // console.log("onlineusers after adding: ", rslt);
        let chatMessages = await db.getChatMessages();
        socket.emit("getChatMessages", {
            chatMessages: chatMessages.rows
        });

        socket.on("wallMessage", async content => {
            // console.log("wallMessage content:", content);
            let { wallMessage, receiverUserId } = content;
            try {
                let addRslt = await db.addWallMessage(
                    socket.request.session.userId,
                    receiverUserId,
                    wallMessage
                );

                if (wallMessage.startsWith("https://")) {
                    // god.getOgDetails(wallMessage);
                    god.getOgDetails2(wallMessage, (err, rslt) => {
                        if (err) {
                            console.log("omg error", err);
                        }
                        socket.emit("lastWallMessage", rslt);
                        console.log("omg result", rslt);
                    });
                    // console.log("omg result", omg);
                }

                // console.log("addResult", addRslt);
                let userData = await db.getUserData(
                    socket.request.session.userId
                );
                // console.log("userData in sendChatMessage:", userData.rows[0]);
                let resObj = {
                    id: addRslt.rows[0].id,
                    message: wallMessage,
                    user_id: socket.request.session.userId,
                    created_at: addRslt.rows[0].created_at,
                    first_name: userData.rows[0].first_name,
                    last_name: userData.rows[0].last_name,
                    imageurl: userData.rows[0].imageurl
                };
                io.sockets.emit("lastWallMessage", resObj);
                socket.emit("lastWallMessage", resObj);
            } catch (err) {
                console.log("add wallMessage error", err);
            }
            // let rslt = await db.addWallMessage(msg,socket.request.userId)
        });

        socket.on("sendChatMessage", async msg => {
            console.log("sendChatMessage is there: ", msg);
            try {
                let rslt = await db.addChatMessage(
                    msg,
                    socket.request.session.userId
                );
                // console.log("sendChatMessage chat message id: ", rslt.rows[0].id);
                let userData = await db.getUserData(
                    socket.request.session.userId
                );
                // console.log("userData in sendChatMessage:", userData.rows[0]);
                let resObj = {
                    id: rslt.rows[0].id,
                    message: msg,
                    user_id: socket.request.session.userId,
                    created_at: rslt.rows[0].created_at,
                    first_name: userData.rows[0].first_name,
                    last_name: userData.rows[0].last_name,
                    imageurl: userData.rows[0].imageurl
                };
                io.sockets.emit("lastMessage", resObj);
            } catch (err) {
                console.log("error in sendChatMessage: ", err);
            }
        });
    } catch (err) {
        console.log("socket.io error", err);
    }

    socket.on("disconnect", async () => {
        // await db.deleteOffline(socket.id, socket.request.session.userId);
        // let rslt = await db.getOnlineFriends();

        delete onlineUsers[socket.id];
        io.sockets.emit("onlineUsers", onlineUsers);

        // console.log("onlineusers after deleting: ", rslt.rows);
        console.log(`socket with the id ${socket.id} is now disconnected`);
    });
});

//
