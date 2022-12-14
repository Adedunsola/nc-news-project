const db = require('../db/connection');
const {selectArticleById} = require('../models/article.model')

//COMMENTS ENDPOINT
exports.selectCommentsByArticleId = (article_id) =>{
    return db
    .query(
        `SELECT comment_id,body,votes,author,created_at FROM comments 
        WHERE article_id = $1 
        ORDER BY created_at desc;`, [article_id])
        .then((result)=>{
            if(result.rowCount !== 0){
                return result.rows
            }
                return selectArticleById(article_id)
}).then((result)=>{
    if(result.length === 1){
        return []
    }
        return result;


})
}
exports.addComment = (newComment, article_id) =>{
    return selectArticleById(article_id)
    .then((result)=>{
        if(result.length === 1){
            const {username,body} = newComment
            return db
            .query(
               `INSERT INTO comments
                (author,body,article_id)
                VALUES
                ($1,$2,$3)
                RETURNING *;`,[username,body,article_id])
            .then((result)=>{
                return  result.rows;
            })
        }
    })
}
