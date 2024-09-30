const express = require('express');
const usersRouter = express.Router();
const {Show, User} = require("../models/index");
const {check, validationResult} = require('express-validator'); 

//`GET` all users
usersRouter.get('/', async (req,res)=>{
    const allUsers = await User.findAll();
    res.json(allUsers);
});

//`GET` one user
usersRouter.get('/:id', async(req,res)=>{
    const id = req.params.id;
    const foundUser = await User.findByPk(id);
    res.json(foundUser);
});

//`GET` all shows watched by a user (user id in `req.params`)
usersRouter.get('/:id/shows', async(req,res)=>{
    const id = req.params.id;
    const foundUser = await User.findByPk(id);
    const shows = await foundUser.getShows();
    res.json(shows);
});

//`PUT` associate a user with a show they have watched
usersRouter.put('/:id/shows/:showId', async(req,res)=>{
    const id = req.params.id;
    const showId = req.params.showId;
    const foundUser = await User.findByPk(id);
    const show = await Show.findByPk(showId);
    await foundUser.addShow(show);
    const updatedUser = await User.findByPk(id, {include: Show});
    res.json(updatedUser);
});

//`POST` with server-validation : username must be an email address
usersRouter.post('/', [
    check('username').isEmail().withMessage('Username must be a valid email')
], async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        ////setting statuscode to 400 
        //if not it returns a 200 here.
        res.status(400).json({error: errors.array()});
    }else{
    await User.create(req.body);
    const allUsers = await User.findAll();
    res.json(allUsers);
    }
});

module.exports = usersRouter;