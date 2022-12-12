
const express = require ('express');
const app = express();
const {manage404Errors} = require('./controllers/errors.controller')
const {getMessage,getTopics} = require ('./controllers/topics.controller');






//1. GET /api
app.get('/api', getMessage);

//2. GET /api/topics
app.get('/api/topics', getTopics);




//Error Handling
app.all('*', manage404Errors);
app.use((err,req,res,next)=>{
    console.log(err);
    res.sendStatus(500);
});























module.exports = app;