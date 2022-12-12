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





















