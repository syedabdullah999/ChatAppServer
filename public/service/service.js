// import config from 'config.json';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// const db = require('_helpers/db');
import { json } from 'body-parser';
import { User } from '../../_helpers/db';
import { Groups } from '../../_helpers/db';
// const User = db.User;
// const Groups = db.Groups;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    createSocket,
    delete: _delete,
    createGroup: createGroup,
    getUserGroup
};

async function authenticate(userParam) {
    console.log("login service", userParam.userName, userParam.password);
    const user = await User.findOne({ userName: userParam.userName });
    console.log("dada   :   s", user)
    console.log(userParam.password)
    console.log(user.password)
    let mySecret = "Try Not To PEEK XD"
    if (user && bcrypt.compareSync(userParam.password, user.password)) {
        console.log("password correct");
        const token = jwt.sign({ sub: user.id }, mySecret, { expiresIn: '7d' });
        return {
            ...user.toJSON(),
            token
        };
    }
}

async function createSocket() {


    return console.log("success")
}

async function getAll() {
    //  let a = User.find()
    //  console.log("hey    :     ",a);
    //  a.map(users => console.log(users))
    //  a.map((user) => console.log("hehehehe    :   ",user))
    // console.log("heyyyyyy    :    ",User.find(username));
    return await User.find();
}

async function getById(id) {

    return await User.findById(id);
}

async function create(userParam) {
    // validate
    try {

        const user2 = await User.findOne({ userName: userParam.userName });
        console.log("user found = ", user2)
        console.log("A   :  ", userParam.userName, userParam.password);
        if (user2) {
            console.log("B");
            let error = 'Username "' + userParam.userName + '" is already taken'
            throw error;

        }

        console.log("C");
        const user = new User(userParam);

        console.log("D");
        // hash password
        if (userParam.password) {
            console.log("E");
            user.password = bcrypt.hashSync(userParam.password, 10);
        }
        console.log("F");

        // save user
        await user.save()
        console.log(user)
        console.log("G");
        return {
            success: true,
            ...user.toJSON(),
        }



        // return "successfull register"
    }
    catch (error) {
        console.log(error)
        return {
            error,
            success: false
        }
    }


}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}



async function createGroup(groupParam) {


    try {

        console.log(groupParam);

        console.log("C");
        const group = new Groups(groupParam);
        console.log("inside service before saving  :", group)
        console.log("D");


        // save user
        await group.save()
        console.log("after saving  :  ", group)
        console.log("G");
        return {
            ...group.toJSON()
        }
    }
    catch (error) {
        console.log(error)
        return error
    }

}

async function getUserGroup(param){

    try{
        let data = []
        // const group = new Gr
        console.log(param);
        const group = await Groups.find()
        let memeber = await group.map(user => user.groupMembers)
        let name = await group.map(user => user.groupName)
        for(let i = 0 ; i <memeber.length ; i ++){
            let array = memeber[i].split(',');
            if(array.includes(param)){
                data.push({ groupName: name[i] ,groupMembers : memeber[i]})
            }

        }

        console.log("groups containing the user ",data);
        // console.log(g.length);
        console.log(group);
        // console.log("aaaaaqa",g);
        return {
            // success: true,
            ...data
        }
    }
    catch (error){
        console.log("error messagee : ",error);
        return error
    }
}
