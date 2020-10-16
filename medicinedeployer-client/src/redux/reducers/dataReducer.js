import { SET_PATIENTS, SET_ORDERS, SET_MEDICATION } from '../types';

const initialState = {
	patients: [],
	orders: [],
	medication: [],
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
		case SET_MEDICATION:
			return{
				medication: action.payload,
			}
		default:
			return state; 
	}
}