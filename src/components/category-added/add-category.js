import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';

import { updateCategory, saveCategory } from './../../store/actions/category';

function CategoryAdded(props) {

    const { register, handleSubmit, errors } = useForm();
    const [upImg, setUpImg] = useState(props.category.profilePic);

    const onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setUpImg(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return <div id="categoryAddForm" className="modal">

        <div className="modal-content">

            <form onSubmit={handleSubmit((data) => {

                data.profilePic = upImg;

                if (props.category) {
                    data = { ...props.category, ...data };
                }

                if (data._id) {
                    props.updateCategory(data);
                } else {
                    props.saveCategory(data);
                }

            })}>

                <div class="row">
                    <div class="input-field col s12">
                        <input defaultValue={props.category.name} id="name" type="text" class="validate" name="name" ref={register({ required: true, minLength: 3 })} />
                        <label for="name" className="active">Name</label>
                        {errors.name && errors.name.type === 'required' && <span id="errors" class="helper-text" > This field is Required</span>}
                    </div>
                </div>



                <div className="row">
                    <div className="col s12">
                        <input onChange={onSelectFile} hidden id="profilePic" type="file" accept="image/*" class="validate" name="profilePic" ref={register({
                            validate: (files) => {
                                if (upImg) {
                                    return true;
                                }
                                return files.length != 0;
                            }
                        })} />
                        <label onClick={() => {

                            // seUpdatingProfilePic(true);

                        }} for="profilePic" className="active">Choose Profile Pic</label>

                    </div>
                </div>

                <div className="row">
                    <div className={"col s12"}>
                        {<div className="previewBox">
                            <img alt="Crop preview" src={upImg || props.category.profilePic || '/images/user.png'} />
                            <div>
                                <small>Category Thumbnail Image</small>
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

                <div className="row">

                    <button className="def-btn">Submit</button>

                </div>

            </form>

        </div>

    </div>

}

export default connect((store) => {
    return { store };

}, { updateCategory, saveCategory })(CategoryAdded);