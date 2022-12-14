
const express = require ('express');
const app = express();
const {manage404Errors,manage400Errors,manageCustomErrors} = require('./errorhandling')
const {getMessage, getTopics} = require ('./controllers/topics.controller');
const {getArticles, getArticleById,patchVotesInArticles} = require ('./controllers/article.controller');
const {getCommentsByArticleId,postComment} = require ('./controllers/comments.controller');
const {getUsers} = require ('./controllers/users.controller');

app.use(express.json())





//0. GET /api
app.get('/api', getMessage);

//3. GET /api/topics
app.get('/api/topics', getTopics);

//4. GET /api/articles
app.get('/api/articles', getArticles);

//5. GET /api/articles/:article_id
app.get('/api/articles/:article_id', getArticleById);

//6. GET /api/articles/:article_id/comments
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

//7. POST /api/articles/:article_id/comments
app.post('/api/articles/:article_id/comments', postComment);

//8. PATCH /api/articles/:article_id
app.patch('/api/articles/:article_id', patchVotesInArticles);

//9. GET /api/users
app.get('/api/users', getUsers);

//10. GET /api/articles?topic







//Error Handling

app.use(manage400Errors);
app.use(manageCustomErrors);
app.all('*', manage404Errors); 


app.use((err,req,res,next)=>{
    console.log(err)
    res.sendStatus(500);
});























module.exports = app;