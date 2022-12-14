
const {selectTopics} = require('../models/topics.model');


//TOPICS CONTROLLER
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










