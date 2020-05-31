import M from 'materialize-css';
import { toast } from 'react-toastify';
import Axios from 'axios';


export const placeOrder = (payload) => async dispatch => {

    try {

        let res = await Axios.post('/api/order/place_order', payload);

        if (res.data.success) {
            toast.success("Order placed!");
            dispatch({
                type: 'ORDER_PLACED',
                payload: payload
            })
        }

    } catch (e) {

        toast.error(e.response ? e.response.data.error : 'Gig could not be deleted!');

    }

}

export const completeOrderFromBuyer = (payload) => async dispatch => {

    try {

        let res = await Axios.post('/api/order/complete_order_buyer', payload);

        if (res.data.success) {
            toast.success("Order marker as completed!");
            if (payload.type == "buyer") {
                dispatch({
                    type: 'ORDER_MARKED_COMPLETED',
                    payload: payload
                });
            }else if(payload.type == "seller"){
                
                M.Modal.init(document.getElementById('paymentModal'),{}).close();

                dispatch({
                    type: 'ORDER_MARKED_COMPLETED_SELLER',
                    payload: payload
                });
            }
            M.Modal.init(document.getElementById('orderCompletionBox'), {}).close();
        }

    } catch (e) {

        toast.error(e.response ? e.response.data.error : 'Gig could not be deleted!');

    }

}


export const confirmOrder = (payload) => async dispatch => {

    try {

        let res = await Axios.post('/api/order/confirm_order?id=' + payload._id);

        if (res.data.success) {
            toast.success("Order confirmed!");
            dispatch({
                type: 'ORDER_CONFIRMED',
                payload: payload
            })
        }

    } catch (e) {

        toast.error(e.response ? e.response.data.error : 'Gig could not be deleted!');

    }


}