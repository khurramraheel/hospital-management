import React from 'react';
import './dashboard.css';
import { connect } from 'react-redux';
import M from 'materialize-css';
import { updateAccount } from './../../store/actions/auth';
import { toast } from 'react-toastify';
import { saveCategory, deleteCategory, updateCategory } from './../../store/actions/category';
import { confirmAppointment } from './../../store/actions/schedules';
import { confirmAlert } from 'react-confirm-alert'; // Import
import { useForm } from 'react-hook-form';
import CategoryAdded from './../category-added/add-category';

function AAppointmentCancellation(props) {

    const { register, handleSubmit, errors } = useForm();

    return <div id="appointmentModal" className="modal">
        <h5 className="modal-heading">Cancel Appoint with {(props.type == "patient" ? ("dr " + props.appointment.doctor.name) : ("patient " + props.appointment.patient.name))}</h5>
        <div className="modal-content">
            <form onSubmit={handleSubmit((data) => {

                props.confirmAppointment({ ...props.appointment, ...data, status: "cancelled", actionBy:props.actionBy });

            })}>
                <div class="row">
                    <div class="input-field col s12">
                        <textarea id="cancelReason" type="number" class="validate height-100" name="cancelReason" ref={register({ required: true })}></textarea>
                        <label for="cancelReason" className="active">Cancellation Reason</label>
                        {errors.cancelReason && errors.cancelReason.type === 'required' && <span id="errors" class="helper-text" > This field is Required</span>}
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <button>onSubmit</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

}

let AppointmentCancellation = connect((store) => {

    return {
        store
    };

}, { confirmAppointment })(AAppointmentCancellation);

class Dashboard extends React.Component {

    state = {
        category: {},
        appointment: {},
        cancellingAppointment: false,
    }

    componentDidMount = () => {

        M.Tabs.init(this.refs.doctorAccountTab);
        M.Tabs.init(this.refs.patientAccountTab);
        M.Tabs.init(this.refs.adminAccountTab);

    }

    componentDidUpdate = () => {

        M.Tabs.init(this.refs.doctorAccountTab);
        M.Tabs.init(this.refs.patientAccountTab);
        M.Tabs.init(this.refs.adminAccountTab);

    }

    render = () => {

        return <div id="dashboardComponent">

            {this.state.cancellingAppointment && <AppointmentCancellation actionBy={this.props.store.auth.user.type} appointment={this.state.appointment} />}

            {this.state.manageCategory && <CategoryAdded category={this.state.category} />}

            {
                this.props.store.auth.user.type == "admin" && <div id="admin-panel">

                    <ul class="tabs" ref="adminAccountTab">
                        <li class="tab col s3"><a class="active" href="#categoriesTabAdmin">Categories</a></li>
                        <li class="tab col s3"><a href="#doctorsTabAdmin">Doctors</a></li>
                        <li class="tab col s3"><a href="#patientsTabAdmin">Patients</a></li>
                    </ul>

                    <div id="categoriesTabAdmin">
                        <div className="text-left">
                            <button class="def-btn" onClick={() => {

                                this.setState({
                                    manageCategory: true,
                                    category: {}
                                });

                                setTimeout(() => {

                                    M.Modal.init(document.getElementById('categoryAddForm'), {
                                        onCloseEnd: () => {
                                            this.setState({
                                                manageCategory: false,
                                                category: null
                                            });
                                        }
                                    }).open();

                                }, 100);

                                // let category = window.prompt("Please enter category name", "");

                                // if (!category || !category.length) {
                                //     return toast.error("Category name cannot be empty");
                                // }

                                // let categoryAlreadyExist = this.props.store.auth.categories.find((sCategory) => {
                                //     return sCategory.name.toLowerCase() == category.toLowerCase();
                                // });

                                // if (categoryAlreadyExist) {
                                //     return toast.error("This category already exists");
                                // }

                                // this.props.saveCategory({
                                //     name: category
                                // });

                            }}>Add Category</button>
                        </div>
                        <table>
                            <thead>
                                <th>CategoryID</th>
                                <th>Category Thumb</th>
                                <th>Category Name</th>
                                {/* <th>Action</th> */}
                            </thead>
                            {
                                this.props.store.auth.categories.map((category) => {
                                    return <tr>
                                        <td>{category.categoryID}</td>
                                        <td><img className="category-thumb" src={category.profilePic} /></td>
                                        <td>{category.name}</td>
                                        <td><button className="def-btn" onClick={() => {

                                            this.setState({
                                                manageCategory: true,
                                                category: category
                                            });

                                            setTimeout(() => {

                                                M.Modal.init(document.getElementById('categoryAddForm'), {
                                                    onCloseEnd: () => {
                                                        this.setState({
                                                            manageCategory: false,
                                                            category: null
                                                        });
                                                    }
                                                }).open();

                                            }, 100);

                                            // let newName = window.prompt("Enter name", category.name);

                                            // if (!newName || !newName.length) {
                                            //     return toast.error("Category name cannot be empty");
                                            // }

                                            // this.props.updateCategory({
                                            //     id: category._id,
                                            //     name: newName
                                            // });



                                            // this.props.upd?(category._id);

                                        }}>EDIT</button></td>

                                        <td><button className="def-btn" onClick={() => {

                                            this.props.deleteCategory(category._id);

                                        }}>DELETE</button></td>
                                    </tr>;
                                })
                            }
                        </table>
                    </div>

                    <div id="doctorsTabAdmin">
                        <table>
                            <thead>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Category</th>
                                {/* <th>S</th> */}
                            </thead>
                            {
                                this.props.store.auth.users.filter((user) => {
                                    return user.type == "doctor";
                                }).map((user) => {
                                    return <tr style={{ backgroundColor: user.status == "unactive" ? "#ffe4e4" : "white" }}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.contact}</td>
                                        <td>{user.category ? user.category.name : ""}</td>
                                        <td>
                                            {user.status == "active" && <button onClick={() => {

                                                if (window.confirm("Are you sure you want to unregister this account?")) {


                                                    this.props.updateAccount({
                                                        id: user._id,
                                                        status: 'unactive'
                                                    });
                                                }

                                            }} className="def-btn">Unregister Account</button>
                                            }
                                            {user.status == "unactive" && <button onClick={() => {

                                                if (window.confirm("Are you sure you want to re-activate this account?")) {


                                                    this.props.updateAccount({
                                                        id: user._id,
                                                        status: 'active'
                                                    });
                                                }

                                            }} className="def-btn">Re-activate Account</button>
                                            }
                                        </td>

                                    </tr>
                                })
                            }
                        </table>

                    </div>

                    <div id="patientsTabAdmin">
                        <table>
                            <thead>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>Action</th>
                                {/* <th>S</th> */}
                            </thead>
                            {
                                this.props.store.auth.users.filter((user) => {
                                    return user.type == "patient";
                                }).map((user) => {
                                    return <tr style={{ backgroundColor: user.status == "unactive" ? "#ffe4e4" : "white" }}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.contact}</td>
                                        <td>
                                            {user.status == "active" && <button onClick={() => {

                                                if (window.confirm("Are you sure you want to unregister this account?")) {


                                                    this.props.updateAccount({
                                                        id: user._id,
                                                        status: 'unactive'
                                                    });
                                                }

                                            }} className="def-btn">Unregister Account</button>
                                            }
                                            {user.status == "unactive" && <button onClick={() => {

                                                if (window.confirm("Are you sure you want to re-activate this account?")) {


                                                    this.props.updateAccount({
                                                        id: user._id,
                                                        status: 'active'
                                                    });
                                                }

                                            }} className="def-btn">Re-activate Account</button>
                                            }
                                        </td>

                                    </tr>
                                })
                            }
                        </table>
                    </div>

                </div>
            }

            {
                this.props.store.auth.user.type == "patient" && <div id="patient-panel">


                    <ul class="tabs" ref="patientAccountTab">
                        <li class="tab col s3"><a class="active" href="#requestedAppointmentsPatient">Requested Appointments</a></li>
                        <li class="tab col s3"><a href="#bookAppointmentsPatients">Booked Appointments</a></li>
                        <li class="tab col s3"><a href="#historyPatient">History</a></li>
                    </ul>


                    <div id="bookAppointmentsPatients">
                        <table>
                            <thead>
                                <th>Appointment ID</th>
                                <th>Date</th>
                                <th>Timing</th>
                                <th>Doctor Name</th>
                                <th>Doctpr Contact</th>
                                <th>Symptoms</th>
                                <th></th>
                                {/* <th>Action</th> */}

                            </thead>
                            {
                                this.props.store.auth.appointments.filter((appointment) => {
                                    return appointment.status == "confirmed";
                                }).map((appointment) => {

                                    return <tr>
                                        <td>{appointment.appointID}</td>
                                        <td>{appointment.date}</td>
                                        <td>{appointment.timing}</td>
                                        <td>{appointment.doctor.name}</td>
                                        <td>{appointment.doctor.contact}</td>
                                        <td>{appointment.patientSymptoms}</td>
                                        <td><button className="def-btn-danger" onClick={() => {

                                            this.setState({
                                                cancellingAppointment: true,
                                                appointment: appointment
                                            })

                                            setTimeout(() => {

                                                M.Modal.init(document.getElementById('appointmentModal'), {
                                                    onCloseEnd: () => {
                                                        this.setState({
                                                            cancellingAppointment: false,
                                                            appointment: {}
                                                        });
                                                    }
                                                }).open();

                                            }, 100);

                                            // confirmAlert({
                                            //     title: 'Cancel Appointment',
                                            //     message: 'Are you sure you want to cancelled this appointment wit Dr.' + appointment.doctor.name + '?',
                                            //     buttons: [
                                            //         {
                                            //             label: 'Yes',
                                            //             onClick: () => {
                                            //                 let cAppoinment = { ...appointment, status: "cancelled" };
                                            //                 this.props.confirmAppointment(cAppoinment)
                                            //             }
                                            //         },
                                            //         {
                                            //             label: 'No',
                                            //             onClick: () => { }

                                            //         }
                                            //     ]
                                            // });



                                        }}>Cancel</button></td>
                                        {/* <td><button className="def-btn">Confirm Appointment</button></td> */}

                                    </tr>

                                })
                            }
                        </table>
                    </div>

                    <div id="historyPatient">
                        <table>
                            <thead>
                                <th>Appointment ID</th>
                                <th>Timing</th>
                                <th>Doctor Name</th>
                                <th>Doctpr Contact</th>
                                <th>Symptoms</th>
                                {/* <th>Action</th> */}

                            </thead>
                            {
                                this.props.store.auth.appointments.filter((appointment) => {
                                    return appointment.status == "completed";
                                }).map((appointment) => {

                                    return <tr>
                                        <td>{appointment.appointID}</td>
                                        <td>{appointment.timing}</td>
                                        <td>{appointment.doctor.name}</td>
                                        <td>{appointment.doctor.contact}</td>
                                        <td>{appointment.patientSymptoms}</td>
                                        {/* <td><button className="def-btn">Confirm Appointment</button></td> */}

                                    </tr>

                                })
                            }
                        </table>
                    </div>


                    <div id="requestedAppointmentsPatient">
                        <table>
                            <thead>
                                <th>Appointment ID</th>
                                <th>Timing</th>
                                <th>Doctor Name</th>
                                <th>Doctpr Contact</th>
                                <th>Symptoms</th>
                                {/* <th>Action</th> */}

                            </thead>
                            {
                                this.props.store.auth.appointments.filter((appointment) => {
                                    return appointment.status == "pending";
                                }).map((appointment) => {

                                    return <tr>
                                        <td>{appointment.appointID}</td>
                                        <td>{appointment.timing}</td>
                                        <td>{appointment.doctor.name}</td>
                                        <td>{appointment.doctor.contact}</td>
                                        <td>{appointment.patientSymptoms}</td>
                                        {/* <td><button className="def-btn">Confirm Appointment</button></td> */}

                                    </tr>

                                })
                            }
                        </table>
                    </div>

                </div>
            }

            {
                this.props.store.auth.user.type == "doctor" && <div id="doctor-panel">


                    <ul class="tabs" ref="doctorAccountTab">
                        <li class="tab col s3"><a class="active" href="#newAppointmentsDoctor">New Appointments</a></li>
                        <li class="tab col s3"><a href="#bookAppointmentsDoctor">Booked Appointments</a></li>
                        <li class="tab col s3"><a href="#historyDoctor">History</a></li>
                    </ul>

                    <div id="newAppointmentsDoctor">
                        <table>
                            <thead>
                                <th>Appointment ID</th>
                                <th>Timing</th>
                                <th>Patient Name</th>
                                <th>Patient Contact</th>
                                <th>Symptoms</th>
                                <th>Action</th>

                            </thead>
                            {
                                this.props.store.auth.appointments.filter((appointment) => {
                                    return appointment.status == "pending";
                                }).map((appointment) => {

                                    return <tr>
                                        <td>{appointment.appointID}</td>
                                        <td>{appointment.timing}</td>
                                        <td>{appointment.patient.name}</td>
                                        <td>{appointment.patient.contact}</td>
                                        <td>{appointment.patientSymptoms}</td>
                                        <td><button className="def-btn" onClick={() => {


                                            confirmAlert({
                                                title: 'Confirm Appointment',
                                                message: 'Are you sure you want to confirm this appointment?',
                                                buttons: [
                                                    {
                                                        label: 'Yes',
                                                        onClick: () => {
                                                            let cAppoinment = { ...appointment, status: "confirmed" };
                                                            this.props.confirmAppointment(cAppoinment)
                                                        }
                                                    },
                                                    {
                                                        label: 'No',
                                                        onClick: () => { }

                                                    }
                                                ]
                                            });



                                        }}>Confirm</button></td>
                                        <td><button className="def-btn-danger" onClick={() => {



                                            confirmAlert({
                                                title: 'Reject Appointment',
                                                message: 'Are you sure you want to reject this appointment?',
                                                buttons: [
                                                    {
                                                        label: 'Yes',
                                                        onClick: () => {
                                                            let cAppoinment = { ...appointment, status: "rejected" };
                                                            this.props.confirmAppointment(cAppoinment)
                                                        }
                                                    },
                                                    {
                                                        label: 'No',
                                                        onClick: () => { }

                                                    }
                                                ]
                                            });

                                        }}>Reject</button></td>

                                    </tr>

                                })
                            }
                        </table>
                    </div>

                    <div id="historyDoctor">
                        <table>
                            <thead>
                                <th>Appointment ID</th>
                                <th>Date</th>
                                <th>Timing</th>
                                <th>Patient Name</th>
                                <th>Patient Contact</th>
                                {/* <th>Symptoms</th> */}
                            </thead>
                            {
                                this.props.store.auth.appointments.filter((appointment) => {
                                    return appointment.status == "completed";
                                }).map((appointment) => {

                                    return <tr>
                                        <td>{appointment.appointID}</td>
                                        <td>{appointment.date}</td>
                                        <td>{appointment.timing}</td>
                                        <td>{appointment.patient.name}</td>
                                        <td>{appointment.patient.contact}</td>
                                        {/* <td>{appointment.patient.symptoms}</td> */}
                                    </tr>

                                })
                            }
                        </table>
                    </div>

                    <div id="bookAppointmentsDoctor">
                        <table>
                            <thead>
                                <th>Appointment ID</th>
                                <th>Date</th>
                                <th>Timing</th>
                                <th>Patient Name</th>
                                <th>Patient Contact</th>
                                <th>Symptoms</th>
                            </thead>
                            {
                                this.props.store.auth.appointments.filter((appointment) => {
                                    return appointment.status == "confirmed"
                                }).map((appointment) => {

                                    return <tr>
                                        <td>{appointment.appointID}</td>
                                        <td>{appointment.date}</td>
                                        <td>{appointment.timing}</td>
                                        <td>{appointment.patient.name}</td>
                                        <td>{appointment.patient.contact}</td>
                                        <td>
                                            <button className="def-btn" onClick={() => {

                                                confirmAlert({
                                                    title: 'Appointment Served',
                                                    message: 'Are you sure you want to confirm this appointment as served?',
                                                    buttons: [
                                                        {
                                                            label: 'Yes',
                                                            onClick: () => {
                                                                let cAppoinment = { ...appointment, status: "completed" };
                                                                this.props.confirmAppointment(cAppoinment);
                                                            }
                                                        },
                                                        {
                                                            label: 'No',
                                                            onClick: () => { }

                                                        }
                                                    ]
                                                });



                                            }}>Mark as Complete</button>
                                        </td>
                                    </tr>

                                })
                            }
                        </table>
                    </div>

                </div>
            }

        </div >

    }

}

export default connect((store) => {

    return { store };

}, { updateAccount, saveCategory, deleteCategory, updateCategory, confirmAppointment })(Dashboard);