import { json } from 'body-parser';
// const db = require('_helpers/db');
import { OneToOneChat } from '../../_helpers/db';
// const OneToOneChat = OneToOneChat;



var msg = [];


async function save_One_Chat_Message(user1, user2, message) {
    let username = user1
    let user_msg = { user1, user2, username, message };
    // let roomname = "Global"
    console.log("aaaaaaaaaaaaaa");
    console.log("save one chat messages   :   ", user1, user2, message);
    let user = {
        user1: user1,
        user2: user2
    }
    let u2 = {
        user1: user2,
        user2: user1
    }


    const oneToOneChat2 = await OneToOneChat.findOne({ users: user });
    const oneToOneChat3 = await OneToOneChat.findOne({ users: u2 });
    // console.log("responseeeee&&&&&&&&&&&&&&&&&& 2222  :", oneToOneChat2);
    // console.log("responseeeee&&&&&&&&&&&&&&&&&& 3333  :", oneToOneChat3);
    if (!oneToOneChat2 && !oneToOneChat3) {
        console.log("inside saving data to history db");
        let obj = {
            users: {
                user1: user1,
                user2: user2
            }
        }

        const oneToOneChat = new OneToOneChat(obj);

        oneToOneChat.save()
        console.log("after history save");


    }
    console.log("bbbbbbbbbbbbbbbbbbbbb");
    let messages = [{
        username: user1,
        message: message
    }]
    const oc1 = await OneToOneChat.findOne({ users: user });
    const oc2 = await OneToOneChat.findOne({ users: u2 });

    if (oc1) {
        OneToOneChat.findOneAndUpdate({ users: user }, { $push: { message: messages } },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(success);
                }
            });
    }
    else {
        OneToOneChat.findOneAndUpdate({ users: u2 }, { $push: { message: messages } },
            function (error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(success);
                }
            });
    }

    msg.push(user_msg);
    // console.log(msg, "  :  msg");
    // console.log(user_msg, " :  : user_msg");

    return user_msg;
}


async function get_All_One_Chat_Messages(user1, user2) {
    // let result = msg
    console.log("inside get one chat message from db :", user1, user2);
    try {
        let user = {
            user1: user1,
            user2: user2
        }
        let u2 = {
            user1: user2,
            user2: user1
        }
        let response = await OneToOneChat.findOne({ users: user })
        let response2 = await OneToOneChat.findOne({ users: u2 })
        // let a =response.toString()
        if(response){
        console.log("..............  :  ", response.message);

        let result = response.message
        // console.log("inside get all previous messages  :  ", result);
        return result
    }
    else{
        console.log("..............  :  ", response2.message);

        let result = response2.message
        // console.log("inside get all previous messages  :  ", result);
        return result
    }
    }
    catch (e) {
        console.log("exeption", e);
    }
}

module.exports = {
    save_One_Chat_Message,
    get_All_One_Chat_Messages,
};