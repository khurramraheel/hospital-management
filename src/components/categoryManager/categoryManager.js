import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { saveCategory, deleteCategory } from './../../store/actions/category';
import store from './../../store/store';
import { toast } from 'react-toastify';

// import { confirmAlert } from 'react-confirm-alert'; // Import
// import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


function CategoryManager(props) {

    const { register, handleSubmit, errors } = useForm();

    let [state, setState] = useState({
        categoryNotSelecetd: null
    });

    let [category, setCategory] = useState();

    const onSubmit = data => {

        // if (!category) {
        //     setState({
        //         categoryNotSelecetd: true
        //     });
        // }

        // toDataURL(URL.createObjectURL(data.pic[0], { oneTimeOnly: true })).then((base64) => {
        //     data.pic = base64;
        //     saveMedicine(data);
        // });

    }


    return <div id="categoryModal" class="card">
        <div class="card-content">
            <h5 className="text-left">Category Manager</h5>

            <form action="" onSubmit={handleSubmit(onSubmit)}>


                <div class="row" id="registerTextFields">
                    <div class="input-field col s12">

                        <table className="striped">
                            {
                                props.store.gigs.categories.map((category) => {
                                    return <tr>
                                        <td>{category.categoryID}</td>
                                        <td>{category.name}</td>
                                        <td><button onClick={() => {

                                            let modal = window.M.Modal.init(document.getElementById('categoryModal'));
                                            modal.close();

                                            if (window.confirm("Are you sure, you want too delete category(" + category.name + ")")) {
                                                deleteCategory(category._id);
                                                // modal.open();
                                            } else {
                                                // modal.open();
                                            }

                                            // confirmAlert({
                                            //     title: 'Delete Category (' + category.name + ')',
                                            //     message: 'Are you sure to do this.',
                                            //     buttons: [
                                            //         {
                                            //             label: 'Yes',
                                            //             onClick: () => {
                                            //                 deleteCategory(category._id);
                                            //                 modal.open();
                                            //             }
                                            //         },
                                            //         {
                                            //             label: 'No',
                                            //             onClick: () => {
                                            //                 modal.open();
                                            //             }
                                            //         }
                                            //     ]
                                            // });

                                        }}>DELETE</button></td>
                                    </tr>
                                })}

                        </table>

                    </div>
                </div>

                <div class="card-action text-center">
                    <button onClick={() => {

                        let categoryName = prompt("Enter Category name");

                        let categoryAlreadyExist = props.store.gigs.categories.filter((category) => {
                            return category.name.toLowerCase() == categoryName.toLowerCase();
                        }).length;

                        if (categoryAlreadyExist) {
                            toast.error("Category (" + categoryName + ") already exists");
                        } else {

                            let category = {
                                name: categoryName
                            };

                            saveCategory(category);

                        }

                    }} class="btn waves-effect waves-light" type="button" name="action">Add Category</button>
                </div>


            </form>
        </div>
    </div>

}

export default connect((store) => {
    return {
        store
    };
})(CategoryManager);