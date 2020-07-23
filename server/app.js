
let express = require('express');

let mongoose = require('mongoose');
let Message = require('./models/messageList');

// let io = require("socket.io");


// let Message = require('./models/message');

mongoose.connect('mongodb://localhost/medical-app', { useNewUrlParser: true }, (err, connection) => {
    console.log(err || connection);
});

const app = express();
var socketioJwt = require("socketio-jwt");

const server = require('http').Server(app);

let io = require('socket.io')(server);

io.eio.pingTimeout = 25000;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.header('origin'));
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

let liveSockets = {};

io.sockets.on('connection', socketioJwt.authorize({
    secret: "123456",
    timeout: 65000 // 15 seconds to send the authentication message
}))
    .on('authenticated', (socket) => {

        socket.on('join_chat', (data) => {

            liveSockets[data.userID] = {
                socket: socket.id,
                userID: data.userID
            };

            console.log(data.type + ' socket connected');

        });

        socket.on('update_read', (data) => {

            try {
                // Message.findByIdAndUpdate(data._id, { $push: { readBy: data.userID } }, { new: true }, (err, message) => {
                Message.findByIdAndUpdate(data._id, { $addToSet: { readBy: data.userID } }, { new: true }, (err, message) => {

                    socket.emit('message_read', { pID: data.pID, ...message.toJSON() });

                });


            } catch (e) {

                // socket.emit('message')
                console.log(e.message)

            }

        });

        socket.on('sent_message_all', async (data) => {

            data.readByAdmin = false;

            let message = new Message(data);

            message.readBy = [data.author];

            await message.save();

            let cMessage = message.toJSON();

            socket.emit('sent_mess_pro_members', cMessage);


            for (let item in liveSockets) {
                if (item == cMessage.receiver) {
                    if (io.sockets.connected[liveSockets[item].socket]) {
                        io.sockets.connected[liveSockets[item].socket].emit('sent_mess_pro_members', cMessage);
                    }
                }
            }





        });

    });

// let app = express();
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

app.use(express.static('./build'));

server.listen(process.env.PORT || 5000, () => {
    console.log("Server started");
});