import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SendIcon from '@material-ui/icons/Send';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

const styles  = {
  root: {
    maxHeight: '900px',

  },
  divider: {
    marginBottom: '10px',
  },
  title: {
    fontSize: 14,
    color: '#757575',
    paddingBottom: '1px',
    margin: '0px 180px 0px 0px',
  },
  textField: {
    marginBottom: '10px',
  },
  closeIcon:{
    display: 'inline-block',
    paddingBottom: '1px',
  },
  diagnosis: {
    display: 'inline-block',
  }    
};

//export default function NotificationDialog(props) {
class NotificationUpdateMedication extends React.Component{
  
  constructor(){
    super()
    this.state = {
      open: false,
      loading: false,
      orders: [],
      message: '',
      quantity: "",
      errors: {}
    }
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.sendOrder = this.sendOrder.bind(this);
  }

  isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
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
    this.props.clearSelectedMedication();
  };

  handleChange = (event) =>{
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  sendOrder = () => {
    let id = this.props.medicationSelected.map(medication => (medication.medicationId))
    this.setState({
      loading: true,
    })
    const dataToSend = {
      quantity: this.state.quantity
    };

    console.log(dataToSend);

    axios.post(`/admin/updateMedicationQuantity/${id}`, dataToSend, {headers: {Authorization: localStorage.FBIdToken}})
      .then(res => {
        this.setState({
          loading: false,
        })
        this.props.getMedication();
        this.handleClose();
      })
      .catch(err =>{
        this.setState({
          errors: err.response.data,
        })
      })
  }

  render(){
    return (
      <div>
        <Button disabled={this.isEmpty(this.props.medicationSelected)} style={this.isEmpty(this.props.medicationSelected)? {backgroundColor: '#757575'}: {backgroundColor: '#00d1be'}} onClick={this.handleClickOpen}>
          <EditIcon style={{fill: "white"}}/>
        </Button> 
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="notification-dialog-title"
          aria-describedby="notification-dialog-description"
          style={styles.root}
          maxWidth={'lg'}
        >
          <DialogTitle style={styles.title} id="notification-dialog-title">
            {this.props.medicationSelected.map((medication, index) => (
                <div key={medication.name}>
                  Atualizar quantidade para {medication.name}
                </div>
            ))}
          </DialogTitle>

          <DialogContent>
            <Divider style={styles.divider}/>

            <TextField id="quantidade" name="quantity" type="text" label="Quantidade"  onChange={this.handleChange}
            helperText = {this.state.errors.quantity} error = {this.state.errors.quantity ? true : false} variant="outlined"/>

          </DialogContent>

          <DialogActions>
          <Button  disabled={this.state.loading} onClick={this.sendOrder.bind(this)} variant="contained" style={{ backgroundColor:'#00d1be', color:'white'}}>
            Atualizar
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

export default NotificationUpdateMedication;