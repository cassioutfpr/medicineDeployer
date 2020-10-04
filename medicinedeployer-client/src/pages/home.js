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
import SupportDialog from '../components/SupportDialog'

//MUI
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

//Redux stuff
import { connect } from 'react-redux';
import { getPatients, getOrders } from '../redux/actions/dataActions';

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
  		}
  	}

	isEmpty(obj) {
    	for(var prop in obj) {
        	if(obj.hasOwnProperty(prop))
            	return false;
    	}
    	return true;
  	}

  	componentDidMount(){
  		this.props.getPatients();
  		this.props.getOrders();
	}

  	handleChange = value => this.setState({itemSelectedList: value})

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
		else if(this.state.itemSelectedList === 'add_patient')
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
		else
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
                        	{loading && this.isEmpty(this.props.data.orders) ? <CircularProgress size={30} className={classes.progress}/> : <EnhancedTableOrders orders={this.props.data.orders} title="Lista Completa de Pedidos" getPatients={this.props.getPatients}/>}
                    	</Grid>
					</Grid>
			 	</div>
			);
	}
}

home.propTypes = {
	classes: PropTypes.object.isRequired,
	getPatients: PropTypes.func.isRequired,
	getOrders: PropTypes.func.isRequired,
	data: PropTypes.object.isRequired,
	UI: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	data: state.data,
	UI: state.UI,
});

const mapActionsToProps = {
	getPatients,
	getOrders
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(home))
