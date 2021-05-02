require("dotenv").config();
const env = process.env;
module.exports={
    ENV:env.NODE_ENV,
    DBURL:env.DBURL,
    DBNAME:env.DBNAME,
    SESSIONKEY:env.SESSIONKEY,
    MAILHOST:env.MAILHOST,
    MAILPORT:Number(env.MAILPORT),
    MAILUSER:env.MAILUSER,
    MAILPASS:env.MAILPASS,
    CORSORIGINS:[env.CORSORIGIN,"http://localhost:3000"],
    CORSBETA:/^((https):\/\/)(convameet--beta)+\-[a-z0-9A-Z\-]+\.(web.app)/
}