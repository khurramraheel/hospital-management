import axios from 'axios';
import { toast } from 'react-toastify';
import M from 'materialize-css';

export const getSchedule = (payload) => {

    return axios.get('/api/schedule/get_schedule/' + payload)

}

export const confirmAppointment = (payload) => async dispatch => {

    try {

        let res = await axios.post('/api/schedule/confirm', payload)

        if (res.data.success) {
            dispatch({
                type: "APPOINTMENT_CONFIRMED",
                payload: res.data
            });


            toast.success("Appointment " + payload.status + "!");

        }
    } catch (e) {

        toast.error(e.message);

    }

}

export const createSchedule = (payload) => async dispatch => {

    try {

        let res = await axios.post('/api/schedule/create', payload)

        if (res.data.success) {
            dispatch({
                type: "APPOINTMENT_SAVED",
                payload: res.data
            });
            M.Modal.init(document.getElementById('confirmModal'), {}).close();
            toast.success("Appointment Requested!");
        }
    } catch (e) {

        toast.error(e.message);

    }

}