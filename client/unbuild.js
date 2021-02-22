const fs = require("fs"),path = require("path");
fs.rm(path.join(__dirname+'/build'), { recursive: true, force: true },(err)=>{
    console.log(err||'Build cleaned.');
    process.exit(0);
});