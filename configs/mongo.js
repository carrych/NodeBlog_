var mongoose = require('mongoose');
var assert = require('assert');

const dbURI = 'mongodb+srv://carryCh:q1w2e3r4t5y6@cluster0-lmq5x.mongodb.net/test?retryWrites=true&w=majority';
var dbOptions = {
    user: 'carryCh',
    pass: 'q1w2e3r4t5y6',
    useNewUrlParser: true
};

mongoose.connect(dbURI, dbOptions, function (err) {
    assert.equal(null, err);
});

mongoose.connection.on('connected', () => {
    console.info(`Mongoose connected to: ${dbURI}`);
});

mongoose.connection.on('error', () => {
    console.info(`Mongoose connection fail`);
});

module.exports = mongoose;