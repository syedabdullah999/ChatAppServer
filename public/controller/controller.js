import express from 'express';
const router = express.Router();
import userService from '../service/service.js';
// import socketService from '../service/socket.js'
import axios from 'axios';

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);
router.get('/socket', createSocket);
router.post('/registergroup', createGroup);
router.get('/group/:name', getGroup);

module.exports = router;

function authenticate(req, res, next) {
    console.log("inside login controller");
    console.log(req.body);
    userService.authenticate(req.body)
        .then((user) => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    debugger;
    console.log(req.body)

    console.log("in the register body")

    userService.create(req.body)
        .then((user) => user.success == true ? res.json(user) : res.status(400).json({ user }))
        .catch(err => next(err));
}


function getAll(req, res, next) {
    userService.getAll()
    // .then(users => console.log("hello   :   ",users.map(u => u.userName))) 
    .then(users => res.json(users))
    .catch(err => next(err));
}

function getCurrent(req, res, next) {
    console.log("inside getall user controller");
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    console.log("inside get current");
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function createSocket(req, res, next) {
    console.log("inside createsocket user controller");
    userService.createSocket()
        .then(() => res.json({}))
        .catch(err => next(err));
}

function createGroup(req, res, next) {
    debugger;
    console.log("create group data   :   ", req.body)

    console.log("in the register body")

    userService.createGroup(req.body)
        .then((group) => group ? res.json(group) : res.status(400).json({ message: 'Group Invalid' }))
        .catch(err => next(err));
}

function getGroup(req, res, next){


    console.log("get group controller  :  ",req.params.name);
    // res.json("success")
    
    userService.getUserGroup(req.params.name)
    .then((data) => data ? res.json(data) : res.status(400).json({ message: 'Group Invalid' }))
    .catch(err => next(err));
}