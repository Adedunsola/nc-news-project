// const manageCustomError = (err,req,res,next) => {
//     if(err.msg && err.status){
//         res.staus(err.status).send({msg: err.msg})
//     }else{
//         next(err)
//     }
// };


const manage404Errors = (req,res,next)=>{
    res.status(404).send({msg: 'Not Found'})
};




module.exports = {manage404Errors};