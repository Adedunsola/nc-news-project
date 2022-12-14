const db = require('../db/connection');


exports.selectTopics = ()=>{
    return db
    .query('SELECT * FROM topics;').then((result)=>{
    return result.rows;
    });
}

exports.selectArticles = ()=>{
   const queryString = 
     `SELECT articles.article_id,articles.title,articles.topic,articles.author,articles.created_at,articles.votes,count(comments.article_id=articles.article_id) AS comment_count
     FROM articles
     LEFT JOIN comments ON articles.article_id=comments.article_id
     GROUP BY articles.article_id
     ORDER BY articles.created_at desc;`
   return db
    .query(queryString).then((result)=>{
        return result.rows;
    });
}


exports.selectArticleById = (article_id) =>{
    return db
    .query(
        `SELECT * FROM articles
        WHERE article_id = $1;`,[article_id])
    .then((result)=>{
        if(result.rowCount === 0){
            return Promise.reject({ status:404, msg: 'Not Found'})
        }else{
            return result.rows;
        }
        
    });
}

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
                return exports.selectArticleById(article_id)
}).then((result)=>{
    if(result.length === 1){
        return []
    }
        return result;


})
}
exports.addComment = (newComment, article_id) =>{
    return exports.selectArticleById(article_id)
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
    .then((result)=>{
        if(result.rowCount !== 0){
            return result.rows;
        }
            return exports.selectArticleById(article_id)
})  .then((result)=>{
        if(result.length === 1){
            return []
        }
            return result
})
}





















