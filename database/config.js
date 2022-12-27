const mongoose = require('mongoose');  //como el import
const dbConnection = async() => {

    try {
        await mongoose.connect( 'mongodb+srv://mean_user:qoUjpWmvZ0r01zPK@cluster0.5cdmxly.mongodb.net/hospitaldb' , {
           
        });
        console.log('DB Online');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD ver logs');
    }
}
module.exports={
    dbConnection
}