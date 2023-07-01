require('rootpath')();
import express from 'express';
const app = express();
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from './_helpers/jwt.js';
import errorHandler from './_helpers/error-handler.js';

import socket from 'socket.io';
import color from 'colors';
import { get_Current_User, user_Disconnect, join_User, get_All_User } from './public/service/globalUsers.js';
import { get_Current_Group_User, join_Group_User } from './public/service/groupChatUsers.js';
import { get_All_Messages, save_Message } from './public/service/messages.js';
import { get_All_Group_Messages, save_Group_Message } from './public/service/groupMessages.js';
import { get_All_One_Chat_Messages, save_One_Chat_Message } from './public/service/oneChatMessages.js';

let userId = ""

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    // orgin: ["https://chat-io-9hxb.vercel.app/"],
    origin: '*',
    methods:["POST","GET"],
    credentials: true
}));
// app.use(express.json())
// use JWT auth to secure the api
app.use(jwt());

// api routes
app.get('/',(req,res,next)=>{
    res.status(200).json({
      message:'bad request'
    })
  })
app.use('/users', require('./public/controller/controller'));

app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
// const port = 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// SOCKET IMPLEMETATION /////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
const io = socket(server);
var c_user;

//initializing the socket io connection 
io.on("connection", (socket) => {
    // var online = Object.keys(io.engine.clients);
    // console.log(online);
    // io.emit('server message', JSON.stringify(online));
    console.log("inside socket", socket.id);
    ////////////////////////////////////////////////////
    //////////////////////////////////////////////////////

    // var online = Object.keys(io.engine.clients);
    // io.emit('server message', JSON.stringify(online));


    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////Join Global Chat Room////////////////////////////////
    //for a new user joining the room
    socket.on("joinRoom", ({ username, roomname }) => {
        //* create user

        console.log("inside socket joinroom", username, roomname);
        const p_user = join_User(socket.id, username, roomname);
        console.log(socket.id, "=id");
        userId = p_user.id
        console.log("userId = ", userId);
        socket.join(p_user.room);

        //display a welcome message to the user who have joined a room
        socket.emit("message", {
            userId: p_user.id,
            username: p_user.username,
            text: `Welcome ${p_user.username}`,
        });

        //displays a joined room message to all other room users except that particular user
        socket.broadcast.to(p_user.room).emit("message", {
            userId: p_user.id,
            username: p_user.username,
            text: `${p_user.username} has joined the chat`,
        });
        ////////////////////////////////////////
        ///////////////////////////////////////
        socket.on('typing', (data) => {
            // console.log("in typing socket");
            if (data.typing == true)
                io.emit('display', data)
            else
                io.emit('display', data)
        })

    });

    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////Online Users/////////////////////////////////////////
    socket.on("getonlineusers", () => {
        let c_user = get_All_User();
        console.log("list of online users ::::::::::::::  ", c_user);
        const ids = c_user.map(o => o.id)
        const n = c_user.map(o => o.username)
        const filtered = c_user.filter(({ id }, index) => !ids.includes(id, index + 1))
        // const filtered2 = c_user.filter(({ n }, index) => !n.includes(n, index + 1))

        console.log("filtered users:    ", filtered);

        c_user = filtered
        io.emit("onlineUsers", {
            c_user: c_user,

        });
    })



    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////One To One Chat//////////////////////////////////////
    socket.on('getMsg', (data) => {
        console.log("data recieved from one to one  chat client : ", data)
        let message = data[0].message
        let userName = data[0].username
        let user2 = data[0].currentName
        let id = data[0].sendid
        let currentId = data[0].currentId

        // let msgSave = save-Messages(data);
        console.log("about to send message   :  ", message, userName, id);
        io.to(id).emit("notification",{
            userName,id,user2,message
        })
        // socket.join(id)
        io.to(id).to(currentId).emit("sendMsg", {
            message, userName, id, currentId
        });
        console.log("saving message  !!!!!!!!!!!!!!!!!!!!! !!!!!!!!!!!!!!!!!!!!!!");
        const msg = save_One_Chat_Message(userName, user2, message)
        // socket.broadcast.to(currentId).emit("sendMsg", {
        //     message, userName, id
        // }
        // )
    });
    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////Global Room Send Message/////////////////////////////
    var first = 1;
    socket.on("chat", (text , id) => {
        
        console.log("in chat socket after message send ",first+1);
        console.log("inside chat socket", text);
        //gets the room user and the message sent
        get_Current_User(id).then(function (result) {

        let p_user = result
        let room = "Global"
        // console.log("saved message  :  ", msg);
        console.log("socket.id = ", socket.id);
        console.log("p_users = ", p_user);
        console.log("about to send data to global chat Messageeeee    &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& ");
        io.to(room).emit("message", {
            userId: p_user.id,
            username: p_user.username,
            text: text,
        });
        console.log("saving message  !!!!!!!!!!!!!!!!!!!!! !!!!!!!!!!!!!!!!!!!!!!");
        const msg = save_Message(p_user.username, text)
    });
    });


    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////Get All Global Messages From DB//////////////////////
    socket.on("getMessages", () => {
        get_All_Messages().then(function (msg) {
            console.log(";;;;;;;;;;;;;;;;;;;; ;;;;;;;;;;;; ");
            console.log("inside get all message socket  :  ", msg);



            socket.emit("displayMsg", {
                msg: msg
            })

        })

    })

    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////Get All Group Messages From DB///////////////////////
    socket.on("getGroupMessages", (groupname) => {
        console.log("inside get group message socket   :   ");
        get_All_Group_Messages(groupname).then(function (msg) {
            // console.log(" inside get all group messages socket :",msg)
            socket.emit("displayGroupMessage", {
                msg: msg
            })
        })
    })


    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////Get One To One Chat Messages From DB/////////////////
    socket.on("getOneChatMessages", (user1, user2) => {
        console.log("inside get group message socket   :   ");
        get_All_One_Chat_Messages(user1, user2).then(function (msg) {
            // console.log(" inside get one chat  messages socket %%%%%%%%%% :", msg);
            socket.emit("displayOneChatMessage", {
                msg: msg
            })
        })
    })


    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////User Disconneted////////////////////////////////////
    socket.on("disconnect", () => {
        //the user is deleted from array of users and a left room message displayed
        const p_user = user_Disconnect(socket.id);
        console.log("updated users list : ", p_user);
        if (p_user) {
            io.to(p_user.room).emit("message", {
                userId: p_user.id,
                username: p_user.username,
                text: `${p_user.username} has left the chat`,
            });
        }
    });


    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////Group Chat Initiate /////////////////////////////////
    socket.on("groupChat", ({ username, roomname }) => {
        console.log("inside socket GROup Chat", username, roomname);
        const p_user = join_Group_User(socket.id, username, roomname);
        console.log(socket.id, "=id");
        userId = p_user.id
        console.log("userId = ", userId);
        socket.join(roomname);
        socket.on('typingg', (data) => {
            // console.log("in typing socket");
            if (data.typing == true)
                io.emit('displayy', data)
            else
                io.emit('displayy', data)
        })
    });


    /////////////////////////////////////////////////////////////////////////////
    ////////////////////////Group Chat Messages//////////////////////////////////
    socket.on("groupChatMessage", (text, groupname) => {
        console.log("inside chat socket", text, groupname);
        //gets the room user and the message sent
        const p_user = get_Current_Group_User(socket.id,groupname);
        
        console.log("socket.id = ", socket.id)



        console.log("p_users = ", p_user);

        io.to(p_user.room).emit("groupMsg", {
            userId: p_user.id,
            username: p_user.username,
            room: groupname,
            text: text,
        });
        console.log("saving message  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        const msg = save_Group_Message(p_user.username, groupname, text)
    });
});




