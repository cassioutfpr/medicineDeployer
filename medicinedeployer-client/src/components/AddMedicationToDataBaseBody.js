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

export default function AddMedicationToDataBaseBody(props) {
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
          {"Adicionar Medicamento"}
        </DialogTitle>

        <DialogContent>
            <TextField id="name" name="name" type="text" label="Nome do Medicamento" 
            onChange={props.handleChange}  className={classes.textField} 
            helperText = {props.errors.name} error = {props.errors.name ? true : false} variant="outlined" fullWidth/>
            <br/>
            <TextField id="quantidade" name="quantity" type="text" label="Quantidade" 
              className={classes.textField} onChange={props.handleChange}
              helperText = {props.errors.quantity} error = {props.errors.quantity ? true : false} variant="outlined"/>

            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="unidade">Un.</InputLabel>
              <Select
                labelId="unidade"
                id="unidade"
                onChange={props.handleChange}
                label="Un."
                name="unity"
                value={props.unity}
              >
                <MenuItem value={'COMP'}>comp.</MenuItem>
                <MenuItem value={'GOTAS'}>gotas</MenuItem>
                <MenuItem value={'Ml'}>ml</MenuItem>
              </Select>
            </FormControl>

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