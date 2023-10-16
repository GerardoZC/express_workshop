const express = require('express');
const user = express.Router();
const db = require('../config/database');
const jwt = require('jsonwebtoken')

user.post("/singin", async(req, res, next) => {
    const {user_name, user_mail, user_password} = req.body

    if(user_name && user_mail && user_password) {
        let query = "INSERT INTO users(users_name, users_mail, users_password) ";
        query += `VALUES ('${user_name}', '${user_mail}', '${user_password}')`;
        const rows = await db.query(query);
    
        if(rows.affectedRows == 1) {
            return res.status(201).json({code: 201, message: "Usuario registrado correctamente"});
        }
        return res.status(500).json({code: 500, message: "Ocurrio un error"})
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"})
});

user.post("/login", async(req, res, next) => {
    const {users_mail, users_password} =req.body
    const query = `SELECT * FROM users WHERE users_mail = '${users_mail}' AND users_password = '${users_password}';`;
    const rows = await db.query(query);
    console.log(rows);

    if(users_mail && users_password) {
        if (rows.length == 1) {
            const token = jwt.sign({
                users_id: rows[0].users_id,
                users_mail: rows[0].users_mail
            }, 'debugkey');
            return res.status(200).json({code: 200, message: token});
        }
        else {
            return res.status(200).json({code: 200, message: "Usuario o contrasenia incorrectos"});
        }
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"});

});

user.get("/", async(req, res, next) => {
    const query = "SELECT * FROM users";
    const rows = await db.query(query);
    return res.status(200).json({code: 200, message: rows})
});

module.exports = user;