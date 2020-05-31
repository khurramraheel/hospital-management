
let express = require('express');

let mongoose = require('mongoose');

// let Message = require('./models/message');

mongoose.connect('mongodb://localhost/medical-app', { useNewUrlParser: true }, (err, connection) => {

    console.log(err || connection);

});


let app = express();
let User = require('./models/user');


let userController = require('./api/user');

app.use(express.json({ limit: '50mb' }));

app.use('/api/auth/', userController);


app.use((err, req, res, next) => {
    console.log(err);
});

app.listen(5000, () => {
    console.log("Server started");
});