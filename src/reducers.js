// reducers take 2 arguments, if state is empty,
// the initial value is an empty object
// this updates the state
export default function reducer(state = {}, action) {
    // "action" is the function we defined in "actions.js"
    // ALWAYS CONSOLE LOG THE ACTION!!!! \\
    console.log("action: ", action);

    if (action.type == "ADD_FRIENDSANDWANNBES") {
        // console.log("action in reducer, ADD_FRIENDS", action);
        return { ...state, friendsList: action.friendsList };
    }

    if (action.type == "CANCEL_FRIENDSHIP") {
        // console.log("action in reducer, CANCEL_FRIENDSHIP: ", action);
        return { ...state, friendsList: action.friendsList };
    }

    if (action.type == "ACCEPT_FRIENDSHIP") {
        // console.log("action in reducer, ACCEPT_FRIENDSHIP");
        return { ...state, friendsList: action.friendsList };
    }

    if (action.type == "REJECT_REQUEST") {
        // console.log("reject request ");
        return { ...state, friendsList: action.friendsList };
    }

    if (action.type == "ADD_LIST_ANIMALS") {
        // here I tell reducer how to add
        // list of animals to global state
        // spread OR "Object.assign()"
        return { ...state, listAnimals: action.listAnimals };
    }

    if (action.type == "GET_CHAT_MESSAGES") {
        // console.log("action in get chat messages:", action.chatMessages);
        return {
            ...state,
            chatMessages: action.chatMessages.chatMessages.reverse()
        };
    }

    if (action.type == "LAST_CHAT_MESSAGE") {
        // console.log("lastMessage in reducer: ", action.chatMessage);
        let temp = state.chatMessages;

        return {
            ...state,
            chatMessages: temp.concat(action.chatMessage)
        };
    }

    if (action.type == "ONLINE_USERS") {
        // console.log("onlineUsers in reducer: ", action.onlineUsers);

        return {
            ...state,
            onlineUsers: action.onlineUsers
        };
    }

    // if (action.type == "WALL_MESSAGES") {
    //     console.log("wallMessages in reducer ", action.wallMessages);
    //     return {
    //         ...state,
    //         wallMessages: action.wallMessages
    //     };
    // }
    console.log("state in reducers.js", state);
    return state;
}
