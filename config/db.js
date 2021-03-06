const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () =>{
    try {
        await mongoose.connect(db);
    } catch (error) {
        console.error(error.message);
        //Salir del proceso
        process.exit(1);
    }
}

module.exports = connectDB;