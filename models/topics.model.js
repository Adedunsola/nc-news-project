const db = require('../db/connection');


//TOPICS ENDPOINT
exports.selectTopics = ()=>{
    return db
    .query('SELECT * FROM topics;').then((result)=>{
    return result.rows;
    });
}

