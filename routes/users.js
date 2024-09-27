const express = require('express');
const usersRouter = express.Router();
const {Show, User} = require("../models/index");
const {check, validationResult} = require('express-validator'); 


usersRouter.get('/', async (req,res)=>{
    const allUsers = await User.findAll();
    res.json(allUsers);
});

usersRouter.get('/:id', async(req,res)=>{
    const id = req.params.id;
    const foundUser = await User.findByPk(id);
    res.json(foundUser);
});

usersRouter.get('/:id/watched', async(req,res)=>{
    const id = req.params.id;
    const foundUser = await User.findByPk(id);
    const shows = await foundUser.getShows();
    res.json(shows);
});

usersRouter.put('/:id/watched/:showId', async(req,res)=>{
    const id = req.params.id;
    const showId = req.params.showId;
    // const foundUser = await User.findByPk(id);
    const show = await Show.findByPk(showId);
    // await User.addShow(show);
    // const updatedUser = await User.findByPk(id, {include: Show});
    // res.json(updatedUser);
    const foundUser = await User.findByPk(id);
    const shows = await foundUser.getShows();
    res.json(shows);
});



module.exports = usersRouter;