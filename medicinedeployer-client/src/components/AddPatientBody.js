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
import LinearProgress from '@material-ui/core/LinearProgress';

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

export default function AddPatientBody(props) {
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
          {"Adicionar Paciente"}
          <LinearProgress variant="determinate" value={props.completed} className={classes.divider}/>
        </DialogTitle>

        <DialogContent>
            <TextField id="name" name="name" type="text" label="Nome do Paciente" 
            onChange={props.handleChange}  className={classes.textField} 
             helperText = {props.errors.name} error = {props.errors.name ? true : false} variant="outlined" fullWidth/>

            <TextField
              id="date"
              label="Data de Nascimento"
              type="date"
              name="birthDate"
              className={classes.textField}
              variant="outlined"
              onChange={props.handleChange} 
              helperText = {props.errors.date_of_birth} 
              error = {props.errors.date_of_birth ? true : false}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br/>
            <TextField id="cpf" name="cpf" type="text" label="CPF" 
            className={classes.textField}  onChange={props.handleChange} 
            helperText = {props.errors.cpf} error = {props.errors.cpf ? true : false} variant="outlined" />

            <TextField id="email" name="email" type="email" label="Email" 
            className={classes.textField} onChange={props.handleChange} 
            helperText = {props.errors.email} error = {props.errors.email ? true : false} variant="outlined" fullWidth/>

            <div>
              <TextField id="city" name="city" type="text" label="Cidade" 
              className={classes.textField} onChange={props.handleChange} 
              helperText = {props.errors.city} error = {props.errors.city ? true : false} variant="outlined"/>

              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">Estado</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={props.state}
                  onChange={props.handleChange}
                  label="Estado"
                  name="state"
                >
                  <MenuItem value={'AC'}>AC</MenuItem>
                  <MenuItem value={'SP'}>SP</MenuItem>
                  <MenuItem value={'SC'}>SC</MenuItem>
                  <MenuItem value={'PR'}>PR</MenuItem>
                </Select>
              </FormControl>
            </div>

            <TextField id="aisle" name="aisle" type="text" label="Ala" 
            className={classes.textField} onChange={props.handleChange} 
            helperText = {props.errors.aisle} error = {props.errors.aisle ? true : false} variant="outlined"/>

            <FormControl component="fieldset" className={classes.genderForm} onChange={props.handleChange} >
              <FormLabel component="legend">Gênero</FormLabel>
              <RadioGroup row aria-label="gender" name="gender" defaultValue="male">
                <FormControlLabel value="male" control={<Radio color="primary" />} label="Masculino" />
                <FormControlLabel value="female" control={<Radio color="primary" />} label="Feminino" />
              </RadioGroup>
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