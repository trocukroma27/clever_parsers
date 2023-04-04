
const dotenv = require('dotenv');

dotenv.config({path: ".env.dev"});
// dotenv.config({path: ".env.test"});
// dotenv.config({path: ".env.prod"});

module.exports = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
};