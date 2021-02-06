
class AuthUser {

    checkPass =  (password)=>{
        console.log("checking password");
        let passRe = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}$/;
        return passRe.test(password);
    };

    checkEmail = (email)=>{
        console.log("checking email");
        let userRE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
        return email.length>4 && userRE.test(email);
    };
    checkName = (name)=>{
        console.log("checking name");
        let  nameRe  = /[A-Za-z]{2,100}/;

        return nameRe.test(name);
    };

    validateUser = (data = {email,password,name})=>{
        return this.checkEmail(data.email) && this.checkName(data.name) && this.checkPass(data.password);
    };

    validateLogin =  (data = {email,pasword})=>{
        return this.checkEmail(data.email) && data.password.length;
    };
};

module.exports = new AuthUser();

