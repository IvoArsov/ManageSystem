const express = require('express')
const formidable = require('formidable')
const XLSX = require('xlsx')
const authCheck = require('../middleware/auth-check')
const tokenSaver = require('../utilities/tokenSaver')

const router = new express.Router()

router.post('/add', (req, res, next) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        if(req.body.uniqueIdentifier === undefined){
            req.body.uniqueIdentifier = ''
        }
        if(req.body.address === undefined){
            req.body.address = ''
        }
        if(req.body.contactPerson === undefined){
            req.body.contactPerson = ''
        }
        if(req.body.contacts === undefined){
            req.body.contacts = ''
        }
        if(req.body.website === undefined){
            req.body.website = ''
        }
        if(req.body.email === undefined){
            req.body.email = ''
        }
        if(req.body.fieldOfWork === undefined){
            req.body.fieldOfWork = ''
        }
        if(req.body.comments === undefined){
            req.body.comments = ''
        }
        if(req.body.town === undefined){
            req.body.town = ''
        }
    
        let sql = `INSERT INTO firms(created_on, modified_on, firm, unique_identifier, address, contact_person, contacts, website, email, town, field_of_work, comments, user_id) VALUES (NOW(), NOW(), "${req.body.firm}", "${req.body.uniqueIdentifier}", "${req.body.address}", "${req.body.contactPerson}", "${req.body.contacts}", "${req.body.website}" ,"${req.body.email}", "${req.body.town}" ,"${req.body.fieldOfWork}", "${req.body.comments}", ${req.body.userId})`
    
        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Wrong Form", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result, "message": "Firm Added Successful", success: true})
              } 
        })
    
        global.connection.end()
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }


    

})

router.post('/add/xlsx', (req, res, result) => {
    //console.log(req)
    let form = new formidable.IncomingForm()
    form.parse(req,(err, fields, files) => {
        let f = files[Object.keys(files)[0]] 
	    let workbook = XLSX.readFile(f.path)

        console.log(workbook)/////////////////////////////not work
      });
})

router.get('/all', (req, res, next) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        //let sql = `SELECT f.id, f.firm, f.unique_identifier, f.address, f.contact_person, f.contacts, f.website, f.email, f.field_of_work, f.comments, u.username, u.id AS user_id, f.user_id AS owner_id FROM firms AS f JOIN users AS u ON f.user_id = u.id ORDER BY f.modified_on DESC`
        let sql = `SELECT id, firm FROM firms ORDER BY modified_on DESC`

        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Wrong Form", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result, success: true})
              }
        })

        global.connection.end()
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }    

})

router.get('/:id', (req, res, next) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        let firmId = req.params.id

        let sql = `SELECT firm, unique_identifier, address, contact_person, contacts, website, email, town, field_of_work, comments FROM firms WHERE id = ${firmId}`
        
        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Wrong Form", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result[0], success: true})
              }
        })
    
        global.connection.end()
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }
})

router.post('/edit/:id', (req, res, next) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        let firmId = req.params.id

        let sql = `UPDATE firms SET modified_on=NOW(), firm="${req.body.firm}", unique_identifier="${req.body.uniqueIdentifier}", address="${req.body.address}", contact_person="${req.body.contactPerson}", contacts="${req.body.contacts}", website="${req.body.website}", email="${req.body.email}", town="${req.body.town}", field_of_work="${req.body.fieldOfWork}", comments="${req.body.comments}" WHERE id=${req.body.id}`
    
        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Wrong Form", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result[0], "message": "Edit Successful!", success: true})
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
        let firmId = req.params.id

        let sql = `DELETE FROM firms WHERE id = ${firmId}`

        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "This firm have active assigns! Cannot delete!", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result[0], "message": "Delete Successful!", success: true})
              }
        })

        global.connection.end()
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }
})

router.get('/mine/:id', (req, res, result) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        let userId = req.params.id
    
        let sql = `SELECT f.id, f.firm, f.unique_identifier, f.address, f.contact_person, f.contacts, f.website, f.email, f.field_of_work, f.comments, u.first_name, u.last_name FROM firms AS f JOIN users AS u ON f.user_id = u.id WHERE f.user_id = ${userId}`

        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Wrong Form", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result, "message": "User profile data here!", success: true})
              }
        })

        global.connection.end()
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }
})

router.post('/search', (req, res, result) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        let searchParam = req.body.param
        let type = req.body.type
        let sql = ''

        if(type === 'byFirm' || type === undefined){
            sql = `SELECT f.id, f.firm, f.unique_identifier, f.address, f.contact_person, f.contacts, f.website, f.email, f.field_of_work, f.comments, u.username FROM firms AS f JOIN users AS u ON f.user_id = u.id WHERE f.firm LIKE '%${searchParam}%'`
        } else if(type === 'byEmployee'){
            sql = `SELECT f.id, f.firm, f.unique_identifier, f.address, f.contact_person, f.contacts, f.website, f.email, f.field_of_work, f.comments, u.username FROM firms AS f JOIN users AS u ON f.user_id = u.id WHERE u.username LIKE '%${searchParam}%'`
        }    

        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Nothing found!", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result, "message": `Search successful!`, success: true})
              }
        })

        global.connection.end()
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }
})

router.get('/assigns/:id', (req, res, result) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        let firmId = req.params.id
    
        let sql = `SELECT a.id AS assign_id, a.task, a.end_date, a.notes, a.status, u.first_name, u.last_name, u.email AS user_email, u.id AS user_id, f.email AS firm_email, f.id AS firm_id FROM assigns AS a JOIN users AS u ON a.user_id = u.id JOIN firms AS f ON a.firm_id = f.id WHERE f.id = ${firmId} ORDER BY a.end_date ASC`

        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Nothing found!", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result, "message": `Assigns for firm!`, success: true})
              }
        })

        global.connection.end()
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }
})

router.get('/1/noAssign', (req, res, result) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        let sql = `SELECT f.id AS firm_id , f.firm, f.unique_identifier, f.address, f.contacts, f.website, CONCAT(u.first_name, " ", u.last_name) AS employee, u.id AS user_id, f.email, f.contact_person, f.field_of_work, f.comments FROM firms AS f JOIN users AS u ON f.user_id = u.id LEFT JOIN assigns AS a ON a.firm_id = f.id WHERE a.task IS NULL`

        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Nothing found!", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result, "message": "Firms without assigns!", success: true})
              }
        })
    
        global.connection.end()
    } else {
        res.send({"status": 200, "error": "Not autorized!", "response": null, "message": "Not autorized!", success: false})
    }
})

router.get('/1/withAssign', (req, res, result) => {
    let authToken = tokenSaver.getToken()
    if(req.headers.authorization === authToken){
        let sql = `SELECT f.id AS firm_id , f.firm, f.unique_identifier, f.address, f.contacts, f.website, CONCAT(u.first_name, " ", u.last_name) AS employee, u.id AS user_id, f.email, f.contact_person, f.field_of_work, f.comments FROM firms AS f JOIN users AS u ON f.user_id = u.id LEFT JOIN assigns AS a ON a.firm_id = f.id WHERE a.task IS NOT NULL GROUP BY f.id`

        global.connection.query(sql, (err, result, fields) => {
            if (err){
                res.send({"status": 200, "error": err.sqlMessage, "response": null, "message": "Nothing found!", success: false})
              } else{ 
                res.send({"status": 200, "error": null, "response": result, "message": "Firms with assigns!", success: true})
              }
        })

        global.connection.end()
    } else{
        res.send({"status": 200, "error": "Not authorized!", "response": null, "message": "Not authorized!", success: false})
    }
})

module.exports = router