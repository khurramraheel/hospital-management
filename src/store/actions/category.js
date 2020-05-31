import axios from 'axios';
import { toast } from 'react-toastify';
import store from './../store';

// let host = "http://localhost:5000";
let host = "";


export const loadCategory = async (payload) => {
    try {
        let res = await axios.get(host + '/api/category/getall');
        if (Array.isArray(res.data)) {
            toast.success("Categories loaded successfully");
            store.dispatch({
                type: 'CATEGORY_LOADED',
                payload: res.data
            });
        }
    } catch (e) {
        toast.success("Categories could not be loaded!");
    }
}

export const deleteCategory = (medID) => async dispatch => {
    try {
        let res = await axios.delete(host + '/api/category/delete/' + medID);
        if (res.data._id) {
            toast.success("Category deleted successfully");
            store.dispatch({
                type: 'CATEGORY_REMOVED',
                payload: medID
            });
        }
    } catch (e) {
        toast.success("Category could not be deleted!");
    }
}

export const updateCategory = (payload) => async dispatch => {
    try {
        let res = await axios.put(host + '/api/category/update', payload);
        if (res.data._id) {
            toast.success("Category updated successfully");
            store.dispatch({
                type: "CATEGORY_UPDATED",
                payload: res.data
            });
        }
    } catch (e) {
        toast.success("Category could not be updated!");
    }
}

export const saveCategory = (payload) => async dispatch => {
    try {
        let res = await axios.post(host + '/api/category/create', payload);
        if (res.data._id) {
            toast.success("Category added successfully");
            store.dispatch({
                type: "CATEGORY_ADDED",
                payload: res.data
            });
        }
    } catch (e) {
        toast.success("Category could not be added!");
    }
}