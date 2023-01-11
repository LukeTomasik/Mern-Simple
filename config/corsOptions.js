const allowedOrigins = require('./allowedOrigins')

// enables cors policy to only listen to our origins
const corsOptions = {
    origin: (origin, callback) => {
        // will check if the origin originates in our array if not then or will allow all
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null,true)
        } else {
            callback(new Error('Not Allowed by CORS'))
        }
    },
    credentials: true, 
    optionsSuccessStatus: 200
}

module.exports = corsOptions