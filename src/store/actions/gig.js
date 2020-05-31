import Axios from "axios"
import { toast } from "react-toastify";



export const loadReviews = (payload) => {

    return Axios.get('/api/gig/loadReviews?id=' + payload);

}

export const approveGig = (payload) => async dispatch => {

    try {

        let res = await Axios.post('/api/gig/approve_gig', payload);

        if (res.data.success) {
            if (payload.status == "pending") {
                toast.success("Gig Deactivated");
                dispatch({
                    type: 'GIG_MADE_IN_PENDING',
                    payload: payload.id
                });
            } else {
                toast.success("Gig Approved");
                dispatch({
                    type: 'GIG_APPROVED',
                    payload: payload.id
                });
            }
        }

    } catch (e) {

        toast.error(e.response ? e.response.data.error : 'Gig could not be saved!');

    }

}

export const updateGig = (payload) => async dispatch => {

    try {

        let res = await Axios.post('/api/gig/update', payload);

        if (res.data.success) {
            toast.success("gigSaved");
            dispatch({
                type: 'GIG_UPDATED',
                payload: res.data
            })
        }

    } catch (e) {

        toast.error(e.response ? e.response.data.error : 'Gig could not be saved!');

    }

}



export const getGigById = (payload) => async dispatch => {

    try {

        let res = await Axios.delete('/api/gig/get_git?id=' + payload._id);

        if (res.data.success) {
            toast.success("Gig deleted!");
            dispatch({
                type: 'GIG_DELETED',
                payload: payload
            })
        }

    } catch (e) {

        toast.error(e.response ? e.response.data.error : 'Gig could not be deleted!');

    }


}

export const deleteGig = (payload) => async dispatch => {

    try {

        let res = await Axios.delete('/api/gig/delete_gig?id=' + payload._id);

        if (res.data.success) {
            toast.success("Gig deleted!");
            dispatch({
                type: 'GIG_DELETED',
                payload: payload
            })
        }

    } catch (e) {

        toast.error(e.response ? e.response.data.error : 'Gig could not be deleted!');

    }


}

export const loadGigs = (payload) => async dispatch => {

    try {

        let res = await Axios.post('/api/gig/load_gigs', payload);

        if (res.data.success) {
            // toast.success("Gig loaded!");
            dispatch({
                type: 'POPULAR_GIGS_LOADED',
                payload: res.data.gigs
            })
        }

    } catch (e) {

        toast.error(e.response ? e.response.data.error : 'Gig could not be saved!');

    }


}

export const createGig = (payload) => async dispatch => {

    try {

        let res = await Axios.post('/api/gig/create', payload);

        if (res.data.success) {
            toast.success("Gig Saved!");
            if (payload._id) {

                dispatch({
                    type: 'GIG_UPDATED',
                    payload: res.data.gig
                });

            } else {
                dispatch({
                    type: 'GIG_SAVED',
                    payload: res.data
                });
            }
        }

    } catch (e) {

        toast.error(e.response ? e.response.data.error : 'Gig could not be saved!');

    }


}