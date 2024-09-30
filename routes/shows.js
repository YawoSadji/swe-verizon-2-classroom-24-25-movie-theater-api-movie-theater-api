const express = require('express');
const showsRouter = express.Router();
const {Show, User} = require("../models/index");
const {check, validationResult} = require('express-validator'); 


//This route returns all shows if no genre is specified
//but if a genre is specified in the request it returns movies of that genre
//so no need for a dedicated all shows get route.
//reason why i commented out the next route lol.

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

// showsRouter.get('/', async (req,res)=>{
//     const allShows = await Show.findAll();
//     res.json(allShows);
// });


//Get one show
showsRouter.get('/:id', async (req,res)=>{
    const id = req.params.id;
    const foundShow = await Show.findByPk(id);
    res.json(foundShow);
});

//Get all users who watched a show
showsRouter.get('/:id/users', async(req,res)=>{
    const id = req.params.id;
    const foundShow = await Show.findByPk(id);
    const users = await foundShow.getUsers();
    res.json(users);
});

//`PUT` update the `available` property of a show
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

//`DELETE` a show
showsRouter.delete('/:id', async (req,res)=>{
    const id = req.params.id;
    const foundShow = await Show.findByPk(id);
    await foundShow.destroy();
    const allShows = await Show.findAll();
    res.json(allShows);
});

//`POST` with server-validation : The title of a show must be a maximum of 25 characters
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