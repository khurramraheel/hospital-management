import React, { useState, useEffect } from 'react';

import './appointment.css';
import { login, requestNewPassword, loadMessages } from './../../store/actions/auth';
import { connect } from 'react-redux';
import M from 'materialize-css';
import { useForm } from 'react-hook-form';
import { createSchedule, getSchedule } from './../../store/actions/schedules';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { Launcher } from 'react-chat-window';

import { loadDoctorsByCategory } from './../../store/actions/category';
import history from './../../history';
import { toast } from 'react-toastify';
import socketIOClient from "socket.io-client";
import store from './../../store/store';

let outerMessgeList = [];

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
                    category: typeof props.data.doctor.category == "string" ? props.data.doctor.category : props.data.doctor.category._id
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

let socket;
let wait = 0;
// let cDoctors = [];

function Login(props) {

    let sentMessages = false;
    let [doctors, setDoctors] = useState(props.store.auth.doctors);

    let onAuthenticated = () => {

        socket.emit('join_chat', {
            type: props.store.auth.user.type,
            userID: props.store.auth.user._id
        });

        socket.on('sent_mess_pro_members', sendMessageToMembers);
        socket.on('message_read', onMessageRead);

    }

    let searchedCategory = props.location.search.split('=');

    let cCategory = null;
    // debugger;

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

    let [openChat, setOpenChat] = useState(false);
    let [messageList, setMessageList] = useState([]);

    let [timing, setTiming] = useState("");
    // let [date, setDate] = useState("");

    let [schedules, setSchedule] = useState([]);

    let [symptoms, setSymptoms] = useState("");


    let [selectedDoctor, setSelectedDoctor] = useState({});
    // let [loadedMessages, setLoadedMessages] = useState();

    let sendMessageToMembers = (data) => {

        sentMessages = false;

        let tDoctor = window.cDoctors.find((doctor) => {
            return doctor._id == data.author
        });

        if (tDoctor) {

            if (document.querySelector('.sc-chat-window.opened')) {
                (data.readBy.indexOf(props.store.auth.user._id) == -1) && data.readBy.push(props.store.auth.user._id);
            }

            tDoctor.messages.push(data);
        }

        if (data.author == props.store.auth.user._id) {
            data.author = "me";
        }

        outerMessgeList = [...outerMessgeList, data];

        // let user = this.props.store.auth.loggedUser.user;
        setMessageList(outerMessgeList);
        store.dispatch({
            type: 'UPDATE_DOCTORS'
        });


        // props.store.auth.doctors.filter((doctor) => {

        //     if (data.author == doctor._id) {
        //         d
        //     }

        // });

    }

    function onMessageRead(data) {

        outerMessgeList.forEach((message) => {
            (props.store.auth.user._id != message.author) && (message.readBy.indexOf(props.store.auth.user._id) == -1) && (message.readBy.push(props.store.auth.user._id));
        });

        window.cDoctors.forEach((doctor) => {

            if (doctor._id == data.author) {

                doctor.messages.forEach((message) => {
                    (props.store.auth.user._id != message.author) && (message.readBy.indexOf(props.store.auth.user._id) == -1) && (message.readBy.push(props.store.auth.user._id));
                });


            }

        });

        setMessageList(outerMessgeList);
    }

    let keyInterval = 0;

    setTimeout(() => {
        // debu gger;

        if (!props.store.auth.user._id) {

            keyInterval = setInterval(() => {

                let state = store.getState();
                console.log(state);
                if (!state.auth.user._id) {
                    return;
                } else if (wait == 100) {
                    wait = 0;
                    clearInterval(keyInterval);
                } else {
                    clearInterval(keyInterval);
                }

                if (category) {

                    let cCategory = state.auth.categories.find((item) => {
                        return item.name == category
                    });

                    if (cCategory) {
                        loadDoctorsByCategory({ id: cCategory._id, patientID: state.auth.user._id }).then((res) => {
                            window.cDoctors = res.data;
                            setDoctors(res.data);
                        });
                    }
                }

                wait++;

            }, 10);

        }

    }, 100);


    if (!socket && props.store.auth.user._id) {
        socket = socketIOClient('http://localhost:5000');
        socket.on('authenticated', onAuthenticated)
            .emit('authenticate', {
                token: props.store.auth.token
            }); //send the jwt
    }

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

    let user = props.store.auth.user;

    function updateThroughSocket(messages) {

        messages.forEach((message) => {

            message.userID = props.store.auth.user._id;
            socket.emit('update_read', message);

        });

    }

    return <div id="appointmentComponent" className="card">

        <Launcher
            handleClick={() => {
                setOpenChat(!openChat);
            }}
            isOpen={openChat}
            agentProfile={{
                teamName: 'Doctor Chat',
                imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
            }}
            onMessageWasSent={(message) => {

                message.author = user._id;
                message.receiver = selectedDoctor._id;

                socket.emit('sent_message_all', message);

            }}
            messageList={messageList}
            showEmoji
        />

        <div className="text-left">
            <label>Selected domain</label> <a id="dropdown-trigger-appointment" class='btn' href='#' data-target='category_picker_appointment'>{category}</a>
        </div>
        <ul id='category_picker_appointment' class='dropdown-content'>

            <>
                {/* <li></li> */}
                {([{ name: "Select Category" }]).concat(props.store.auth.categories || []).map((category) => {
                    return <li onClick={(evt) => {

                        setCategory(category.name);

                        // let selectedCategory = evt.target.innerText.trim();

                        loadDoctorsByCategory({ id: category._id, patientID: props.store.auth.user._id }).then((res) => {
                            window.cDoctors = res.data;
                            setDoctors(res.data);
                        });


                    }} data-id={category._id}>{
                            category.name
                        }</li>
                })
                }
            </>
        </ul>



        {
            (props.store.auth.doctors.length > 0 || window.cDoctors.length > 0) && <div className="text-left">
                <h6 className="text-left">{props.store.auth.doctors.length || window.cDoctors.length} doctors avaiable!</h6>
                <table className="striped">
                    <thead>
                        <th>Doctor Pic</th>
                        <th>Doctor Name</th>
                        <th>Contact</th>
                        <th>Email</th>
                        <th></th>
                    </thead>
                    {
                        (props.store.auth.doctors.length ? props.store.auth.doctors : window.cDoctors).map((doctor) => {
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
                                    <Link to={'/about/' + doctor._id} class="def-btn">Details</Link>
                                </td>
                                <td>
                                    <button className="def-btn" onClick={() => {
                                        setSelectedDoctor(doctor);
                                        loadMessages({
                                            author: props.store.auth.user._id,
                                            receiver: doctor._id
                                        }).then((res) => {


                                            if (res.data.success) {
                                                res.data.messages.forEach((message) => {
                                                    if (message.author == props.store.auth.user._id) {
                                                        message.author = "me";
                                                    }
                                                });
                                                outerMessgeList = res.data.messages
                                                setMessageList(outerMessgeList);

                                                let freshMessages = outerMessgeList.filter((message) => {
                                                    return message.readBy.indexOf(props.store.auth.user._id) == -1;
                                                })

                                                if (!sentMessages) {
                                                    sentMessages = true;
                                                    updateThroughSocket(freshMessages);
                                                }
                                            }

                                        })
                                        setOpenChat(true);
                                    }}>Send Message</button>
                                    <span onClick={() => {

                                        // setOpenChat(true);

                                        // outerMessgeList = doctor.messages;
                                        // setMessageList(doctor.messages)

                                        // let freshMessages =  outerMessgeList.filter((message) => {
                                        //     return   message.readBy.indexOf(props.store.auth.user._id) == -1;
                                        // })

                                        // if (!sentMessages) {
                                        //     sentMessages = true;
                                        //     updateThroughSocket(freshMessages);
                                        // }

                                    }} className="bubble-message">{

                                            doctor.messages.filter((message) => {
                                                return (message.author != "me" && message.author != props.store.auth.user._id) && message.readBy.indexOf(props.store.auth.user._id) == -1;
                                            }).length

                                        }</span>
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