const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
    }
});

const document = mongoose.model('document', documentSchema);

module.exports = document;
