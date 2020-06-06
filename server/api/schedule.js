
let router = require('express').Router();

let Appointment = require('./../models/appointment');

// let Patient = require('./../models/user');

let User = require('./../models/user');

let extra = require('./../extras');

router.get('/load_patients', async (req, res) => {

    let patients = [];
    try {
        let appointments = await Appointment.find({ doctor: req.query.id });

        await Promise.all(appointments.map(async (appointment) => {

            let patient = await User.findById(appointment.patient.toString());

            let patientExist = patients.find((cPatient) => {
                return cPatient.data._id.toString() == patient._id.toString()
            });

            if (!patientExist) {
                patients.push({
                    data: patient.toJSON(),
                    visits: 1
                })
            } else {
                patientExist.visits++;
            }

            return patients;

        }));

        res.json({
            success: true,
            patients: patients
        });

    } catch (e) {
        res.    json({
            success: false
        })
    }

});

router.post('/confirm', async (req, res) => {

    try {

        let patient = await User.findById(req.body.patient);
        let doctor = await User.findById(req.body.doctor);

        //It was canceleld by the patient
        if (req.body.status == "cancelled" && req.body.actionBy == "patient") {

            let appointment = await Appointment.findById(req.body._id);
            await appointment.populate("patient doctor").execPopulate();

            let cAppointment = appointment.toJSON();
            cAppointment.status = "cancelled";

            if (appointment) {

                // await appointment.remove();

                extra.sendEmail({
                    email: doctor.email,
                    subject: "Appointment cancelled with your patient." + patient.name,
                    html: "Dear, <strong>" + doctor.name + "</strong>, Please be informed that your appointment <strong>(#" + appointment.appointID + ")</strong> with your patient <strong>" + patient.name + "</strong>, has been cancelled requested on date " + appointment.date + " at " + appointment.timing + ". The reason for cancellation is mentioned below: <div><strong>" + req.body.cancelReason + "</strong></div>"
                });

            }
            res.json({
                success: true,
                appointment: cAppointment
            });

            return;


        }

        //It was cancelled by the doctor
        if (req.body.status == "cancelled" && req.body.actionBy == "doctor") {

            let appointment = await Appointment.findById(req.body._id);
            await appointment.populate("patient doctor").execPopulate();

            let cAppointment = appointment.toJSON();
            cAppointment.status = "cancelled";

            if (appointment) {

                await appointment.remove();

                extra.sendEmail({
                    email: pateint.email,
                    subject: "Appointment cancelled with your doctor." + doctor.name,
                    html: "Dear, <strong>" + patint.name + "</strong>, We are very to inform you that your appointment <strong>(#" + appointment.appointID + ")</strong> with your dr.<strong>" + doctor.name + "</strong>, has been cancelled requested on date " + appointment.date + " at " + appointment.timing + ". The reason for cancellation is mentioned below: <div><strong>" + req.body.cancelReason + "</strong></div>"
                });

            }
            res.json({
                success: true,
                appointment: cAppointment
            });

            return;


        }

        if (req.body.status == "rejected") {

            let appointment = await Appointment.findById(req.body._id);
            await appointment.populate("patient doctor").execPopulate();

            let cAppointment = appointment.toJSON();

            if (appointment) {

                await appointment.remove();

                extra.sendEmail({
                    email: patient.email,
                    subject: "Appointment cancelled with Dr." + doctor.name,
                    html: "Dear, <strong>" + patient.name + "</strong>, Please be informed that your appointment <strong>(#" + appointment.appointID + ")</strong> with <strong>Dr." + doctor.name + "</strong>, has been cancelled requested on date " + appointment.date + " at " + appointment.timing + "."
                });

            }
            res.json({
                success: true,
                appointment: cAppointment
            });

            return;
        }

        let appointment = await Appointment.findByIdAndUpdate(req.body._id, req.body, { new: true });
        await appointment.populate("patient doctor").execPopulate();

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