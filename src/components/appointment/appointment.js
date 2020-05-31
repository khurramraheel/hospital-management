import React, { useState } from 'react';

import './appointment.css';
import { login, requestNewPassword } from './../../store/actions/auth';
import { connect } from 'react-redux';
import M from 'materialize-css';
import { useForm } from 'react-hook-form';

import history from './../../history';


function Login(props) {


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

    const { register, handleSubmit, errors } = useForm();
    const data = useForm();

    const register1 = data.register;
    const handleSubmit1 = data.handleSubmit;
    const errors1 = data.errors;

    let [forgetPassword, setForgetPassword] = useState();

    const onSubmit = data => {
        // registerHandler(data)
        console.log(data)

        props.login(data);

    }

    return <div id="appointmentComponent" className="card">

        <div >

            {/* <img className="wd-50" src="/gamica.png" /> */}
            <h6 className="text-left def-heading">Schedule an Appointment</h6>
            <form className="card-content" action="" onSubmit={handleSubmit(onSubmit)}>


                <div class="row" id="registerTextFields">
                    <div class="input-field col s12">
                        <input id="email" type="email" class="validate" name="email" ref={register({ required: true })} />
                        <label for="email">Email</label>
                        {errors.email && errors.email.type === 'required' && <span id="errors" class="helper-text" > This is Required</span>}
                    </div>
                </div>
                <div class="row" id="registerTextFields">
                    <div class="input-field col s12">
                        <input id="password" type="password" class="validate" name="password" ref={register({ required: true })} />
                        <label for="password">Password</label>
                        {errors.password && errors.password.type === 'required' && <span id="errors" class="helper-text" >Please type in your password</span>}
                    </div>
                </div>



                <div class="card- text-center">

                    <button class="btn waves-effect waves-light" type="submit" name="action">Login
                    </button>
                </div>

                <a onClick={() => {
                    setForgetPassword(!forgetPassword);
                }} className="text-black pointer">Forget password</a>
                    &nbsp;&nbsp;&nbsp;
                <a onClick={() => {
                    M.Modal.init(document.getElementById('loginModel'), {}).close();
                    history.push('/signup');
                }} className="text-black pointer">New here?</a>



                {/* <input type="email" placeholder="Enter Email" name="email" class="validate" ref={register({ required: true, minLength: 3 })}  />
                <input type="password" placeholder="Enter Password" name="password" value={password} onChange={e => onChange(e)} />
                <a onClick={e => onSubmit(e)} class="waves-effect waves-light btn"><i class="material-icons left">lock_open</i>Login</a> */}
            </form>

            {!props.store.auth.requestingPassword && <div>
                <form onSubmit={handleSubmit1((data) => {
                    props.requestNewPassword({
                        email: data.forgetPassword, callback: () => {
                            setForgetPassword(false);
                            M.Modal.init(document.getElementById('loginModel'), {}).close();
                        }
                    });
                })}>

                    {forgetPassword ? <>
                        <div class="row">
                            <div class="input-field col s12">
                                <input id="forgetPassword" type="email" class="validate" name="forgetPassword" ref={register1({ required: true })} />
                                <label for="forgetPassword">Email</label>
                                {errors1.forgetPassword && errors1.forgetPassword.type === 'required' && <span id="errors" class="helper-text" >Please let us know your email!</span>}
                            </div>
                        </div>
                        <div class="card-action text-center">
                            <button class="btn waves-effect waves-light" type="submit" name="action">Request Password
                            </button>
                        </div>
                    </> : null}

                </form>
            </div>
            }
        </div>
    </div>

}

export default connect((store) => {
    return { store };
}, { login, requestNewPassword })(Login)