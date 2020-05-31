import React from 'react';
import { useForm } from 'react-hook-form';
import './resetPassword.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { createNewPassword } from './../../store/actions/auth';

function ResetPassword(props) {

    const { register, handleSubmit, errors, watch } = useForm();
    
    localStorage.clear();

    return <div id="resetPassword">
        <form onSubmit={handleSubmit((data) => {

            props.createNewPassword({ 
                token: props.match.params.token, 
                password: data.confirmPassword 
            });
            
        })}>
            <div class="row">
                <div class="input-field col s12">
                    <input id="newPassword" type="password" class="validate" name="newPassword" ref={register({ required: true })} />
                    <label for="newPassword">New Password</label>
                    {errors.newPassword && errors.newPassword.type === 'required' && <span id="errors" class="helper-text" > This field is Required</span>}
                </div>
            </div>

            <div class="row">
                <div class="input-field col s12">
                    <input id="confirmPassword" type="password" required name="confirmPassword" ref={register({
                        validate: (value) => {
                            // debugger;
                            return value === watch('newPassword')
                        }
                    })} />
                    <label for="confirmPassword">Confirm New Password</label>
                    {errors.confirmPassword && errors.confirmPassword.type === 'validate' && <span id="errors" class="helper-text" >The passwords do not match</span>}
                </div>
            </div>

            <div class="card-action">

                <button class="btn waves-effect waves-light" type="submit" name="action">Reset Password
                </button>
            </div>

        </form>
    </div>
}


export default connect(null, { createNewPassword })(withRouter(ResetPassword));