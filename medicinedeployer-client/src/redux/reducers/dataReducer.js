import { SET_PATIENTS } from '../types';

const initialState = {
	patients: [],
	orders: []
}

export default function(state = initialState, action){
	switch(action.type){
		case SET_PATIENTS:
			return{
				patients: action.payload,
			}
		case SET_ORDERS:
			return{
				orders: action.payload,
			}    
		default:
			return state; 
	}
}