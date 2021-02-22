require("dotenv").config();
const env = process.env;
module.exports={
    ENV:env.NODE_ENV,
    DBURL:env.DBURL,
    DBNAME:env.DBNAME,
    CORSORIGIN:env.CORSORIGIN,
    CORSBETA:/^((https):\/\/)(convameet--beta)+\-[a-z0-9A-Z\-]+\.(web.app)/
}