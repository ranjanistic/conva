require("dotenv").config();
const env = process.env;
module.exports={
    ENV:env.NODE_ENV,
    DBURL:env.DBURL,
    DBNAME:env.DBNAME,
    SESSIONKEY:env.SESSIONKEY,
    CORSORIGINS:[env.CORSORIGIN,"http://localhost:3000"],
    CORSBETA:/^((https):\/\/)(convameet--beta)+\-[a-z0-9A-Z\-]+\.(web.app)/
}