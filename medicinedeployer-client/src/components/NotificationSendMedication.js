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
class NotificationSendMedication extends React.Component{
  
  constructor(){
    super()
    this.state = {
      open: false,
      loading: false,
      orders: [],
      message: '',
      errors: {}
    }
    this.handleClickOpen = this.handleClickOpen.bind(this);
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
  };

  sendOrder = () => {
    let id = this.props.ordersSelected.map(orderSelected => (orderSelected.orderId))
    var date_now = new Date()
    date_now = date_now.toISOString()
    this.setState({
      loading: true,
    })
    const dataToSend = {
      id: id,
      dateSentFromPharmaceutical: date_now
    };

    axios.post(`/doctors/orderSentFromPharmaceutical/${id}`, dataToSend, {headers: {Authorization: localStorage.FBIdToken}})
      .then(res => {
        this.setState({
          loading: false,
        })
        this.props.getOrders();
        this.props.clearSelectedOrders()
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
        <Button disabled={this.isEmpty(this.props.ordersSelected)} style={this.isEmpty(this.props.ordersSelected)? {backgroundColor: '#757575'}: {backgroundColor: '#00d1be'}} onClick={this.handleClickOpen}>
          <SendIcon style={{fill: "white"}}/>
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
            {this.props.ordersSelected.map((orderSelected, index) => (
                <div key={orderSelected.name}>
                  Adicionar medicamento para {orderSelected.name}
                </div>
            ))}
          </DialogTitle>

          <DialogContent>
            <Divider style={styles.divider}/>

            {this.props.ordersSelected.map((orderSelected, index) => (
              <div style={styles.orderInfo} key={orderSelected.orderId}>
                <b>Nome:</b> {orderSelected.name}<br/>
                <b>Diagnóstico:</b> {orderSelected.diagnosis.map((diag, index) => (
                  <div key={diag.id} style={styles.diagnosis}>
                    <p>{diag.name} </p>
                  </div>
                ))}
                <br/>
                <b>Médico:</b> {orderSelected.associated_doctor}
                <br/>
                <br/>
                <b>Medicamentos:</b>
                {orderSelected.medication.map((medication, index) => (
                  <div key={medication.id}>
                    <p>{medication.name} - {medication.quantity} {medication.unity}</p> <br/>
                  </div>
                 ))}
                <br/>
                <b>Comentários:</b>
                {orderSelected.notifications.map((notification, index) => (
                  <div key={notification.message}>
                    {notification.message} <br/>
                  </div>
                 ))}  
              </div>
            ))}

          </DialogContent>

          <DialogActions>
            <Button  disabled={this.state.loading} onClick={this.sendOrder.bind(this)} variant="contained" style={{ backgroundColor:'#00d1be', color:'white'}}>
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

export default NotificationSendMedication;