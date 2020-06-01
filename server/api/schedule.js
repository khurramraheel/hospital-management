
let router = require('express').Router();

let Appointment = require('./../models/appointment');
let User = require('./../models/user');

let extra = require('./../extras');

router.post('/confirm', async (req, res) => {

    try {

        let patient = await User.findById(req.body.patient);
        let doctor = await User.findById(req.body.doctor);


        if (req.body.status == "rejected") {

            let appointment = await Appointment.findById(req.body._id);
            await appointment.populate("patient doctor").execPopulate();

            let cAppointment = appointment.toJSON();

            if (appointment) {

                await appointment.remove();

                extra.sendEmail({
                    email: patient.email,
                    subject: "Appointment cancelled with Dr." + doctor.name,
                    html: "Dear, <strong>" + patient.name + "</strong>, Please be informed that your appoint with <strong>Dr." + doctor.name + "</strong>, has been cancelled requested on date " + appointment.date + " at " + appointment.timing + "."
                });

            }
            res.json({
                success: true,
                appointment: cAppointment
            });

            return;
        }

        let appointment = await Appointment.findByIdAndUpdate(req.body._id, req.body);
        await appointment.populate("patient doctor");

        // let patient = await User.findById(req.body.patient);
        // let doctor = await User.findById(req.body.doctor);

        if (req.body.status == "confirmed") {
            extra.sendEmail({
                email: patient.email,
                subject: "Appointment confirmed with Dr." + doctor.name,
                html: "Dear, <strong>" + patient.name + "</strong>, Please be informed that your appoint with <strong>Dr." + doctor.name + "</strong>, has been confirmed on date " + appointment.date + " at " + appointment.timing + ". You are kindly requested to arrive on time."
            })
        }

        res.json({
            success: true,
            appointment: appointment
        });

    }
    catch (e) {
        res.send(500, { error: e.message });
    }


});

router.post('/create', async (req, res) => {

    try {

        let appointment = new Appointment({ ...req.body, appointID: Math.random().toString(36).substr(2, 9) });
        await appointment.save();
        await appointment.populate('doctor').execPopulate();

        res.json({
            success: true,
            appointment: appointment
        });

    }
    catch (e) {
        res.send(500, { error: e.message });
    }


});

router.get('/get_schedule/:doctor', async (req, res) => {

    try {

        let schedules = await Appointment.find({ doctor: req.params.doctor });
        res.json({ schedules })
    }
    catch (e) {
        res.send(500, { error: e.message });
    }


});

module.exports = router;    