const express = require('express')
//const nodemailer = require('nodemailer')
const tokenSaver = require('../utilities/tokenSaver')

const router = new express.Router()

let currentCountAssigns;

router.get('/:id', (req, res, result) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        let userId = req.params.id

        let sql = `SELECT first_name, last_name, email FROM users WHERE id = ${userId}`
    
        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Nothing found!", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result, "message": "Current user data!", success: true})
              }
        })
    
        global.connection.end()
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }
})

router.get('/user/:id', (req, res, result) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        let userId = req.params.id
    
        let sql = `SELECT a.id, a.task, a.end_date, f.firm, f.id AS firm_id, a.notes, a.status, f.email FROM assigns AS a JOIN firms AS f ON a.firm_id = f.id  JOIN users AS u ON a.user_id = u.id WHERE u.id = ${userId} ORDER BY a.end_date ASC`

        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Nothing found!", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result, "message": "Current employee assigns!", success: true})
              }
        })

        global.connection.end()
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }
})

router.get('/new/firms-info', (req, res, result) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        let sql = `SELECT id, firm FROM firms`
    
        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Nothing found!", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result, "message": "Firm names and IDs delivered!", success: true})
              }
        })

        global.connection.end()
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }
})

router.post('/new/create', (req, res, result) => {    
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        if(req.body.notes === undefined){
            req.body.notes = ''
        }
        
        let sql = `INSERT INTO assigns (user_id, firm_id, task, create_date, end_date, notes, status) VALUES(${req.body.employeeAssign}, ${req.body.firmAssign}, "${req.body.task}", NOW(), "${req.body.endDate}", "${req.body.notes}", "open")`
    
        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Error! assign", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result, "message": "New assign to employee!", success: true})
              }
        })
    
        global.connection.end()

        //let tranporter = nodemailer.createTransport({
        //    service: 'gmail',
        //    auth: {
        //      user: 'arsov.ivaylo@gmail.com',
        //      pass: 'arthas87'
        //    }
        //})
//
        //let mailOptions = {
        //    from: 'arsov.ivaylo@gmail.com',
        //    to: 'arthasiv@gmail.com',
        //    subject: 'Sending Email using Node.js',
        //    text: 'You have new notification! Please check site!'
        //}
//
        //tranporter.sendMail(mailOptions,(error, info) =>{
        //    if (error) {
        //      console.log(error);
        //    } else {
        //      console.log('Email sent: ' + info.response);
        //    }
        //})
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }
})

router.get('/find/:id', (req, res, result) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        let assignId = req.params.id

        let sql = `SELECT a.task, a.end_date, a.notes, a.status, a.user_id, f.firm FROM assigns AS a JOIN firms AS f ON a.firm_id = f.id WHERE a.id = ${assignId}`

        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Error!", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result[0], "message": "Assign data delivered!", success: true})            
              }          
        })

        global.connection.end()
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }
})

router.post('/edit/:id', (req, res, result) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        let assignId = req.params.id

        let sql = `UPDATE assigns SET task = "${req.body.task}", end_date = "${req.body.endDate}", notes = "${req.body.notes}", status = "${req.body.status}" WHERE id = ${assignId}`

        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Error!", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result, "message": "Assign edited succesful!", success: true})            
              }          
        })

        global.connection.end()
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }
})

router.delete('/delete/:id', (req, res, result) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        let assignId = req.params.id

        let sql = `DELETE FROM assigns WHERE id=${assignId}`

        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "You have undeleted report or notification for this assign! Cannot delete!", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result, "message": "Assign deleted succesful!", success: true})            
              }          
        })

        global.connection.end()
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }
})

router.get('/1/all', (req, res, result) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        let sql = 'SELECT a.id AS assign_id, u.id AS user_id, f.id AS firm_id, a.task, a.end_date, a.status, a.notes, u.first_name, u.last_name, u.username, u.email AS user_email, f.firm FROM assigns AS a JOIN firms AS f ON a.firm_id = f.id JOIN users AS u ON a.user_id = u.id ORDER BY a.end_date ASC'

        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Error!", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result, "message": "All assigns data received!", success: true})            
              }          
        })

        global.connection.end()
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }
})

router.get('/profile/:id', (req, res, result) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        let assignId = req.params.id
    
        let sql = `SELECT a.id AS assign_id, a.end_date, a.task, a.status, a.notes AS assign_notes, f.id AS firm_id, f.firm, f.email AS firm_email, f.contact_person, f.contacts, f.comments AS firm_notes, u.id AS user_id, u.first_name, u.last_name, u.username, u.role, u.email AS employee_email FROM assigns AS a JOIN firms AS f ON a.firm_id = f.id JOIN users AS u ON a.user_id = u.id WHERE a.id = ${assignId}`

        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Error!", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result[0], "message": "Assign profile data received!", success: true})            
              }          
        })

        global.connection.end()
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }
})

router.get('/1/activities', (req, res, result) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        let sql = `SELECT a.id AS assign_id, a.task, a.create_date, a.end_date, u.id AS user_id, u.email AS user_email, CONCAT(u.first_name, " ", u.last_name) AS user_full_name, u.username, f.id AS firm_id, f.email AS firm_email, f.firm FROM assigns AS a JOIN users AS u ON a.user_id = u.id JOIN firms AS f ON a.firm_id = f.id ORDER BY a.end_date ASC`

        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Error!", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result, "message": "Activities received!", success: true})            
              }          
        })

        global.connection.end()
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }
})

router.get('/1/activities/:id', (req, res, result) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        let userId = req.params.id

        let sql = `SELECT a.id AS assign_id, a.task, a.create_date, a.end_date, u.id AS user_id, u.email AS user_email, CONCAT(u.first_name, " ", u.last_name) AS user_full_name, u.username, f.id AS firm_id, f.firm FROM assigns AS a JOIN users AS u ON a.user_id = u.id JOIN firms AS f ON a.firm_id = f.id  WHERE u.id = ${userId} ORDER BY a.end_date ASC `

        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Error!", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result, "message": "Activities for current user received!", success: true})            
              }          
        })

        global.connection.end()
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }
})

module.exports = router