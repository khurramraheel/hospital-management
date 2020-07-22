import axios from 'axios';
import history from './../../history';

// import { ToastsContainer, ToastsStore } from 'react-toasts';
import { toast } from 'react-toastify';
import M from 'materialize-css';

export const getUser = (payload) => {

    return axios.post('/api/auth/get_user', payload);


}

export const loadChatMessages = (payload) => { 

    return axios.post('/api/auth/load_chat_messages', payload);

}

export const decodeJSONToken = (token) => {

    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export const checkUserSession = (body) => async dispatch => {

    let myToken = localStorage.getItem("token");
    if (!myToken) {

        try {
            let res = await axios.get('/api/category/getall');
            dispatch({
                type: 'CATEGORY_LOADED',
                payload: res.data
            });
        } catch (e) {

        }

        return;
    }

    try {

        const res = await axios.get('/api/auth/session', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `Bearer ${myToken}`
            }
        });

        if (res.data.success) {

            dispatch({
                type: 'CATEGORY_LOADED',
                payload: res.data.categories
            });

            dispatch({
                type: "LOGIN_SUCCESSFUL",
                payload: res.data.user,
                users: res.data.users,
            });

            dispatch({
                type: 'APPOINTMENT_LOADED',
                payload: res.data.appointments
            });


            // dispatch({
            //     type: 'USER_GIGS_LOADED',
            //     payload: res.data.user.gigs
            // });

            // let loggedUser = res.data.loggedInUser;

            // if (loggedUser.type == "student") {
            //     dispatch({
            //         type: 'PROJECT_LOADED',
            //         payload: loggedUser.project
            //     });

            //     dispatch({
            //         type: "EXT_PROJECTS_LOADED",
            //         payload: loggedUser.projects
            //     });
            // }

        } else {
            dispatch({
                type: 'CATEGORY_LOADED',
                payload: res.data.categories
            })
            history.push('/');
        }


    } catch (err) {

        dispatch({
            type: "LOGIN_FAIL"
        });

    }
}

export const updateProfile = (body) => async dispatch => {

    try {

        const res = await axios.post('/api/auth/signup', body);

        if (res.data.success) {

            if (body._id) {

                dispatch({
                    type: "PROFILE_UPDATED",
                    payload: res.data.userData
                });

                toast.success("Profile updated!");

            } else {
                history.push('/');
                M.Modal.init(document.getElementById('loginInHeader').firstChild, {}).open();

            }


        } else {

            toast.warn("Oops, profile could not be updated");

        }


    } catch (err) {

        toast.error(err.response && err.response.data ? err.response.data.error : "Could not update profile!");


        // dispatch({
        //     type: "LOGIN_FAIL"
        // });

    }
}


export const createNewPassword = (body) => async dispatch => {

    try {

        const res = await axios.post('/api/auth/updatePassword', body);

        if (res.data.success) {
            toast.success("Password updated!");
            history.push('/');
        } else {
            toast.warn(res.data.error);
        }


    } catch (err) {
        toast.warn(err.response ? err.response.data : "Could not signup!");

    }
}

export const updateAccount = (body) => async dispatch => {

    try {

        const res = await axios.post('/api/auth/updateAccount', body);

        if (res.data.success) {
            toast.success("Account " + (body.status == "unactive" ? "Deactivated" : "Activated"));

            dispatch({
                type: "ACCOUNT_STATUS_ACTIVATED",
                payload: { ...res.data.user, ...body }
            });


        } else {
            toast.err(res.data.error);
        }


    } catch (err) {
        toast.warn(err.response ? err.response.data : "Could not update account!");

    }
}

export const loadMessages = (payload) => {

    return axios.post('/api/auth/loadmessages', payload);

}

export const checkPassExistence = (email) => {

    return axios.get('/api/auth/checkuser?email=' + email);

}

export const requestNewPassword = (body) => async dispatch => {

    dispatch({
        type: 'REQUEST_PASSWORD_START'
    });

    try {

        const res = await axios.get('/api/auth/requestpasssword?email=' + body.email);

        if (res.data.success) {
            toast.success("Please check your email!");
            body.callback();
            dispatch({
                type: 'REQUEST_PASSWORD_END'
            });
        } else {
            toast.warn(res.data.error);
            dispatch({
                type: 'REQUEST_PASSWORD_END'
            });
        }


    } catch (err) {

        toast.warn(err.message);
        dispatch({
            type: 'REQUEST_PASSWORD_START_END'
        });

    }
}

export const login = (body) => async dispatch => {

    try {

        const res = await axios.post('/api/auth/login', body);

        if (res.data.success) {

            localStorage.setItem('token', res.data.token);

            dispatch({
                type: 'APPOINTMENT_LOADED',
                payload: res.data.appointments
            });

            dispatch({
                type: 'CATEGORY_LOADED',
                payload: res.data.categories
            });

            dispatch({
                type: "LOGIN_SUCCESSFUL",
                users: res.data.users,
                payload: res.data.loggedUser,
            });

            dispatch({
                type: "USER_ORDERS_LOADED",
                pending: res.data.pending,
                active: res.data.active,
                sellerOrders: res.data.sellerOrders,
                userOrders: res.data.loggedUser.orders,
                // payload: res.data.loggedUser.orders,
            });

            M.Modal.init(document.getElementById('loginModel'), {}).close();

            dispatch({
                type: 'USER_GIGS_LOADED',
                payload: res.data.loggedUser.gigs
            });


            history.push('/dashboard');


        }


    } catch (err) {

        toast.error(err.response && err.response.data ? err.response.data.error : "Could not login!");
        dispatch({
            type: "LOGIN_FAIL"
        });

    }
}

//Register User and Project at the same time
export const registerHandler = (body) => async dispatch => {

    let callback = body.callback;

    try {

        delete body.callback;

        const res = await axios.post('/api/users/create', body);

        dispatch({
            type: "LOGIN_SUCCESSFUL",
            payload: { loggedInUser: res.data.user }
        });
        dispatch({
            type: "REGISTER_SUCCESS",
            payload: res.data
        })


        dispatch({
            type: 'PROJECT_LOADED',
            payload: res.data.user.project
        });

        callback();

        toast.success("User Registered Succefully!");

    } catch (err) {

        toast.error(err.response ? err.response.data.error : err.message);

        dispatch({
            type: "REGISTER_FAIL"
        })
    }
}



export const loadUsers = () => async dispatch => {
    try {
        const res = await axios.get('/api/users/getusers');
        dispatch({
            type: "LOAD_USERS",
            payload: res.data
        })

    } catch (error) {
        console.log(error.message)
    }
}