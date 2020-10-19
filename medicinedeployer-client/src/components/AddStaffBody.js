import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: '900px',
  },
  divider: {
    marginTop: '10px',
  },
  title: {
    fontSize: 14,
    color: '#757575',
    paddingBottom: '1px',
    margin: '0px 0px 0px 0px',
  },
  textField:{
      margin: '10px auto 10px',
    },
    formControl: {
      minWidth: 120,
      display: 'inline-block',
      margin: '10px auto 10px 10px'
    },  
    genderForm:{
      margin: '10px auto 10px'
    },
    formControlEthnicity:{
      minWidth: 120,
      display: 'inline-block',
      margin: '10px auto 10px auto',
    },
    selectEthnicity:{
     minWidth: 180,
    }, 
    error:{
      color: 'red',
    },
}));

export default function AddStaffBody(props) {
  const classes = useStyles();

  return (
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="AddPatient-dialog-title"
        aria-describedby="AddPatient-dialog-description"
        className={classes.root}
        maxWidth={'xs'}
      >
        <DialogTitle className={classes.title} id="AddPatient-dialog-title">
          {"Adicionar Funcionário"}
        </DialogTitle>

        <DialogContent>
            <TextField id="login" name="login" type="text" label="Nome do Funcionário" 
            onChange={props.handleChange}  className={classes.textField} 
            helperText = {props.errors.login} error = {props.errors.login ? true : false} variant="outlined" fullWidth/>
            <br/>
            <TextField id="email" name="email" type="email" label="Email" 
            className={classes.textField} onChange={props.handleChange} 
            helperText = {props.errors.email} error = {props.errors.email ? true : false} variant="outlined" fullWidth/>
            
            <TextField id="password" name="password" type="password" label="Senha" 
            className={classes.textField}  onChange={props.handleChange} 
            helperText = {props.errors.password} error = {props.errors.password ? true : false} variant="outlined" />

            <br/>
            <TextField id="confirmPassword" name="confirmPassword" type="password" label="Confirmar senha" 
            className={classes.textField}  onChange={props.handleChange} 
            helperText = {props.errors.confirmPassword} error = {props.errors.confirmPassword ? true : false} variant="outlined"/>

            <br/>
            <TextField id="cpf" name="cpf" type="text" label="CPF" 
            className={classes.textField}  onChange={props.handleChange} 
            helperText = {props.errors.cpf} error = {props.errors.cpf ? true : false} variant="outlined" />

            <FormControl component="fieldset" className={classes.professionForm} onChange={props.handleChange} fullWidth>
                <FormLabel component="legend">Profissão</FormLabel>
                    <RadioGroup row aria-label="profession" name="profession" defaultValue="doctor">
                      <FormControlLabel value="doctor" control={<Radio color="primary" />} label="Médico" />
                      <FormControlLabel value="pharmaceutical" control={<Radio color="primary" />} label="Farmacêutico" />
                    </RadioGroup>
            </FormControl>

            {props.profession === 'doctor' && <TextField id="crm" name="crm" type="text" label="CRM" 
            className={classes.textField} value={props.crm} onChange={props.handleChange} 
            helperText = {props.errors.crm} error = {props.errors.crm ? true : false} variant="outlined"/>}

        </DialogContent>    
        
        <DialogActions>
          <Button  disabled={props.loading} onClick={props.handleSubmit} variant="contained" style={{ backgroundColor:'#00d1be', color:'white', marginTop: '20px'}}>
            {props.titleButton}
            {props.loading && (
              <CircularProgress size={30} style={{position: 'absolute', color: '#0096cd'}}/>
            )}
          </Button>
          
          {props.errors.general && (
            <Typography variant = "body2">
              {props.errors.general}
            </Typography>
          )}
        
        </DialogActions>
      </Dialog>
  );
}