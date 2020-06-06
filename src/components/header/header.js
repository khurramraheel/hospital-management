
import React, { useEffect, useRef } from 'react';
import './header.css';
import M from 'materialize-css';
import { useForm } from 'react-hook-form';
import Login from './../login/login';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import store from './../../store/store';
import history from './../../history';


function Header(props) {

    let loginBoxRef = useRef();
    // const { register, handleSubmit, errors } = useForm();


    useEffect(() => {

        M.Sidenav.init(document.querySelector('#header-component .sidenav'));

    })

    // render = () => {

    return <header id="header-component">

        <div id="loginInHeader" ref={loginBoxRef}>
            <Login />
        </div>


        <nav class="red" style={{ "padding": "0px 10px", "position": "fixed" }}>
            <div class="nav-wrapper">
                <Link to='/' class="brand-logo">Doctor Appointment System</Link>

                <a href="#" class="sidenav-trigger" data-target="mobile-nav">
                    <i class="material-icons">menu</i>
                </a>

                <ul class="right hide-on-med-and-down "  >
                    <li><Link to='/contact'>Contact Us</Link></li>

                    {!props.store.auth.user._id ?
                        <li onClick={() => {

                            M.Modal.init(loginBoxRef.current.firstElementChild, {}).open();

                        }}><a href="#">Login</a></li>
                        :
                        <>
                            {/* <li className="loggedin-name">
                                <Link to="/write">New Story</Link>
                            </li> */}


                            {props.store.auth.user.type == "doctor" &&
                                <>
                                    <li><Link to='/patients'>Patients</Link></li>

                                </>
                            }
                            {props.store.auth.user.type == "patient" &&
                                <>
                                    <li><Link to='/appointment'>Request Appointment</Link></li>

                                </>
                            }
                            {/* {props.store.auth.user.type != "seler" &&  <li><Link to='/chat'>Accounts</Link></li>} */}
                            {props.store.auth.user._id && <li> <Link to='/dashboard'>My Dashboard</Link></li>}
                            <li className="loggedin-name">
                                <Link to="/profile">{props.store.auth.user.name}</Link>
                            </li>
                            <li onClick={() => {

                                // M.Modal.init(loginBoxRef.current.firstElementChild, {}).open();
                                store.dispatch({
                                    type: 'USER_LOGOUT'
                                });

                                history.push('/');

                            }}><a href="#">Logout</a></li>
                        </>
                    }
                </ul>
            </div>
        </nav>


        <ul class="sidenav" id="mobile-nav">
            {/* <li><a href="#">Home</a></li>
                <li><a href="#">Video</a></li>
                <li><a href="#">Service</a></li>
                <li><a href="#">About</a></li> */}
            <li><a href="#">Login</a></li>
        </ul>

        {/* <div className="row">
                <div className="col m5 text-center">
                    <img className="logo" src="/images/logo.png" />
                    <h4 className="logo-text">The Technology Guru</h4>

                </div>
            </div> */}
        <div>
        </div>



    </header>

    // }

}

export default connect((store) => {
    return {
        store
    };
})(Header);