import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import EditIcon from '@material-ui/icons/Edit';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const styles  = {
  root: {
    maxHeight: '900px'
  },
  divider: {
    marginBottom: '10px',
  },
  title: {
    fontSize: 14,
    color: '#757575',
    paddingBottom: '1px',
    margin: '0px 180px 0px 0px'
  },
  textField: {
    marginBottom: '10px',
  },
  closeIcon:{
    display: 'inline-block',
    paddingBottom: '1px',
  },    
};

//export default function NotificationDialog(props) {
class NotificationDialog extends React.Component{
  
  constructor(){
    super()
    this.state = {
      open: false,
      loading: false,
      patients: [],
      message: '',
      errors: {}
    }
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDeletePatient = this.handleDeletePatient.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
  }

  handleDeletePatient = (selectedIndex) => {
    var array = [...this.state.patients]; // make a separate copy of the array
    array.splice(selectedIndex, 1);
     this.setState((prevState) => ({
      patients: array
    }))
    if(this.state.patients.length <= 1)
      this.handleClose();
  }
  
  handleChange = (event) => {
    this.setState({
      message: event.target.value
    })
  }

   handleClickOpen = () => {
    this.setState({
      open: true,
      patients: this.props.patientsSelected
    })
  };

   handleClose = () => {
     this.setState({
      open: false,
    })
  };

 sendMessage = () => {
    let ids = this.state.patients.map(patientSelected => (patientSelected.patientId))
    this.setState({
      loading: true,
    })
    const dataToSend = {
      ids: ids,
      message: this.state.message
    };
    axios.post('/patients/sendNotification', dataToSend, {headers: {Authorization: localStorage.FBIdToken}})
      .then(res => {
        this.setState({
          loading: false,
        })
        this.handleClose();
      })
      .catch(err =>{
        console.log(err.response.data);
        this.setState({
          errors: err.response.data,
        })
      })
  }

  render(){
    return (
      <div>
        <Button disabled={this.isEmpty(this.props.patientsSelected)} style={this.isEmpty(this.props.patientsSelected)? {backgroundColor: '#757575'}: {backgroundColor: '#00d1be'}} onClick={this.handleClickOpen}>
          <EditIcon style={{fill: "white"}}/>
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="notification-dialog-title"
          aria-describedby="notification-dialog-description"
          style={styles.root}
          maxWidth={'xs'}
        >
          <DialogTitle style={styles.title} id="notification-dialog-title">
            {this.state.patients.map((patientSelected, index) => (
                <div>
                {patientSelected.name}
                </div>
            ))}
          </DialogTitle>
          <DialogContent>
            <Divider style={styles.divider}/>
          </DialogContent>
        
          <DialogActions>
            <Button  disabled={this.state.loading} onClick={this.sendMessage.bind(this)} variant="contained" style={{ backgroundColor:'#00d1be', color:'white'}}>
              Enviar
              {this.state.loading && (
              <CircularProgress size={30} style={{position: 'absolute', color: '#0096cd'}}/>
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default NotificationDialog;