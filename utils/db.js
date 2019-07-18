const spicedPg = require("spiced-pg");
const { username, pwd } = require("./secrets.json");

const dbUrl =
    process.env.DATABASE_URL ||
    `postgres:${username}:${pwd}@localhost:5432/salt-socialnetwork`;
const db = spicedPg(dbUrl);

module.exports.addUser = function addUser(fn, ln, em, pw) {
    return db.query(
        `
        INSERT INTO users(first_name, last_name, email, password)
        VALUES ($1,$2,$3,$4)
        RETURNING id;
        `,
        [fn, ln, em, pw]
    );
};

module.exports.getUserPwd = function getUserPwd(em) {
    return db.query(
        `
        SELECT id, password FROM users WHERE email = $1;
        `,
        [em]
    );
};

module.exports.getUserData = function getUserData(id) {
    return db.query(
        `
    SELECT id, first_name, last_name, imageurl, bio FROM users
    WHERE id = $1;
    `,
        [id]
    );
};
module.exports.getOtherUserData = function getOtherUserData(id) {
    return db.query(
        `
        SELECT id, first_name, last_name, imageurl , bio
        FROM users WHERE id = $1;
        `,
        [id]
    );
};

module.exports.getUsers = function getUsers(text) {
    return db.query(
        `
        SELECT id, first_name, last_name, imageurl
        FROM users
        WHERE first_name ILIKE $1 OR last_name ILIKE $1;
        `,
        [text + "%"]
    );
};

// SELECT id, first_name, last_name, imageurl
// FROM users
// WHERE first_name ILIKE $1;

//
// SELECT id, first_name, last_name, imageurl
// FROM users
// WHERE POSITION($1 in first_name || ' ' || last_name )>0;

module.exports.getLastThree = function getLastThree() {
    return db.query(
        `
        SELECT id, first_name, last_name, imageurl
        FROM users
        ORDER BY created_at DESC LIMIT 3;
        `,
        []
    );
};

module.exports.getFriendshipStatus = function getFriendshipStatus(
    sessionUserId,
    paramsUserId
) {
    return db.query(
        `
        SELECT * FROM friendships
        WHERE (sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1);
        `,
        [sessionUserId, paramsUserId]
    );
};

module.exports.getFriends = function getFriends(sessionUserId) {
    return db.query(
        `
        SELECT users.id, first_name, last_name, imageurl, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
        `,
        [sessionUserId]
    );
};

module.exports.getOnlineFriends = function getOnlineFriends(uid) {
    return db.query(
        `
        SELECT users.id, users.first_name, users.last_name, users.imageurl FROM users
        LEFT JOIN friendships
        ON (friendships.accepted=true AND users.id = $1 AND )
        WHERE id != $1
        ;
        `,
        [uid]
    );
};
// LEFT JOIN friendships;
// ON (friendships.accepted = true AND sender_id = $1 AND receiver_id=$2)
// OR (friendships.accepted) = true AND sender_id = $2 AND receiver_id=$1)

module.exports.getChatMessages = function getChatMessages() {
    return db.query(
        `
        SELECT chat.id, chat.message, chat.user_id, chat.created_at, users.first_name AS first_name, users.last_name AS last_name, users.imageurl AS imageurl
       FROM chat
       LEFT JOIN users on chat.user_id = users.id
       ORDER BY chat.created_at DESC
       LIMIT 10;
        `,
        []
    );
};

module.exports.getWallMessages = function getWallMessages(id) {
    return db.query(
        `
        SELECT wallposts.id AS "message_id", wallposts.message, wallposts.sender_id, wallposts.receiver_id, wallposts.created_at, users.first_name, users.last_name, users.imageurl
        FROM wallposts
        LEFT JOIN users ON wallposts.sender_id = users.id
        WHERE wallposts.receiver_id = $1
        ORDER BY wallposts.created_at DESC
        LIMIT 10;
        `,
        [id]
    );
};

module.exports.addChatMessage = function addChatMessage(msg, userId) {
    return db.query(
        `
        INSERT INTO chat (message, user_id)
        VALUES($1, $2)
        RETURNING id, created_at;

        `,
        [msg, userId]
    );
};

module.exports.addFriendship = function addFriendship(
    sessionUserId,
    paramsUserId
) {
    return db.query(
        `
        INSERT INTO friendships (sender_id, receiver_id)
        VALUES($1,$2);
        `,
        [sessionUserId, paramsUserId]
    );
};

module.exports.addOnlineUser = function addOnlineUser(sid, uid) {
    return db.query(
        `
        INSERT INTO onlineusers (socket_id, user_id)
        VALUES($1,$2)
        `,
        [sid, uid]
    );
};

module.exports.addWallMessage = function addWallMessage(sid, uid, msg) {
    return db.query(
        `
        INSERT INTO wallposts (sender_id,receiver_id, message)
        VALUES($1,$2,$3)
        RETURNING *;
        `,
        [sid, uid, msg]
    );
};

module.exports.deleteOffline = function deleteOffline(sid, uid) {
    return db.query(
        `
        DELETE FROM onlineusers
        WHERE socket_id =$1 AND user_id =$2;
        `,
        [sid, uid]
    );
};

module.exports.deleteFriendship = function deleteFriendship(
    sessionUserId,
    paramsUserId
) {
    return db.query(
        `
        DELETE FROM friendships WHERE (sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1);
        `,
        [sessionUserId, paramsUserId]
    );
};

module.exports.acceptFriendship = function acceptFriendship(
    sessionUserId,
    paramsUserId
) {
    return db.query(
        `
        UPDATE friendships SET accepted = true
        WHERE (sender_id=$2 AND receiver_id=$1)
        RETURNING *;
        `,
        [sessionUserId, paramsUserId]
    );
};

module.exports.addImageUrl = function addImageUrl(id, url) {
    return db.query(
        `
        UPDATE users SET imageurl=$2 WHERE id=$1;
        `,
        [id, url]
    );
};

module.exports.addBio = function addBio(id, bio) {
    return db.query(
        `
        UPDATE users SET bio=$2 WHERE id=$1;
        `,
        [id, bio]
    );
};

module.exports.deleteFriendships = function deleteFriendships(id) {
    return db.query(
        `
        DELETE FROM friendships WHERE sender_id=$1 OR receiver_id=$1;
        `,
        [id]
    );
};

module.exports.deleteChatMessages = function deleteChatMessages(id) {
    return db.query(
        `
        DELETE FROM chat WHERE user_id = $1;
        `,
        [id]
    );
};

module.exports.deleteAccount = function deleteAccount(id) {
    return db.query(
        `
        DELETE FROM users WHERE id=$1;
        `,
        [id]
    );
};
