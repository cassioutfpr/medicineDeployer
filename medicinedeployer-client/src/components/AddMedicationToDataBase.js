import React from 'react';
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import axios from 'axios'

//Components
import AddMedicationToDataBaseBody from './AddMedicationToDataBaseBody';

//redux
import { connect } from 'react-redux';
import { getPatients } from '../redux/actions/dataActions';

class AddMedicationToDataBase extends React.Component{
  constructor(){
    super()
    this.state = {
      open: false,
      loading: false,
      name: false,
      quantity:"",
      unity:"COMP",
      errors: {}
    }

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendMedicationInformation = this.sendMedicationInformation.bind(this);
  }

  handleListItemClickFromAddPatient = (event, index) => {
    this.handleClickOpen();
    this.props.handleListItemClick(event, index);
  };


  handleChange = (event) =>{
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    })
  };

  handleClose = () => {
    this.setState({
      open: false,
      loading: false,
      name: false,
      quantity:"",
      unity:"COMP",
      errors: {}
    })
  };

  sendMedicationInformation = () => {
    this.setState({
      loading: true,
    })
    
    const newMedicationData = {
      name: this.state.name,
      quantity: this.state.quantity,
      unity: this.state.unity,
      hospital: localStorage.hospital,
      associated_admin: localStorage.credentials,
    };

    console.log(newMedicationData)

    axios.post('/addOneMedication', newMedicationData)
    .then(res => {
      console.log('Medication Added')
      this.setState({
        loading: false
      });
      this.handleClose(); 
    })
    .catch((err) => {
        this.setState({
          errors: err.response.data,
          loading: false
        });
    });
}

  handleSubmit = () =>
  {
    this.sendMedicationInformation();
  }

  render(){
    return (
      <div>
        <ListItem
          button
          selected={this.props.selectedIndex === 0}
          onClick={(event) => this.handleListItemClickFromAddPatient(event, 0)}
        >
         <ListItemIcon>
           <AddCircleOutlineIcon style={{fill: 'white'}}/>
          </ListItemIcon>
          <ListItemText primary="Adicionar medicamento" />
        </ListItem>

        <AddMedicationToDataBaseBody 
          handleChange  = {this.handleChange}
          handleClose   = {this.handleClose} 
          handleSubmit  = {this.handleSubmit} 
          state         = {this.state.state} 
          errors        = {this.state.errors}
          open          = {this.state.open}
          loading       = {this.state.loading}
          completed     = {this.state.completed}
          unity         = {this.state.unity}
          titleButton   = {"Adicionar"}
        />
      </div>
    );
  }
}


AddMedicationToDataBase.propTypes = {
  getPatients: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  data: state.data,
});

const mapActionsToProps = {
  getPatients
}

export default connect(mapStateToProps, mapActionsToProps)(AddMedicationToDataBase)