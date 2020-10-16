import React from 'react';
import PropTypes from 'prop-types'
import axios from 'axios'
//Components
import Navbar from '../components/Navbar'
import SelectedListItem from '../components/SelectedListItem'
import SelectedListItemPharmaceutical from '../components/SelectedListItemPharmaceutical'
import CustomizedTables from '../components/CustomizedTables'
import PatientGeneralInfo from '../components/PatientGeneralInfo'
import EnhancedTable from '../components/EnhancedTable'
import EnhancedTableOrders from '../components/EnhancedTableOrders'
import EnhancedTableMedication from '../components/EnhancedTableMedication'
import SupportDialog from '../components/SupportDialog'
import Button from '@material-ui/core/Button';
//MUI
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

//Redux stuff
import { connect } from 'react-redux';
import { getPatients, getOrders, getDeliveredOrders, getMedication } from '../redux/actions/dataActions';

const styles = {
	generalInfo:{
		textAlign:'center'
	},
	selectedList:{
		textAlign:'left',
		backgroundColor: '#0096cd',
      	position: 'absolute',
  		left: '0',
  		bottom: '0',
  		top: '65px',
  		overflow: 'auto',
	},
	tables:{
		textAlign:'center',
		padding: '0px 10px 0px 10px'
	},
	patientsGrid:{
		marginBottom: '10px',
	},
}

class home extends React.Component{
  	constructor(){
  		super()
  		this.state = {
  			itemSelectedList: 'list_of_patients',
  			patientsInfo: {},
  			ordersInfo: {},
  			showMedication: false
  		}
  		this.showButtonClicked  = this.showButtonClicked .bind(this);
  	}

	isEmpty(obj) {
    	for(var prop in obj) {
        	if(obj.hasOwnProperty(prop))
            	return false;
    	}
    	return true;
  	}

  	componentDidMount(){
  		if(localStorage.profession === 'doctor')
  		{
  			clearInterval(this.interval);
  			this.props.getPatients();
  			//this.state.opabeleza = null;
  		}
  		else if(localStorage.profession === 'pharmaceutical')
  		{
  			//this.interval = null;
  			this.props.getOrders();
  			this.interval = setInterval(()=> this.props.getOrders(), 60000);
  		}
  		else if(localStorage.profession === 'admin')
  		{
  			//this.interval = null;
  			this.props.getDeliveredOrders();
  			//this.props.getMedication();
  			//console.log(this.props.medication)
  			//this.interval = setInterval(()=> this.props.getDeliveredOrders(), 60000);
  		}
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}


  	handleChange = value => this.setState({itemSelectedList: value})


   	showButtonClicked = () => {
   		if(this.state.showMedication === false)
   		{
   			this.props.getMedication();
   		}
   		else
   		{
   			this.props.getDeliveredOrders();
   		}
	    this.setState(state => ({      
	    	showMedication: !state.showMedication
	    }));
	};

	render(){
	const { classes, UI: { loading } } = this.props;
		if(this.state.itemSelectedList === 'list_of_patients' && localStorage.profession === 'doctor')
			return(
			  	<div>
			    	<Navbar />
			    	<Grid container>
				  		<Grid className={classes.selectedList} item xs={2}>
				  			<SelectedListItem itemSelectedList={this.state.itemSelectedList} onChange={this.handleChange}/>
				  			<SupportDialog/>
				  		</Grid>
				  	</Grid>	
					<Grid container className={classes.patientsGrid}>
						<Grid className={classes.tables} item xs={2}/>
                    	<Grid className={classes.tables} item xs={10}>
                        	{loading && this.isEmpty(this.props.data.patients) ? <CircularProgress size={30} className={classes.progress}/> : <EnhancedTable patients={this.props.data.patients} title="Lista Completa de Pacientes" getPatients={this.props.getPatients}/>}
                    	</Grid>
					</Grid>
			 	</div>
			);
		else if(this.state.itemSelectedList === 'add_patient' && localStorage.profession === 'doctor')
			return(
			  	<div>
			    	<Navbar />
			    	<Grid container>
				  		<Grid className={classes.selectedList} item xs={2}>
				  			<SelectedListItem itemSelectedList={this.state.itemSelectedList} onChange={this.handleChange}/>
				  			<SupportDialog/>
				  		</Grid>
					</Grid>
					<Grid container className={classes.patientsGrid}>
						<Grid className={classes.tables} item xs={2}/>
                    	<Grid className={classes.tables} item xs={10}>
                        	{loading && this.isEmpty(this.props.data.patients) ? <CircularProgress size={30} className={classes.progress}/> : <EnhancedTable patients={this.props.data.patients} title="Lista Completa de Pacientes" getPatients={this.props.getPatients}/>}
                    	</Grid>
					</Grid>
			 	</div>
			);
		else if(localStorage.profession === 'pharmaceutical')
			return(
			  	<div>
			    	<Navbar />
			    	<Grid container>
				  		<Grid className={classes.selectedList} item xs={2}>
				  			<SelectedListItemPharmaceutical itemSelectedList={this.state.itemSelectedList} onChange={this.handleChange}/>
				  			<SupportDialog/>
				  		</Grid>
					</Grid>
					<Grid container className={classes.patientsGrid}>
                    	<Grid className={classes.tables} item xs={12}>
                        	{loading && this.isEmpty(this.props.data.orders) ? <CircularProgress size={30} className={classes.progress}/> : <EnhancedTableOrders orders={this.props.data.orders} title="Lista Completa de Pedidos" getOrders={this.props.getOrders}/>}
                    	</Grid>
					</Grid>
			 	</div>
			);
		else if(localStorage.profession === 'admin')
			return(
			  	<div>
			    	<Navbar />
			    	<Grid container>
				  		<Grid className={classes.selectedList} item xs={2}>
				  			<SelectedListItem itemSelectedList={this.state.itemSelectedList} onChange={this.handleChange}/>
				  			<SupportDialog/>
				  		</Grid>
				  	</Grid>	
					<Grid container className={classes.patientsGrid}>
						<Grid className={classes.tables} item xs={2}/>
                    	<Grid className={classes.tables} item xs={10}>
                    		<div>
                    			{this.state.showMedication ? 
                    				<div>
	        							{loading && this.isEmpty(this.props.data.medication) ? <CircularProgress size={30} className={classes.progress}/> : <EnhancedTableMedication medication={this.props.data.medication} title="Lista Completa de Medicamentos" getMedication={this.props.getMedication}/>}
	            		            	<Button onClick={this.showButtonClicked} variant="contained" style={{ backgroundColor:'#00d1be', color:'white'}}>
	              							Mostrar Pedidos
	            						</Button> 
            						</div>
                    				:
                    				<div>
      			              			{loading && this.isEmpty(this.props.data.orders) ? <CircularProgress size={30} className={classes.progress}/> : <EnhancedTableOrders orders={this.props.data.orders} title="Lista Completa de Pedidos Entregues" getOrders={this.props.getDeliveredOrders}/>}
            		            		<Button onClick={this.showButtonClicked} variant="contained" style={{ backgroundColor:'#00d1be', color:'white'}}>
              								Mostrar Medicamentos
            							</Button>  
	            					</div>
                    			}
                        	</div>
                    	</Grid>
					</Grid>
			 	</div>
			);
	}
}

/*
                        	<div>
                        		{loading && this.isEmpty(this.props.data.medication) ? <CircularProgress size={30} className={classes.progress}/> : <EnhancedTableMedication medication={this.props.data.medication} title="Lista Completa de Medicamentos" getMedication={this.props.getMedication}/>}
                    		</div>
*/

home.propTypes = {
	classes: PropTypes.object.isRequired,
	getPatients: PropTypes.func.isRequired,
	getOrders: PropTypes.func.isRequired,
	getDeliveredOrders: PropTypes.func.isRequired,
	getMedication: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired,
	UI: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	data: state.data,
	UI: state.UI,
});

const mapActionsToProps = {
	getPatients,
	getOrders,
	getDeliveredOrders,
	getMedication
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(home))
