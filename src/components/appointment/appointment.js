import React, { useState, useEffect } from 'react';

import './appointment.css';
import { login, requestNewPassword } from './../../store/actions/auth';
import { connect } from 'react-redux';
import M from 'materialize-css';    
import { useForm } from 'react-hook-form';
import { createSchedule, getSchedule } from './../../store/actions/schedules';
import {Link} from 'react-router-dom';
import $ from 'jquery';

import { loadDoctorsByCategory } from './../../store/actions/category';
import history from './../../history';
import { toast } from 'react-toastify';

function ConfirmDialog(props) {

    return <div id="confirmModal" className="modal">

        <div className="modal-content">
            <h5 className="text-left">Confirm Appointment Requst</h5>
            <table>
                <tr><th>Doctor Name</th> <td>{props.data.doctor.name}</td> </tr>
                <tr><th>Date</th> <td id="date-slot-confirm"></td> </tr>
                <tr><th>Specialization</th> <td>{props.data.category}</td> </tr>
                <tr><th>Timing</th> <td id="timing-slot-confirm"></td></tr>
                <tr><th>Symptoms</th> <td>{props.data.symptoms}</td></tr>
            </table>
            <button className="def-btn" onClick={() => {

                // appointID: String,
                // patientSymptoms: String,
                // doctor: {
                //     type: mongoose.SchemaTypes.ObjectId,
                //     ref: "user"
                // },
                // patient: {
                //     type: mongoose.SchemaTypes.ObjectId,
                //     ref: "user"
                // },
                // timing: Date,

                props.createSchedule({
                    timing: $('#timing-slot-confirm').text().trim(),
                    doctor: props.data.doctor._id,
                    patientSymptoms: props.data.symptoms,
                    date: date.toDateString(),
                    patient: props.store.auth.user._id,
                    category:props.data.doctor.category._id
                });


            }}>Send Appointment Request</button>

        </div>

    </div>

}

ConfirmDialog = connect((store) => {
    return {
        store
    }
}, { createSchedule })(ConfirmDialog);

let date = null;

let alreadyLoaded = false;

function Login(props) {

    let [doctors, setDoctors] = useState([]);

    let searchedCategory = props.location.search.split('=');

    let cCategory = null;
    debugger;

    // searchedCategory && searchedCategory[1] && !alreadyLoaded) {

    let [category, setCategory] = useState(searchedCategory && searchedCategory[1] ? searchedCategory[1] : "Select Domain..");

    // if (props.store.auth.categories.length && searchedCategory && searchedCategory[1] && !alreadyLoaded) {

    //     alreadyLoaded = true;


    //     cCategory = props.store.auth.categories.find((category) => {
    //         return category.name == searchedCategory[1];
    //     });



    //     cCategory && setCategory(cCategory) && loadDoctorsByCategory(cCategory._id).then((res) => {
    //         setDoctors(res.data);
    //     });
    // }


    let [timing, setTiming] = useState("");
    // let [date, setDate] = useState("");

    let [schedules, setSchedule] = useState([]);

    let [symptoms, setSymptoms] = useState("");


    let [selectedDoctor, setSelectedDoctor] = useState({});

    // const [formData, setFormData] = useState({

    //     email: '',
    //     password: ''
    // })
    // const {  email, password } = formData;
    // const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })
    // const onSubmit = e => {
    //     e.preventDefault();

    //         console.log("Success")
    // }

    // const { register, handleSubmit, errors } = useForm();
    // const data = useForm();

    // const register1 = data.register;
    // const handleSubmit1 = data.handleSubmit;
    // const errors1 = data.errors;

    // let [forgetPassword, setForgetPassword] = useState();

    // const onSubmit = data => {
    //     // registerHandler(data)
    //     console.log(data)

    //     props.login(data);

    // }


    useEffect(() => {

        let slots = [
            "9:00AM  - 10:00AM",
            "10:00AM - 11:00AM",
            "12:00AM - 1:00PM",
            "1:00PM  - 2:00PM",
            "2:00PM  - 3:00PM",
            "3:00PM  - 4:00PM",
            "4:00PM  - 5:00PM",
        ];

        M.Dropdown.init(document.getElementById('dropdown-trigger-appointment'), {});

        M.Datepicker.init(document.getElementById('appointment_datepicker'), {
            onSelect: function (cdate) {

                if (cdate) {
                    date = cdate;
                    // this.setDate(date);
                }


                let sectionCode = $('<table class="striped appointment-table"><thead><th>Time Slot</th></thead><tbody></tbody></table><div style="padding:20px"><button id="proceed-appointment" class="def-btn">Process Appointment</button </div>');

                slots.forEach((slot) => {

                    let selectSlotButton = '<p class="allow-events">\
                        <label>\
                            <input type="radio" name="slot-selector" data-slot="' + slot + '" class="slot-selector" />\
                            <span></span>\
                        </label</p>';

                    let slotFilled = schedules.find((schedule) => {
                        return schedule.timing == slot && schedule.date == date.toDateString();
                    });


                    if (slotFilled) {
                        selectSlotButton = '';
                    }

                    sectionCode.find('tbody').append('<tr><td>' + slot + '</td><td>' + selectSlotButton + '</td>></tr>');

                    sectionCode.find('.slot-selector:last').on('click', (evt) => {

                        let slot = evt.target.getAttribute('data-slot');
                        // alert(slot);
                        // setTiming(slot);

                    });

                });

                let $modal = $('#appointmentComponent .datepicker-modal');

                $modal.find('.appointment-table').remove();
                $modal.find('#proceed-appointment').remove();
                $modal.append(sectionCode);

                $modal.find('#proceed-appointment').on('click', (evt) => {

                    if (!$('#appointmentComponent .slot-selector:checked').length) {
                        return toast.error("Please select a timing slot");
                    }

                    M.Modal.init(document.getElementById('confirmModal'), {
                        onOpenEnd: () => {

                            $('#date-slot-confirm').text(date.toDateString());
                            $('#timing-slot-confirm').text($('#appointmentComponent .slot-selector:checked').attr('data-slot'));

                        }
                    }).open();

                });

            }
        });

    })


    return <div id="appointmentComponent" className="card">

        <div className="text-left">
            <label>Selected domain</label> <a id="dropdown-trigger-appointment" class='btn' href='#' data-target='category_picker_appointment'>{category}</a>
        </div>
        <ul id='category_picker_appointment' class='dropdown-content'>
            {
                props.store.auth.categories.map((category) => {
                    return <li onClick={(evt) => {

                        setCategory(category.name);

                        // let selectedCategory = evt.target.innerText.trim();

                        loadDoctorsByCategory(category._id).then((res) => {
                            setDoctors(res.data);
                        });


                    }} data-id={category._id}>{
                            category.name
                        }</li>
                })
            }
        </ul>



        {
            (props.store.auth.doctors.length > 0 || doctors.length > 0) && <div className="text-left">
                <h6 className="text-left">{props.store.auth.doctors.length || doctors.length} doctors avaiable!</h6>
                <table className="striped">
                    <thead>
                        <th>Doctor Pic</th>
                        <th>Doctor Name</th>
                        <th>Contact</th>
                        <th>Email</th>
                        <th></th>
                    </thead>
                    {
                        (props.store.auth.doctors.length ? props.store.auth.doctors : doctors).map((doctor) => {
                            return <tr style={{ backgroundColor: selectedDoctor == doctor ? "#efefef" : "" }}>
                                <td><img className="doctor-thumb" src={doctor.profilePic} /></td>
                                <td>{doctor.name}</td>
                                <td>{doctor.contact}</td>
                                <td>{doctor.email}</td>
                                <td><button className="def-btn" onClick={() => {

                                    getSchedule(doctor._id).then((res) => {

                                        setSchedule(res.data.schedules);

                                    });

                                    setSelectedDoctor(doctor);
                                }}>Select</button></td>
                                <td>
                                    <Link to={'/about/'+doctor._id} class="def-btn">Details</Link>
                                </td>
                            </tr>
                        })
                    }
                </table>
            </div>
        }

        <div className="text-left">
            <label>Symptoms</label>
            <textarea className="height-100" onChange={(evt) => {

                setSymptoms(evt.target.value);

            }}></textarea>
        </div>
        {selectedDoctor._id && <div className="text-center">
            <h6><label className="def-btn" for="appointment_datepicker">Request a schedule</label></h6>
        </div>}

        {/* <ul id='date_picker_appointment' class='dropdown-content'>
            {
                props.store.auth.categories.map((category) => {
                    return <li onClick={(evt) => {

                        setCategory(category.name);

                        // let selectedCategory = evt.target.innerText.trim();

                        loadDoctorsByCategory(category._id).then((res) => {
                            setDoctors(res.data);
                        });


                    }} data-id={category._id}>{
                            category.name
                        }</li>
                })
            }
        </ul> */}


        <div>

            <input type="text" id="appointment_datepicker" hidden />


        </div>

        <ConfirmDialog data={{ doctor: selectedDoctor, category: category, symptoms: symptoms, date: date }} />

    </div >

}

export default connect((store) => {
    return { store };
}, { login, requestNewPassword })(Login)