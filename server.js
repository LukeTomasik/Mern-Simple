const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500

const { logger } = require('./middleware/logger')
const  errorHandler  = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')


app.use(logger)
app.use(express.json())
app.use(cookieParser())
//allows us to store images and for our server for STATIC files AKA "assets folder"
// app.use( express.static('public')) also works
app.use('/', express.static(path.join(__dirname,'/public')))

app.use('/', require('./routes/root'))

// catch all that goes to our site
app.all('*', (req,res) => {
    res.status(404)
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({message: '404 Not Found'})
    } else {
        res.type('txt'.send('404 Not Found'))
    }

})

app.use(errorHandler)
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
