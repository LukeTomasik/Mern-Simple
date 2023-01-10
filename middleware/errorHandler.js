const { logEvents } = require('./logger')

const errorHandler = (err,req, res, next) => {
    // creates a log for all error
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    // lots of details for error and why it happened 
    console.log(err.stack)
    const status = res.statusCode ? res.statusCode : 500 // server error code
    res.status(status)
    res.json({message: err.message})
}

module.exports = errorHandler