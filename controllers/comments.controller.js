const {selectCommentsByArticleId, addComment, removeComment} = require('../models/comments.model');


//COMMENTS CONTROLLER
exports.getCommentsByArticleId = (req,res,next)=>{
    const {article_id} = req.params
    selectCommentsByArticleId(article_id)
    .then((comments)=>{
        res.status(200).send({comments})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.postComment =(req,res,next)=>{
    const {article_id} = req.params
    addComment(req.body,article_id).then((comment)=>{
        res.status(201).send({comment})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.deleteComment=(req,res,next)=>{
    const {comment_id} = req.params
    removeComment(comment_id)
    .then((comment)=>{
        res.status(204).send('No content')
    })
    .catch((err)=>{
        next(err)
    })
}