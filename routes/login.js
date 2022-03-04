const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const {check, validationResult} = require('express-validator')

const User = require("../models/User");

//@route    GET api/login/:id
//@desc     Obtener el usuario logueado
//@acces    Private
router.get('/', (req, res) => res.json({user: "Usuario logueado"}))


//@route    POST api/login
//@desc     Autentificar el usuario y generar un token
//@acces    Public
router.post(
    '/', 
[
    check("email", "Inserta email válido").isEmail(),
    check('password', "Se requiere un pasword").exists(),
],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json(errors);
    }
    const{email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({msg: "Credenciales no válidas"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({msg: "Credenciales no válidas"});
        }
    } catch (error) {
        
    }
});

module.exports = router;