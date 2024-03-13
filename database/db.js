const mongoose = require('mongoose');
require("dotenv").config();



const connection = mongoose.connect(process.env.mongourl, { useNewUrlParser: true});

module.exports = {
    connection,
};
