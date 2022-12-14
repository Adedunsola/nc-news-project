
const express = require ('express');
const app = express();
const {manage404Errors,manage400Errors,manageCustomErrors} = require('./controllers/errorhandling')
const {getMessage, getTopics, getArticles, getArticleById,getCommentsByArticleId,postComment,patchVotesInArticles} = require ('./controllers/news.controller');

app.use(express.json())




//1. GET /api
app.get('/api', getMessage);

//2. GET /api/topics
app.get('/api/topics', getTopics);

//3. GET /api/articles
app.get('/api/articles', getArticles);

//4. GET /api/articles/:article_id
app.get('/api/articles/:article_id', getArticleById);

//5. GET /api/articles/:article_id/comments
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

//6. POST /api/articles/:article_id/comments
app.post('/api/articles/:article_id/comments', postComment);

//7. PATCH /api/articles/:article_id
app.patch('/api/articles/:article_id', patchVotesInArticles);



//Error Handling

app.use(manage400Errors);
app.use(manageCustomErrors);
app.all('*', manage404Errors); 


app.use((err,req,res,next)=>{
    res.sendStatus(500);
});























module.exports = app;