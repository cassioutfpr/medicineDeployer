import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const styles  = {
  root: {
    maxHeight: '900px'
  },
  button:{
    width:'100%',
    position: 'absolute',
    right: '0',
    bottom: '0',
    left: '0',
    backgroundColor: '#00d1be',
    textAlign: 'center',
    color: 'white',
    textTransform: 'none',
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
};

//export default function NotificationDialog(props) {
class SupportDialog extends React.Component{
  constructor(){
    super()
    this.state = {
      open: false,
      loading: false,
      message: '',
      errors: {}
    }
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
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
    console.log('send message')
  }

  render(){
    return (
      <div>
        <Button variant="contained"  style={styles.button} onClick={this.handleClickOpen}>
          <HelpOutlineIcon style={{fill: 'white'}}/>Suporte
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="support-dialog-title"
          aria-describedby="support-dialog-description"
          style={styles.root}
        >
          <DialogTitle style={styles.title} id="support-dialog-title">{"Suporte"}</DialogTitle>
          <DialogContent>
            <Divider style={styles.divider}/>
            <DialogContentText id="support-dialog-description">
              Envie uma pergunta:
            </DialogContentText>
                    
            <TextField
              id="outlined-multiline-static"
              multiline
              rows={4}
              defaultValue=""
              variant="outlined"
              onChange={this.handleChange}
              label="Digite aqui"
              style={styles.textField}
              fullWidth
            />
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

export default SupportDialog;