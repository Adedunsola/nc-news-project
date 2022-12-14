const cors = require('cors')
const express = require ('express');
const app = express();
const {manage404Errors,manage400Errors,manageCustomErrors} = require('./errorhandling')
const {getApi, getTopics} = require ('./controllers/topics.controller');
const {getArticles, getArticleById,patchVotesInArticles} = require ('./controllers/article.controller');
const {getCommentsByArticleId,postComment,deleteComment} = require ('./controllers/comments.controller');
const {getUsers} = require ('./controllers/users.controller');

app.use(cors())
app.use(express.json())





//0. GET /api
app.get('/api', getApi);

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

//10. GET /api/articles?queries
//11. GET /api/articles/:article_id(comment_count)
//12. DELETE /api/comments/comment_id
app.delete('/api/comments/:comment_id', deleteComment)








//Error Handling
app.use(manage400Errors);
app.use(manageCustomErrors);
app.all('*', manage404Errors); 


app.use((err,req,res,next)=>{
    res.sendStatus(500);
});























module.exports = app;