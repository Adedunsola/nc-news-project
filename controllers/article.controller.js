const {selectArticles, selectArticleById, updateVotesInArticles} = require('../models/article.model');

//ARTICLES CONTROLLER

exports.getArticles =(req,res,next)=>{
    const topicQuery = req.query.topic
    selectArticles(topicQuery)
    .then((articles)=>{
        res.status(200).send({articles})
    })
    .catch((err)=>{
        next(err)
    })
};

exports.getArticleById = (req,res,next)=>{
    const {article_id} = req.params
    selectArticleById(article_id)
    .then((article)=>{
        res.status(200).send({article})
    })
    .catch((err)=>{
        next(err)
    })
};

exports.patchVotesInArticles =(req,res,next)=>{
    const {article_id} = req.params
    const {inc_votes} = req.body
   updateVotesInArticles(inc_votes,article_id).then((article)=>{
        res.status(200).send({article})
    })
    .catch((err)=>{
        next(err)
    })
}

