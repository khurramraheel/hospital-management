

let express = require('express');

let router = express();
let User = require('./../models/user');
// let Message = require('./../models/message');
var jwtSimple = require('jwt-simple');

let Appointment = require('./../models/appointment');

let moment = require('moment');

// let Order = require('./../models/order');
let Category = require('./../models/category');

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

let nodemailer = require('nodemailer');

// let liveSockets = reqyure('./liveSockets');

router.get('/session', async (req, res) => {

    // let data = decodeJSONToken(req.headers.authorization);

    try {
        let decoded = jwt.verify(req.headers.authorization.split(' ')[1], '123456');

        let user = await User.findById(decoded.user.id).populate('category').exec();

        // await user.populate('gigs').execPopulate();

        // await user.populate('orders').execPopulate();
        // await user.populate('orders.gig').execPopulate();
        // await user.populate('orders.customer').execPopulate();

        // let sellerOrders = await Order.find({ owner: user._id }).populate('customer gig');
        // sellerOrders.populate('customer').execPopulate();
        // sellerOrders.populate('gig').execPopulate();

        // user.orders.populate('customer').execPopulate();
        // user.orders.populate('gig').execPopulate();


        user = user.toJSON();

        let pending = [];
        let categories = [];
        let appointments = [];

        let users = [];
        categories = await Category.find({});

        categories = await Promise.all(categories.map(async (category) => {

            category = category.toJSON();
            let currentAppointments = await Appointment.find({ category: category._id, status: 'confirmed' });
            category.appointments = currentAppointments.length;

            return category;

        }));

        if (user.type == "doctor") {
            appointments = await Appointment.find({ doctor: user._id }).populate('patient').exec();
        } else if (user.type == 'patient') {
            appointments = await Appointment.find({ patient: user._id }).populate('doctor').exec();
        } else if (user.type == 'admin') {
            users = await User.find({ type: { $ne: "admin" } }).populate('category').exec();
        }

        const payload = {
            user: {
                id: user._id,
            }
        };

        jwt.sign(payload, '123456',
            { expiresIn: 360000 }
            , (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    success: true,
                    user: user,
                    appointments,
                    categories,
                    // sellerOrders: sellerOrders,
                    // pending,
                    // active,
                    users
                })
            }
        );

        // res.json({
        //     success: true,
        //     loggedInUser: user
        // });
    } catch (e) {

        res.json({
            success: false,
                
        });

    }
    // if (Date.now() >= data.exp * 1000) {
    //     return false;
    //   }

});


router.post('/get_user', async (req, res) => {

    try {
        let user = await User.findById(req.body.providerID).select('-password');
        let gigs = await Gig.find({ userID: req.body.providerID });

        let messages = await Message.find({
            $or: [
                { to: req.body.client, from: req.body.providerID },
                { to: req.body.providerID, from: req.body.client }
            ]
        });
        res.json({
            success: true,
            currentUser: user,
            gigs,
            messageList: messages
        })
    } catch (e) {
        res.send(500, { error: e.message });
    }

});

let extra = require('./../extras');


router.post('/updatePassword', async (req, res) => {

    let token = jwtSimple.decode(req.body.token, "123456");

    try {

        var duration = moment.duration(moment(new Date()).diff(new Date(token.date)));
        var hours = duration.asHours();

        if (hours <= 2) {

            const salt = await bcrypt.genSalt(10);
            let user = await User.findById(token.userID).select('-password');


            user.password = await bcrypt.hash(req.body.password, salt);
            await user.save();
            res.json({
                success: true,
                message: "Password updated successfully"
            });

        } else {
            res.json({
                success: false,
                error: "Reset token expired!, please get a new one!"
            });
            return;
        }



    } catch (err) {
        res.json({
            success: false,
            error: err.message
        });
    }


});

router.post('/sendmessage', async (req, res) => {

    extra.sendEmail({
        email: req.body.email,
        subject: "You have unread messages from " + req.body.name,
        html: '<table>\
                    <tr><td>Name</td><td>'+ req.body.name + '</td></tr>\
                    <tr><td>Email</td><td>'+ req.body.email + '</td></tr>\
                    <tr><td>Subject</td><td>'+ req.body.subject + '</td></tr>\
                    <tr><td>Message</td><td>'+ req.body.yourmessage + '</td></tr>\
              </table>'
    });

    res.json({
        success: true
    });

});

router.get('/requestpasssword', async (req, res) => {

    let user;

    try {

        user = await User.findOne({ email: req.query.email });

        if (!user) {


            res.json({
                success: false,
                error: 'Not account found associated with this email'
            });
            return;
            // }
        }

    } catch (err) {

        res.json({
            success: false,
            error: 'Oops, your password cannot be requested right now!'
        });

        return;
    }


    var payload = { date: Date.now(), userID: user._id };

    user.passToken = jwtSimple.encode(payload, "123456");

    try {

        await user.save();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "mc180201340@vu.edu.pk", // generated ethereal user
                pass: "1234567A@" // generated ethereal password
            }
        });

        try {
            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: 'Delivery App', // sender address
                to: req.query.email, // list of receivers
                subject: "Dear user, we have just received a new pasword request for your GSP account assoicated with this email.", // Subject line
                // text: "", // plain text body
                html: "<a href='" + (req.protocol + '://' + req.host + '/resetpassword/' + user.passToken) + "'>Please click here to reset your password</a>" // html body
            });
            res.json({
                success: true,
                error: 'Dear user, please check your email!'
            });

        } catch (err) {

            res.json({
                success: false,
                error: 'Oops, your password cannot be requested right now!'
            });
        }


    } catch (err) {

        res.json({
            success: false,
            error: 'Oops, your password cannot be requested right now!'
        });

    }



});


router.post('/updateAccount', async (req, res) => {

    try {

        let user = await User.findByIdAndUpdate(req.body.id, { status: req.body.status });

        extra.sendEmail({
            email: user.email,
            subject: "Account Activation Notification",
            html: "Dear, <strong>" + user.name + "</strong>, please be informed that your account's status has been changed to  <strong>" + req.body.status + "</strong>"
        });

        res.json(
            {
                user: user,
                success: true
            }
        );

    } catch (e) {

        res.send(500, { error: e.message });

    }

});

router.post('/login', async (req, res) => {
    // console.log(req.body);
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }
    const { email, password } = req.body;
    try {
        //see if user exists
        let user = await User.findOne({ email }).populate('category').exec();

        if (!user) {
            return res.status(400).json({ error: "Invalid Credentials" })
        }

        // await user.populate('orders').execPopulate();
        // await user.populate('orders.gig').execPopulate();
        // await user.populate('orders.customer').execPopulate();


        // bcrypt has a method which takes in a text password 
        // and a encrypted password and tell you if they match................. compare returns a promise
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: "Invalid Credentials" })

        }

        if (user.status == "unactive") {
            return res.status(400).json({ error: "Dear " + user.name + ", your account has been deactivated, please call 1122 for re-activation" });
        }

        // let sellerOrders = await Order.find({ owner: user._id }).populate('customer gig');

        // await sellerOrders.populate('customer').execPopulate();
        // await sellerOrders.populate('gig').execPopulate();

        let categories = [];
        let appointments = [];
        let users = [];
        categories = await Category.find({});

        categories = await Promise.all(categories.map(async (category) => {

            category = category.toJSON();
            let currentAppointments = await Appointment.find({ category: category._id, status: 'confirmed' });
            category.appointments = currentAppointments.length;

            return category;

        }));

        if (user.type == 'doctor') {
            appointments = await Appointment.find({ doctor: user._id }).populate('patient').exec();;
        } else if (user.type == 'patient') {
            appointments = await Appointment.find({ patient: user._id }).populate('doctor').exec();;
        } else if (user.type == 'admin') {
            users = await User.find({ type: { $ne: "admin" } }).populate('category').exec();
        }

        // if (user.type == "admin") {
        //     pending = await Gig.find({ status: "pending" }).populate('userID').exec();
        //     active = await Gig.find({ status: "approved" }).populate('userID').exec();
        //     users = await User.find({ type: { $ne: "admin" } }).populate('userID').exec();
        // }

        //Return jasonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        cUser = user.toJSON();

        delete cUser.password;

        jwt.sign(payload, "123456",
            {
                expiresIn: 36000
            }, (err, token) => {
                if (err) throw err;

                res.json({
                    loggedUser: cUser,
                    success: true,
                    token,
                    appointments: appointments,
                    categories,
                    // sellerOrders, 
                    // pending: pending, 
                    // active: active, 
                    users: users
                })
            });




    } catch (err) {
        console.error(err);
        res.status(500).send("Authentication-Server error");

    }




});

router.post('/signup', async (req, res) => {
    // console.log(req.body);
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }
    const { cnic, email, password } = req.body;
    try {

        if (req.body._id) {

            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(password, salt);


            let user = await User.findByIdAndUpdate(req.body._id, req.body);

            if (user) {

                let cUser = user.toJSON();
                delete cUser.password;

                const payload = {
                    user: {
                        id: user.id
                    }
                }

                jwt.sign(payload, "123456",
                    {
                        expiresIn: 36000
                    }, (err, token) => {
                        if (err) throw err;

                        res.json({
                            user: cUser,
                            token
                        })
                    });
            }

        } else {

            //see if user exists
            let user = await User.findOne({ email });
            if (user) {

                res.status(400).json({ error: "Users already exists" });

            }
            // creating the user if not 
            user = new User(req.body);

            // encrypt Password

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            let cUser = user.toJSON();
            delete cUser.password;


            //Return jasonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, "123456",
                {
                    expiresIn: 36000
                }, (err, token) => {
                    if (err) throw err;

                    res.json({ token, user: cUser, success: true })
                });

        }


    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");

    }




});

module.exports = router;