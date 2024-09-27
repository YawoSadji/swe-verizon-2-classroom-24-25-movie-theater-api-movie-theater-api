const express = require("express");
const app = express();
const db = require("../db/connection");
const usersRouter = require('../routes/users');
const showsRouter = require('../routes/shows');
//TODO: Create your GET Request Route Below: 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/users', usersRouter);
app.use('/shows', showsRouter);


module.exports = app;
