let Category = require('./../models/category');
let User = require('./../models/user');
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

router.post('/load_doctors/:category', (req, res) => {

    User.find({ category: req.params.category, type: "doctor" }, (err, doctors) => {

        res.json(doctors);

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