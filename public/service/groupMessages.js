import { json } from 'body-parser';
// const db = require('_helpers/db');
import { History } from '../../_helpers/db';
// const History = History;



var msg = [];


async function save_Group_Message(username,roomname , message) {
    let user_msg = { username,roomname ,  message };
    // let roomname = "Global"
    console.log("aaaaaaaaaaaaaa");
    const history2 = await History.findOne({ roomName: roomname });
    // console.log("responseeeee", history2);
    if (!history2) {
        console.log("inside saving data to history db");
        let obj = {
            roomName: roomname,
            message: {
                username: "",
                message: ""
            }
        }

        const history = new History(obj);

        history.save()
        console.log("after history save");


    }
    console.log("bbbbbbbbbbbbbbbbbbbbb");
    const history3 = History.findOne({})
    let messages = [{
        username: username,
        message: message
    }]

    const id = History.find({ username: username })

    History.findOneAndUpdate({ roomName: roomname }, { $push: { message: messages } },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
        });


    msg.push(user_msg);
    console.log(msg, "  :  msg");
    console.log(user_msg, " :  : user_msg");

    return user_msg;
}


async function get_All_Group_Messages(groupname) {
    // let result = msg
    console.log("inside get all group message from db :", groupname);
    try{
    let response = await History.findOne({ roomName: groupname })
    // let a =response.toString()
    console.log("..............  :  ", response.message);

    let result = response.message
    console.log("inside get all previous messages  :  ", result);
    return result
}
catch(e){
    console.log("exeption" , e);
}
}

module.exports = {
    save_Group_Message,
    get_All_Group_Messages,
};