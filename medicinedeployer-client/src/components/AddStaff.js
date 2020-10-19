import React from 'react';
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import axios from 'axios'

//Components
import AddStaffBody from './AddStaffBody';

//redux
import { connect } from 'react-redux';
import { getPatients } from '../redux/actions/dataActions';

class AddStaff extends React.Component{
  constructor(){
    super()
    this.state = {
      open: false,
      loading: false,
      loadingComponent: false,
      email:"",
      password:"",
      confirmPassword: "",
      crm: "",
      login: "",
      cpf: "",
      profession: "doctor",
      hospital: "",
      errors: {}
    }

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendStaffInformation = this.sendStaffInformation.bind(this);
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
      email:"",
      password:"",
      confirmPassword: "",
      crm: "",
      login: "",
      cpf: "",
      profession: "doctor",
      hospital: "",
      errors: {}
    })
  };

  sendStaffInformation = () => {
    this.setState({
      loading: true,
    })
    
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      crm: this.state.crm,
      login: this.state.login,
      cpf: this.state.cpf,
      profession: this.state.profession,
      hospital: localStorage.hospital,
      associated_admin: localStorage.credentials,
    };

    axios.post('/signupDoctor', newUserData)
    .then(res => {
      console.log('Staff Added')
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


    /*axios.post('/patients', patientData, {headers: {Authorization: localStorage.FBIdToken}})
      .then(res => {
        this.setState({
          loading: false,
          completed: this.state.completed + 34,
          page: this.state.page + 1,
          patientUrl: res.data.message,
        })
      })
      .catch(err =>{
        console.log(err.response.data);
        this.setState({
          errors: err.response.data,
          loading: false,
        })
      })*/

  handleSubmit = () =>
  {
    this.sendStaffInformation();
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
           <PersonAddIcon style={{fill: 'white'}}/>
          </ListItemIcon>
          <ListItemText primary="Adicionar funcionário" />
        </ListItem>

        <AddStaffBody 
          handleChange  = {this.handleChange}
          handleClose   = {this.handleClose} 
          handleSubmit  = {this.handleSubmit} 
          state         = {this.state.state} 
          errors        = {this.state.errors}
          open          = {this.state.open}
          loading       = {this.state.loading}
          completed     = {this.state.completed}
          profession    = {this.state.profession}
          titleButton   = {"Adicionar"}
        />
      </div>
    );
  }
}


AddStaff.propTypes = {
  getPatients: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  data: state.data,
});

const mapActionsToProps = {
  getPatients
}

export default connect(mapStateToProps, mapActionsToProps)(AddStaff)