import { SET_PATIENTS, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_ORDERS, SET_MEDICATION } from '../types';
import axios from 'axios'

export const getPatients = () => (dispatch) => {
	dispatch({ type: LOADING_UI });
	axios.get(`/patients/${localStorage.hospital}`, {headers: {Authorization: localStorage.FBIdToken}})
  		.then(response => {
  			console.log(response.data)
			dispatch({
				type: SET_PATIENTS,
				payload: response.data,
			});
			dispatch({ type: CLEAR_ERRORS });
		})
		.catch((err) => {
      		dispatch({
        		type: SET_ERRORS,
        		payload: err.response.data
      		});
    	});
}

export const getOrders = () => (dispatch) => {
	dispatch({ type: LOADING_UI });
	axios.get(`/getOrders/${localStorage.hospital}`, {headers: {Authorization: localStorage.FBIdToken}})
  		.then(response => {
  			console.log(response.data)
			dispatch({
				type: SET_ORDERS,
				payload: response.data,
			});
			dispatch({ type: CLEAR_ERRORS });
		})
		.catch((err) => {
      		dispatch({
        		type: SET_ERRORS,
        		payload: err.response.data
      		});
    	});
}

export const getDeliveredOrders = () => (dispatch) => {
	dispatch({ type: LOADING_UI });
	axios.get(`/admin/getDeliveredOrders/${localStorage.hospital}`, {headers: {Authorization: localStorage.FBIdToken}})
  		.then(response => {
  			console.log(response.data)
			dispatch({
				type: SET_ORDERS,
				payload: response.data,
			});
			dispatch({ type: CLEAR_ERRORS });
		})
		.catch((err) => {
      		dispatch({
        		type: SET_ERRORS,
        		payload: err.response.data
      		});
    	});
}

export const getMedication = () => (dispatch) => {
	dispatch({ type: LOADING_UI });
	axios.get(`/admin/getMedication/${localStorage.hospital}`, {headers: {Authorization: localStorage.FBIdToken}})
  		.then(response => {
  			console.log(response.data)
			dispatch({
				type: SET_MEDICATION,
				payload: response.data,
			});
			dispatch({ type: CLEAR_ERRORS });
		})
		.catch((err) => {
      		dispatch({
        		type: SET_ERRORS,
        		payload: err.response.data
      		});
    	});
}

export const updateOrders = () => (dispatch) => {
	axios.get(`/updateOrders`, {headers: {Authorization: localStorage.FBIdToken}})
  		.then(response => {
  			console.log(response.data)
		})
		.catch((err) => {
			console.log(err)	
    	});
}