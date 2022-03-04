const express = require ('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require("../middleware/auth");
const  config = require('config');
const {check, validationResult} = require('express-validator')

const User = require("../models/User")
//@route POST api/users
//@desc Registra un nuevo usuario
//@access Public
router.post('/', [
                    check('name', 'El nombre es requerido').not().isEmpty(),
                    check('email', 'Por favor incluye un email válido').isEmail(),
                    check('password', 'El password debe tener más de 6 dígitos').isLength({min: 6})
                ],async (req,res) => {
    //Validar los datos

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }
    //Mirar si el usuario existe
    const {name, email, password} = req.body;
        try {
            let user = await User.findOne({email});
            if (user){
                return res.status(400).json({msg: 'El usuario ya existe'})
            }
            user = new User({
            name,
            email, 
            password
        });
        //Encriptar el password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
       
        await user.save();

        //Generamos un token JWT y lo enviamos
        const payload = {user: {id: user.id}};
        jwt.sign(
            payload, 
            config.get("jwtSecret"),
            {expiresIn: 3600}, 
            (err, token) => {
            if (err) throw err ;
            res.json({token}); 
        }); //Caducará en una hora

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error en el servidor")
    }

});

module.exports = router;