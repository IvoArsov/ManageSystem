const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const mySql = require('mysql')
const localSignupStrategy = require('./passport/local-signup')
const localLoginStrategy = require('./passport/local-login')
const authRoutes = require('./routes/auth')
const statsRoutes = require('./routes/stats')
const firmsRoutes = require('./routes/firms')
const assignRoutes = require('./routes/assign')
const notificationsRoutes = require('./routes/notifications')
const reportsRoutes = require('./routes/reports')

const app = express()

const port = 5000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(cors())

app.use(function(req, res, next){
	global.connection = mySql.createConnection({
	  	host     : 'localhost',
		user     : 'root',
		password : 'nOvAuTh8643278Q',  
  		database : 'manage_system'
	})
	connection.connect(function(err){
    if (err) throw err
    //console.log("Connected!")
  })
	next()
});

passport.use('local-signup', localSignupStrategy)
passport.use('local-login', localLoginStrategy)

// routes
app.use('/auth', authRoutes)
app.use('/stats', statsRoutes)
app.use('/firms', firmsRoutes)
app.use('/assign', assignRoutes)
app.use('/notifications', notificationsRoutes)
app.use('/reports', reportsRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}...`)
})
