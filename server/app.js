
let express = require('express');

let mongoose = require('mongoose');

// let Message = require('./models/message');

mongoose.connect('mongodb://localhost/medical-app', { useNewUrlParser: true }, (err, connection) => {

    console.log(err || connection);

});


let app = express();
let User = require('./models/user');


let userController = require('./api/user');
let categController = require('./api/category');
let scheduleController = require('./api/schedule');

app.use(express.json({ limit: '50mb' }));

app.use('/api/auth/', userController);
app.use('/api/category/', categController);
app.use('/api/schedule/', scheduleController);


app.use((err, req, res, next) => {
    console.log(err);
});

app.listen(5000, () => {
    console.log("Server started");
});