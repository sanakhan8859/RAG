const RequestLoggerMiddleware = async (req, res, next)=>{
    try{

        const httpMethod = req.method;
        const ip = req.ip
        const url = req.url

        console.log(`${httpMethod} ${url} ${ip} ${new Date()}`)

        next()

    }catch(err){
        console.log(`Error in RequestLoggerMiddleware with err : ${err}`)
        res.status(err.statusCode ? err.statusCode : 500).json({
            success : false,
            message : err.message
        })
    }
}

module.exports = {
    RequestLoggerMiddleware
}