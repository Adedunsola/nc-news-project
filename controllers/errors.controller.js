const manage404Errors = (req,res,next)=>{
    res.status(404).send({msg: 'Not Found'})
};

 


module.exports = { manage404Errors };