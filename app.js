
const express = require ('express');
const app = express();
const {manage404Errors} = require('./controllers/errors.controller')
const {getMessage, getTopics, getArticles} = require ('./controllers/news.controller');






//1. GET /api
app.get('/api', getMessage);

//2. GET /api/topics
app.get('/api/topics', getTopics);

//3. GET /api/articles
app.get('/api/articles', getArticles);




//Error Handling
app.all('*', manage404Errors);
app.use((err,req,res,next)=>{
    res.sendStatus(500);
});























module.exports = app;