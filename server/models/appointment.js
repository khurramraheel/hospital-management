let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    appointID: String,
    patientSymptoms: String,
    doctor: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user"
    },
    patient: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user"
    },
    date:String,
    timing: String,
    status:{
        type:String,
        default:"pending"
    }
})

module.exports = mongoose.model('appointment', userSchema);