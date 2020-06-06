
import React from 'react';
import { connect } from 'react-redux';
import M from 'materialize-css';
import './home.css';
import history from './../../history';
import store from './../../store/store';
import { loadDoctorsByCategory } from './../../store/actions/category';

function Home(props) {

    return <div className="relative">
        {(!props.store.auth.user._id || props.store.auth.user.type == "patient") && <button onClick={(evt) => {

            if (props.store.auth.user._id) {

                //Open appointment modal
                history.push('/appointment');

            } else {

                M.Modal.init(document.getElementById("loginModel"), {}).open();

            }


        }} className="def-btn" id="schedule-btn">Schedule an appointment!</button>}
        <img src='/images/background.jpg' />

        <div id="categoriex-box" className="flex">

            {
                props.store.auth.categories.map((category) => {
                    return <div className="category-card">
                        <div>
                            <img src={category.profilePic} />
                        </div>
                        <div>
                            <h6>{category.name}</h6>
                        </div>
                        <div>
                            <button className="def-btn" onClick={() => {

                                loadDoctorsByCategory(category._id).then((res) => {
                                    store.dispatch({
                                        type: "DOCTORS_LOADED",
                                        payload: res.data
                                    });
                                    history.push('/appointment?category=' + category.name);
                                });

                            }}>Book</button>
                        </div>
                    </div>
                })
            }

        </div>


    </div>

}

export default connect((store) => {
    return { store };
})(Home);