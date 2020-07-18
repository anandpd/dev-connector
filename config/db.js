const mongoose = require("mongoose"),
    config = require('config'),
    db = config.get('mongoURI')

const connectMongoDb = async () => {
    try {
        await mongoose.connect(db,
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true
            });
        console.log('Mongo Db Connected Successfully :)');
        
    } catch (error) {return error}
}

module.exports = connectMongoDb;