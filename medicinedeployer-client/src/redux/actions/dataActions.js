import { SET_PATIENTS, SET_ERRORS, CLEAR_ERRORS, LOADING_UI } from '../types';
import axios from 'axios'

export const getPatients = () => (dispatch) => {
	dispatch({ type: LOADING_UI });
	axios.get('/patients', {headers: {Authorization: localStorage.FBIdToken}})
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