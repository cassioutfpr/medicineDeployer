import { SET_PATIENTS } from '../types';

const initialState = {
	patients: [],
}

export default function(state = initialState, action){
	switch(action.type){
		case SET_PATIENTS:
			return{
				patients: action.payload,
			}  
		default:
			return state; 
	}
}