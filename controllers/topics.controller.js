
const {selectTopics} = require('../models/topics.model');
const endpoints = require('../endpoints.json')

//TOPICS CONTROLLER
exports.getApi = (req,res,next)=>{
    return res.status(200).send({endpoints});
}

exports.getTopics = (req,res,next)=>{
    selectTopics()
    .then((topics)=>{
        res.status(200).send({topics});
    })
    .catch((err)=>{
        next(err)
    }) 
};










