
import Axios from 'axios';
import { toast } from 'react-toastify';

export const sendMessage = async (payload) => {

    let res = {};

    let data = payload.callback;

    delete payload.callback;

    try {

       let res = await Axios.post('/api/auth/sendmessage', payload);

       if(res.data.success){
        
            data();
           toast.success(res.data.message);
       }


    } catch (e) {

        toast.warn(res.response ? res.response.data.error : "Oops, We cannot receive your message right now!");
        
    }

}

export const sendInvites = (payload) => {

    try {

       let res = Axios.post('/api/project/updateInvites', payload);

       toast.success('Project invites updated successfully');

    } catch (e) {

        toast.error('Project invites could not be updated!');
        
    }

}

export const searchItems = (searchText, ) => {


    return Axios.get('/api/users/search?query=' + searchText);

}