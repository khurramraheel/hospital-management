
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import M from 'materialize-css';
import './home.css';
import history from './../../history';
import store from './../../store/store';
import { loadDoctorsByCategory } from './../../store/actions/category';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

function Home(props) {

    useEffect(() => {

        // M.Carousel.init(document.getElementById('home-carousel'), {});
    })

    return <div id="home-component" className="relative">
        {(!props.store.auth.user._id || props.store.auth.user.type == "patient") && <button onClick={(evt) => {

            if (props.store.auth.user._id) {

                //Open appointment modal
                history.push('/appointment');

            } else {

                M.Modal.init(document.getElementById("loginModel"), {}).open();

            }


        }} className="def-btn" id="schedule-btn">Schedule an appointment!</button>}

        <Carousel showArrows={true}>
            <div>
                <img src="/images/1.jpg" />
            </div>
            <div>
                <img src="/images/2.jpg" />
            </div>
            <div>
                <img src="/images/4.jpg" />
            </div>

        </Carousel>

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
                        <div className='text-left'>
                            <a href='#' onClick={() => {

                                loadDoctorsByCategory(category._id).then((res) => {
                                    store.dispatch({
                                        type: "DOCTORS_LOADED",
                                        payload: res.data
                                    });
                                    history.push('/appointment?category=' + category.name);
                                });

                            }}>Book</a> <span className="appointments-box"> <small>Appointments </small> <small><span>{category.appointments}</span></small></span>
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