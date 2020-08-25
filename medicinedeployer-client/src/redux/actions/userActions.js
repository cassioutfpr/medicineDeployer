import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_AUTHENTICATED,SET_UNAUTHENTICATED } from '../types';
import axios from 'axios'

export const loginUser = (userData, history) => (dispatch) => {
	dispatch({ type: LOADING_UI });
	axios.post('/loginDoctor', userData)
		.then(res => {
			const FBIdToken = `Bearer ${res.data.token}`;
			localStorage.setItem('FBIdToken', FBIdToken);
			dispatch(getUserData());
			dispatch({ type: CLEAR_ERRORS });
			history.push('/'); //This method is used to push state and url (path) -> Goes to the home page
		})
    	.catch((err) => {
      		dispatch({
        		type: SET_ERRORS,
        		payload: err.response.data
      		});
    	});
}

export const signupUser = (newUserData, history) => (dispatch) => {
	dispatch({ type: LOADING_UI });
	axios.post('/signupDoctor', newUserData)
		.then(res => {
			const FBIdToken = `Bearer ${res.data.token}`;
			localStorage.setItem('FBIdToken', FBIdToken);
			dispatch({ type: CLEAR_ERRORS });
			history.push('/'); //This method is used to push state and url (path) -> Goes to the home page
		})
    	.catch((err) => {
      		dispatch({
        		type: SET_ERRORS,
        		payload: err.response.data
      		});
    	});
}

export const logoutUser = () => (dispatch) => {
	localStorage.removeItem('FBIdToken');
	//delete axios.defaults.headers.common['Authorization']
	console.log('logour');
	dispatch({ type: SET_UNAUTHENTICATED });
}

export const getUserData = () => (dispatch) => {
	axios.get('/doctor', {headers: {Authorization: localStorage.FBIdToken}})
		.then(res => {
			localStorage.setItem('credentials', res.data.credentials);
			localStorage.setItem('profession', res.data.profession);
			dispatch({
				type: SET_USER,
				payload: res.data,
			})
		})
		.catch(err => {
			console.log(err);
		})
}

