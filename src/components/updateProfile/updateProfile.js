import React, { useEffect, useState, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
// import ReactCrop from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';
import $ from 'jquery';

import './updateProfile.css';
import { updateProfile } from './../../store/actions/auth';

// function dataURLtoFile(dataurl, filename) {

//     var arr = dataurl.split(','),
//         mime = arr[0].match(/:(.*?);/)[1],
//         bstr = atob(arr[1]),
//         n = bstr.length,
//         u8arr = new Uint8Array(n);

//     while (n--) {
//         u8arr[n] = bstr.charCodeAt(n);
//     }

//     return new File([u8arr], filename, { type: mime });
// }


function UpdateProfile(props) {

    const { register, handleSubmit, errors } = useForm();


    const [userType, setUserType] = useState('patient');

    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState();

    const [updatingProfilePic, seUpdatingProfilePic] = useState(false);

    const onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setUpImg(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const onLoad = useCallback(img => {
        imgRef.current = img;
    }, []);

    const makeClientCrop = async crop => {
        if (imgRef.current && crop.width && crop.height) {
            createCropPreview(imgRef.current, crop, 'newFile.jpeg');
        }
    };

    const createCropPreview = async (image, crop, fileName) => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {

            let base64 = canvas.toDataURL();
            setPreviewUrl(base64);

            // base64 => {
            // if (!blob) {
            //     reject(new Error('Canvas is empty'));
            //     return;
            // }
            // blob.name = fileName;
            // window.URL.revokeObjectURL(previewUrl);
            // setPreviewUrl(window.URL.createObjectURL(blob));
            // }, 'image/jpeg');
        });
    };

    useEffect(() => {

        $('#updateProfile label').addClass('active');

    });

    // if (props.store.auth.user.profilePic && !previewUrl) {

    //     // dataURLtoFile(props.store.auth.user.profilePic, "data.jpg");

    //     setPreviewUrl(props.store.auth.user.profilePic);
    // }

    // render = () => {

    return <div id="updateProfile">
        <form onSubmit={handleSubmit((data) => {
            // setTakingProjectIdea(true);
            // setTakingProject(false);
            // initiaData = data;

            props.updateProfile({
                ...data,
                type: userType,
                _id: props.store.auth.user._id,
                profilePic: upImg
            });

        })}>
            <div class="card">
                {/* <div class="card-image">
                    <img src="/images/card.jpg" />
                    <span class="card-title">Sign Up</span>
                </div> */}

                <div class="card-content" id="registerCardContent">
                    {!props.store.auth.user._id && <div class="row" id="registerTextFields">
                        <div className="col m4">
                            <strong>I am a </strong>
                        </div>
                        <div class="input-field col m4">
                            <label>
                                <input name="group1" value="doctor" type="radio" onChange={(evt) => {

                                    setUserType(evt.target.value);

                                }} checked={userType == "doctor" && true} />
                                <span>Doctor</span>
                            </label>
                        </div>
                        <div class="input-field col m4">
                            <label>
                                <input name="group1" value="patient" type="radio" onChange={(evt) => {

                                    setUserType(evt.target.value);

                                }} checked={userType == "patient" && true} />
                                <span>Patient</span>
                            </label>
                        </div>
                    </div>}
                    <div class="row" id="registerTextFields">
                        <div class="input-field col s12">
                            <input defaultValue={props.store.auth.user.name} id="name" type="text" class="validate" name="name" ref={register({ required: true, minLength: 3 })} />
                            <label for="name" className="active">Name</label>
                            {errors.name && errors.name.type === 'required' && <span id="errors" class="helper-text" > This field is Required</span>}
                            {errors.name && errors.name.type === 'minLength' && <span id="errors" class="helper-text" > Name must contain Three letters</span>}
                        </div>
                    </div>

                    <div class="row" id="registerTextFields">
                        <div class="input-field col s12">
                            <input defaultValue={props.store.auth.user.email} id="email" type="email" class="validate" name="email" ref={register({ required: true })} />
                            <label for="email" className="active">Email</label>
                            {errors.email && errors.email.type === 'required' && <span id="errors" class="helper-text" > This field is Required</span>}
                        </div>
                    </div>

                    <div class="row" id="registerTextFields">
                        <div class="input-field col s12">
                            <input id="password" type="password" class="validate" name="password" ref={register({ required: true })} />
                            <label for="password">New Password</label>
                            {errors.password && errors.password.type === 'required' && <span id="errors" class="helper-text" > This field is Required</span>}
                        </div>
                    </div>



                    <div class="row" id="registerTextFields">
                        <div class="input-field col s12">
                            <input defaultValue={props.store.auth.user.cnic} id="cnic" type="number" class="validate" name="cnic" ref={register({ required: true })} />
                            <label for="cnic" className="active">CNIC</label>
                            {errors.cnic && errors.cnic.type === 'required' && <span id="errors" class="helper-text" > This field is Required</span>}
                        </div>
                    </div>

                    <div class="row" id="registerTextFields">
                        <div class="input-field col s12">
                            <textarea  defaultValue={props.store.auth.user.about} id="about" type="number" class="validate height-100" name="about" ref={register({ required: true })}></textarea>
                            <label for="cnic" className="active">About</label>
                            {errors.about && errors.about.type === 'required' && <span id="errors" class="helper-text" > This field is Required</span>}
                        </div>
                    </div>

                    <div className="row" id="registerTextFields">
                        <div className="col s12">
                            <input onChange={onSelectFile} hidden defaultValue={props.store.auth.user.profilePic} id="profilePic" type="file" accept="image/*" class="validate" name="profilePic" ref={register({
                                validate: (files) => {
                                    if (upImg) {
                                        return true;
                                    }
                                    return files.length != 0;
                                }
                            })} />
                            <label onClick={() => {

                                seUpdatingProfilePic(true);

                            }} for="profilePic" className="active">Choose Profile Pic</label>

                        </div>
                    </div>

                    <div className="row">
                        {/* {updatingProfilePic && <div className="col s6 m6">
                            <ReactCrop
                                src={upImg}
                                onImageLoaded={onLoad}
                                crop={crop}
                                onChange={c => setCrop(c)}
                                onComplete={makeClientCrop}
                            />
                        </div>} */}
                        <div className={"col s12"}>
                            {<div className="previewBox">
                                <img alt="Crop preview" src={props.store.auth.user.profilePic || upImg || '/images/user.png'} />
                                <div>
                                    <small>Your Profile Image</small>
                                </div>
                            </div>
                            }
                        </div>
                    </div>

                    <div className="row">

                        <div className="col s12 m12">
                            {errors.profilePic && errors.profilePic.type === 'validate' && <span id="errors" class="helper-text">Please select a profile picture!</span>}

                        </div>

                    </div>

                    {/* <label>
                        <input id="checkBox" type="checkbox" onClick={e => onCheck(e)} />
                        <span>Request Group</span>
                    </label><br />
                    {check.checked == false &&
                        <div>
                            <div class="row" id="registerTextFields">
                                <div class="input-field col s12">
                                    <input id="university" type="text" class="validate" name="groupName" ref={register({ required: true })} />
                                    <label for="university">Group Name</label>
                                    {errors.groupName && errors.groupName.type === 'required' && <span id="errors" class="helper-text" > This is Required</span>}
                                </div>
                            </div>

                            <div class="chips chips-autocomplete"></div>
                        </div>} */}



                </div>
                <div class="card-action" id="registerButton">

                    {/* onClick={() => {
                         setTakingProjectIdea(true);
                         setTakingProject(false);
                    }}  */}

                    <button class="btn waves-effect waves-light" name="action">{props.store.auth.user._id ? 'Update Profile' : 'Sign up'}</button>
                </div>
                {/* <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} store={ToastsStore} /> */}
            </div>
        </form>
    </div>

    //  }
}

export default connect((store) => {

    return {
        store
    };

}, { updateProfile })(UpdateProfile);
