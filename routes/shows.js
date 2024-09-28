const express = require('express');
const showsRouter = express.Router();
const {Show, User} = require("../models/index");
const {check, validationResult} = require('express-validator'); 


showsRouter.get('/', async(req,res)=>{
    const {genre} = req.query;
    try{
    const whereClause = genre ? {genre}:{}
    const foundShows = await Show.findAll({where: whereClause}); 
    res.json(foundShows);
    }
    catch(err){
    
        console.error(err);
        return res.status(400).json({message: 'Genre is required'});
    
    }
});
// found out that order of routes matter in Express... lol commenting for my future self.

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

showsRouter.post('/', [
    check('title').isLength({max:25}).withMessage('Title must be 25 characters or less')
], async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        ////setting statuscode to 400 
        //if not it returns a 200 here.
        res.status(400).json({error: errors.array()});
    }else{
    await Show.create(req.body);
    const allShows = await Show.findAll();
    res.json(allShows);
    }
});

module.exports = showsRouter;