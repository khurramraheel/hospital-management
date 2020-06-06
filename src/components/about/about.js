import React from 'react';
import { getDoctorByID } from './../../store/actions/category';
import './about.css';

export default class About extends React.Component {

    state = { doctor: { category: {} } }

    componentDidMount = () => {

        if (this.props.match.params.id) {
            this.loadDoctor(this.props.match.params.id);
        }

    }

    loadDoctor(doctorID) {

        getDoctorByID(doctorID).then((res) => {
            if (res.data._id) {
                this.setState({ doctor: res.data });
            }
        })

    }

    render = () => {

        return <div id="about-component">

            <div className="row">

                <div className="col m3">
                    <img src={this.state.doctor.profilePic} />
                </div>

                <div className="col m9">
                    <div className="row">

                        <div className="col m3">
                            <span>Name</span>
                        </div>

                        <div className="col 9">
                            <span><strong>{this.state.doctor.name}</strong></span>
                        </div>

                    </div>
                    <div className="row">

                        <div className="col m3">
                            <span>Category</span>
                        </div>

                        <div className="col 9">
                            <span><strong>{this.state.doctor.category.name}</strong></span>
                        </div>

                    </div>
                    <div className="row">

                        <div className="col m3">
                            <span>About</span>
                        </div>

                        <div className="col 9">
                            <span><strong>{this.state.doctor.about}</strong></span>
                        </div>

                    </div>
                    <div className="row">

                        <div className="col m3">
                            <span>Qualifiction</span>
                        </div>

                        <div className="col 9">
                            <span><strong>{this.state.doctor.qualification}</strong></span>
                        </div>

                    </div>
                </div>

            </div>

        </div>

    }

}