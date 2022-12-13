
const express = require ('express');
const app = express();
const {manage404Errors,manage400Errors,manageCustomErrors} = require('./controllers/errors.controller')
const {getMessage, getTopics, getArticles, getArticleById} = require ('./controllers/news.controller');





//1. GET /api
app.get('/api', getMessage);

//2. GET /api/topics
app.get('/api/topics', getTopics);

//3. GET /api/articles
app.get('/api/articles', getArticles);

//4. GET /api/articles/:article_id
app.get('/api/articles/:article_id', getArticleById);



//Error Handling
app.all('*', manage404Errors);
app.use(manage400Errors);
app.use(manageCustomErrors);

app.use((err,req,res,next)=>{
    
    res.sendStatus(500);
});























module.exports = app;