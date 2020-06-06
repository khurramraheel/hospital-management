import React from 'react';
import { connect } from 'react-redux';
import './patients.css';
import axios from 'axios';

let alreadyChecked = false;

class Patients extends React.Component {

    state = {
        patients: []
    }

    componentWillUnmount = () => {
        alreadyChecked = false;
    }

    componentDidUpdate = () => {

        this.loadPatients();

    }

    componentDidMount = () => {

        this.loadPatients();

    }

    loadPatients = () => {

        if (this.props.store.auth.user._id && !alreadyChecked) {
            alreadyChecked = true;
            axios.get('/api/schedule/load_patients?id=' + this.props.store.auth.user._id).then((res) => {

                if (res.data.success) {
                    this.setState(res.data)
                }

            });
        }

    }

    render = () => {

        return <div id="patient-component">

            <table>
                <thead>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Visits</th>
                    <th></th>
                    {/* <th>S</th> */}
                </thead>
                {
                    this.state.patients.map((user) => {
                        return <tr style={{ backgroundColor: user.status == "unactive" ? "#ffe4e4" : "white" }}>
                            <td>{user.data.name}</td>
                            <td>{user.data.email}</td>
                            <td>{user.data.contact}</td>
                            <td>{user.visits}</td>                            
                        </tr>
                    })
                }
            </table>

        </div>;

    }
}

export default connect((store) => {

    return { store };

})(Patients);