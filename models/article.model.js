const db = require('../db/connection');



//ARTICLES ENDPOINT
exports.selectArticles = (topicQuery,sort_by ='created_at',order = 'desc')=>{
    validSortByQueries = ['title','topic','author','created_at','votes','comment_count'];
    validOrderByQueries = ['asc','desc']
    
    if(!validSortByQueries.includes(sort_by) || !validOrderByQueries.includes(order)){
        return Promise.reject({ status:400, msg: 'Bad Request'})
    }
    const queryString = 
     `SELECT articles.article_id,articles.title,articles.topic,articles.author,articles.created_at,articles.votes,count(comments.article_id=articles.article_id) AS comment_count
     FROM articles
     LEFT JOIN comments ON articles.article_id=comments.article_id
     GROUP BY articles.article_id 
     ORDER BY ${sort_by} ${order};`;
    
    return db
    .query(queryString).then((result)=>{
        const allArticles = result.rows

        if(topicQuery == undefined){
        return allArticles;
    }else{
        const relevantArticles =  allArticles.filter(function(eachArticle){
        return eachArticle.topic == topicQuery; 
       
        }) 
       if(relevantArticles.length === 0){
        return Promise.reject({ status:404, msg: 'Topic Not Found'})
       }
        return relevantArticles; 
        
}});
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
exports.updateVotesInArticles = (inc_votes,article_id)=>{
    return db
    .query(`
     UPDATE articles
     SET votes = votes + $1
     WHERE article_id = $2
     RETURNING *;`,[inc_votes,article_id])
    .then((result)=>{
        if(result.rowCount !== 0){
            return result.rows
        }else{
            return Promise.reject({ status:404, msg: 'Article Not Found'})  
        } 
    })
} 


 