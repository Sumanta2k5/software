require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
require('dotenv').config();
//m6VBMlleycoL8Lv0
//xXwrDlV1VhGRwxzo
 
const mongo_url=process.env.MONGO_CONN;

console.log("port:", process.env.PORT);
//const mongo_url = 'mongodb://localhost:27017/auth-db';

mongoose.connect(mongo_url)
.then(() => {console.log('Connected to MongoDB...')
}).catch((err) => {console.log('Error connecting to MongoDB...', err)});

module.exports = mongoose;