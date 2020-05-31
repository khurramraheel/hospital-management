
let nodemailer = require('nodemailer');


module.exports.sendEmail = async (payload) => {

    try {

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

            let info = await transporter.sendMail({

                from: "Delivey App",
                to: payload.email,
                subject: payload.subject,
                html: payload.html,
                attachments: payload.attachments || []
                // subject: "Dear user, " + (payload.host) + " has invited you to his project " + (payload.projectTitle), // Subject line
                //  text: "At "+config.name+", project collobration allows you to build teams and work together on your great ideas!", // plain text body
                // html: "<p>At " + config.name + ", project collobration allows you to build teams and work together on your great ideas!</p> <a style='box-shadow: 2px 2px 3px 3px #e0d5ff;background-color: rgb(146,25,166);color: white;text-decoration: none;font-weight: bold;padding: 10px;display: inline-block;' href='" + (payload.req.protocol + '://' + payload.req.host + '/acceptInvitation/' + token) + "'>Accept Invitation</a>" // html body
            });

            payload.callback(null, { success: true });

            // callback(null, {
            //     success: true
            // });

        } catch (err) {

            payload.callback(err, null);

            // console.log(err);
            // callback(err, null);

            // res.json({
            //     success: false,
            //     error: 'Oops, project invites could not be updated right now!'
            // });
        }

    } catch (err) {

        // console.log(err);

        // payload.callback(err, null);

    }

}
