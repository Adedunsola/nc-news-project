const {selectTopics,selectArticles} = require('../models/news.model');


exports.getMessage = (req,res,next)=>{
    const msg = 'OK';
    return res.status(200).send(msg);
};

exports.getTopics = (req,res,next)=>{
    selectTopics()
    .then((topics)=>{
        res.status(200).send({topics});
    })
    .catch((err)=>{
        next(err)
    }) 
};

exports.getArticles =(req,res,next)=>{
    selectArticles()
    .then((articles)=>{
        res.status(200).send({articles})
    })
    .catch((err)=>{
        next(err)
    })
}










