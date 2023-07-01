import { json } from 'body-parser';
// const db = require('_helpers/db');
import { History } from '../../_helpers/db';
// const History = History;



var msg = [];


async function save_Message(username, message) {
    let user_msg = { username, message };
    let roomname = "Global"
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


    }
    console.log("bbbbbbbbbbbbbbbbbbbbb");
    const history3 = History.findOne({})
    // let obj = {
    // roomName : "Global",
    let messages =[{
        username: username,
        message: message
    }]
    // }
    // const history = new History(obj);
    
    // let obj = {
    //     roomName:roomname,
    //     message: [{
    //         username: username,
    //         text:message
    //     }]
    // }

    // const history = new History(obj);

    // history.message.push(messages)
    // history.save(done)
    
    
    const id = History.find({username : username})
    // const history = new History(obj);
    // let msg2 = new History(obj)
    // console.log("trueeeeee    ",id._id);
    History.findOneAndUpdate({roomName: "Global" }, { $push: { message: messages} },
    function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log(success);
        }
    });
    // History.message.push(message)
    // console.log("h1111 1111  :  ",h1);
    // if(h1){
    //     console.log("successssss     :    ",h1);
    // }



    // console.log("''''''''''''''''''''",JSON.parse(a));


    msg.push(user_msg);
    console.log(msg, "  :  msg");
    console.log(user_msg, " :  : user_msg");

    return user_msg;
}


async function get_All_Messages() {
    // let result = msg

    let  response = await History.findOne({roomName : "Global"})
    // let a =response.toString()
console.log("..............  :  ",response.message);

    let result = response.message
    console.log("inside get all previous messages  :  ", result);
    return result
}

module.exports = {
    save_Message,
    get_All_Messages,
};