
const manage400Errors = (err,req,res,next)=>{
    if(err.code ==='22P02' || err.code === '23503' ||err.code ==='23502'){
      res.status(400).send({msg: 'Bad Request'})
    }else{
        next(err)
    }
}

const manageCustomErrors = (err,req,res,next)=>{
    if(err.msg && err.status){
        res.status(err.status).send({msg: err.msg});
    }else{
        next(err)
    }
}

const manage404Errors = (req,res,next)=>{
    res.status(404).send({msg: 'Not Found'})
};




module.exports = { manage404Errors, manage400Errors,manageCustomErrors };
