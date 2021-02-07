require("dotenv").config();
const env = process.env;
module.exports={
    ENV:env.NODE_ENV,
    DBURL:env.DBURL,
    DBNAME:env.DBNAME,
}