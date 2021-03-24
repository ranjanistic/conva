const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
}),fs = require("fs"),path = require("path");

console.log("Convameet Environment Setup");
console.log("Press enter to accept (default) values.\n");
readline.question("NODE_ENV: (development) ",(nodeenv)=>{
    if(!nodeenv) nodeenv = 'development';
    readline.question("CORSORIGIN: (http://localhost:3000) ",(cors)=>{
        if(!cors) cors = 'http://localhost:3000';
        readline.question("DBNAME: (convameetDB) ",(dbname)=>{
            if(!dbname) dbname = 'convameetDB';
            readline.question("DBURL [Your mongodb link]: ",(dblink)=>{
                if(!dblink) {console.log('Need your DBURL to continue. Rerun this CLI.'); process.exit(0)}
                readline.question("SESSIONKEY [Your session secret]: ",(sesskey)=>{
                    if(!sesskey) {console.log('Need your SESSIONKEY to continue. Rerun this CLI.'); process.exit(0)}
                    let final = `NODE_ENV = ${nodeenv}\nCORSORIGIN = ${cors}\nDBNAME = ${dbname}\nDBURL = ${dblink}\nSESSIONKEY = ${sesskey}`;
                    console.log('\n');
                    console.log(final,'\n');
                    readline.question("Confirm these environment variables? (y/n) ", (conf)=>{
                        if(conf.toLowerCase().trim()!=='y') {console.log("env NOT created.");process.exit(0)};
                        fs.writeFile(
                            path.join(__dirname + '/.env'),
                            final,
                            (err) => {
                              if (err) return console.log(err);
                              console.log(".env created at root. You may start the server now.");
                              process.exit(0);
                            }
                        );
                    })
                })
            })
        })
    })
})