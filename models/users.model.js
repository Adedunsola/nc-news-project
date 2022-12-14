const db = require('../db/connection');

//USERS ENDPOINT
exports.selectUsers=()=>{
    return db
    .query(`
    SELECT * FROM users`)
    .then((result)=>{
        return result.rows;
    })
}

