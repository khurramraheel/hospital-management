import React from 'react';
import { useForm } from 'react-hook-form';
import { sendMessage } from './../../store/actions/misc';
import './contact.css';
import history from './../../history';
import $ from 'jquery';
import { connect } from 'react-redux';
import store from './../../store/store';

function Contact(props) {

    const { register, handleSubmit, errors } = useForm();


    return <div id="contact-component">
        <div className="card">

            <div className="card-content">

                {!props.store.auth.requestingPassword ?

                    <form onSubmit={handleSubmit((data) => {

                        store.dispatch({
                            type: 'REQUEST_PASSWORD_START'
                        });

                        data.callback = () => {

                            store.dispatch({
                                type: 'REQUEST_PASSWORD_END'
                            });

                            $('#name, #email, #subject, #yourmessage').val('');
                            setTimeout(() => {
                                history.push('/');
                            }, 2000);

                        }

                        sendMessage(data);

                    })}>
                        <div>
                           <span className="contact-title">Contact Us!</span> 
                           {/* <img className="ct-icon" src="/images/contact.png" /> */}
                        </div>
                        <div class="row">
                            <div class="input-field col s12">
                                <input id="name" type="text" class="validate" name="name" ref={register({ required: true, minLength: 3 })} />
                                <label for="name">Name</label>
                                {errors.name && errors.name.type === 'required' && <span id="errors" class="helper-text" > This field is Required</span>}
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-field col s12">
                                <input id="email" type="email" class="validate" name="email" ref={register({ required: true })} />
                                <label for="email">Email</label>
                                {errors.email && errors.email.type === 'required' && <span id="errors" class="helper-text" > Email field is Required</span>}
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-field col s12">
                                <input id="subject" type="text" class="validate" name="subject" ref={register({ required: true, minLength: 3 })} />
                                <label for="name">Subject</label>
                                {errors.subject && errors.subject.type === 'required' && <span id="errors" class="helper-text" > Subject field is Required</span>}
                            </div>
                        </div>
                        <div class="row" id="registerTextFields">
                            <div class="input-field col s12">

                                <textarea id="yourmessage" rows="7" type="text" class="validate projectScope" name="yourmessage" ref={register({ required: true, minLength: 3 })}>
                                </textarea>

                                <label for="yourmessage">Your Message</label>
                                {errors.yourmessage && errors.yourmessage.type === 'required' && <span id="errors" class="helper-text" >Please let us know your message!</span>}
                                {/* {errors.projectExplanation && errors.projectExplanation.type === 'minLength' && <span id="errors" class="helper-text" > Name must contain Three letters</span>} */}
                            </div>
                        </div>

                        <div class="row" id="registerTextFields">
                            <div class="input-field col s12">
                                <button class="btn waves-effect waves-light" type="submit" name="action">Send Message                                
                                </button>
                            </div>
                        </div>
                    </form> : <div className="waitingWindow">
                        <div className="waitIcon">
                            <img src="/images/loading-update.gif" />
                            <div>We are sending your message..</div>
                        </div>
                    </div>
                }
                {/* </div> */}
            </div>

        </div>
    </div >

}

export default connect((store) => {
    return {
        store
    };
})(Contact);