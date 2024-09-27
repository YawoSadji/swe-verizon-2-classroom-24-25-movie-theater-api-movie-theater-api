const express = require('express');
const showsRouter = express.Router();
const {Show, User} = require("../models/index");
const {check, validationResult} = require('express-validator'); 


showsRouter.get('/', async (req,res)=>{
    const allShows = await Show.findAll();
    res.json(allShows);
});

showsRouter.get('/:id', async (req,res)=>{
    const id = req.params.id;
    const foundShow = await Show.findByPk(id);
    res.json(foundShow);
});

showsRouter.get('/:id/users', async(req,res)=>{
    const id = req.params.id;
    const foundShow = await Show.findByPk(id);
    const users = await foundShow.getUsers();
    res.json(users);
});

showsRouter.put('/:id/available', async(req,res)=>{
    const id = req.params.id;
    const foundShow = await Show.findByPk(id);
    const {available} = req.body;
    if(!foundShow){
        return res.status(404).json({message: 'Show not found'});
    }
    if(typeof available !== 'boolean'){
        return res.status(400).json({message: 'Available must be boolean'});
    }
    await foundShow.update({available});
    const allShows = await Show.findAll();
    res.json(allShows);
});

showsRouter.delete('/:id', async (req,res)=>{
    const id = req.params.id;
    const foundShow = await Show.findByPk(id);
    await foundShow.destroy();
    const allShows = await Show.findAll();
    res.json(allShows);
});


showsRouter.get('/genre', async(req,res)=>{
    const genreNeeded = req.query.genre;
    if(!genre){
        return res.status(400).json({message: 'Genre is required'});
    }
    const foundShows = await Show.findAll({where:{genre: genreNeeded}}); 
    res.json(foundShows);
});

module.exports = showsRouter;