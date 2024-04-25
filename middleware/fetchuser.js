const jwt  = require("jsonwebtoken")
const JWT_SECRET = "SyedEhsanIsACricketer";

const fetchuser = (req,res,next)=>{

    const token = req.header('auth-token');
    if(!token){
        return res.send(401).send({error:'Please Authenticate Using Valid Token'})
    
    }
    try {
        
    const data = jwt.verify(token,JWT_SECRET)
    req.user = data.user;
    next()
    } catch (error) {
        res.status(401).send({error:"Please Authenticate Using Valid Token"})
    }
}

module.exports = fetchuser;