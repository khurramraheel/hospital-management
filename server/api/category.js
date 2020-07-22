let Category = require('./../models/category');
let User = require('./../models/user');
let Message = require('./../models/messageList');
let router = require('express').Router();

router.post('/create', (req, res) => {

    let category = new Category({ ...req.body, categoryID: Math.random().toString(36).substr(2, 9) });
    category.save((err, category) => {
        res.json(err || category);
    });

});


router.get('/getall', (req, res) => {

    Category.find({}, (err, category) => {
        res.json(err || category)
    });

});

router.get('/get_doctor', (req, res) => {

    User.findById(req.query.id).populate('category').exec((err, doctor) => {
        res.json(err || doctor)
    });

});

router.post('/load_doctors/:category', (req, res) => {

    User.find({ category: req.params.category, type: "doctor" }, async (err, doctors) => {

        let cDoctors = await Promise.all(doctors.map(async (doctor) => {

            let cDoctor = doctor.toJSON();

            cDoctor.messages = await Message.find({
                $or: [
                    { receiver: doctor._id, author: req.body.patientID },
                    { receiver: req.body.patientID, author: doctor._id }
                ]
            });
            return cDoctor;

        }));

        res.json(cDoctors);

    });

});
router.delete('/delete/:id', (req, res) => {

    Category.findByIdAndRemove(req.params.id, (err, category) => {
        res.json(err || category);
    });

});

router.put('/update', (req, res) => {

    Category.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, category) => {
        res.json(err || category);
    });

});

router.put('/update/:id', (req, res) => {

    Category.findByIdAndUpdate(req.params.id, req.body, (err, category) => {
        res.json(err || category);
    });

});

module.exports = router;