import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import AddIcon from '@material-ui/icons/Add';
import Divider from '@material-ui/core/Divider';
import DialogContentText from '@material-ui/core/DialogContentText';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: '900px',
  },
  divider: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  title: {
    fontSize: 14,
    color: '#757575',
    paddingBottom: '1px',
    margin: '0px 0px 0px 0px',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '18ch',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(0),
      width: 'auto',
      paddingRight: '5px',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },    
  inputRoot: {
    color: 'inherit',
    border: '1px solid #D5D5D5',
    margin: '10px 0px 10px 0px',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '32ch',
      '&:focus': {
        width: '37ch',
      },
    },
  },
  addComponentButton:{
    marginTop: '20px',
    marginRight: '10px',
  },
  addComponentDiv:{
    display: 'inline-block',
  },
  addedComponentDiv:{
    display: 'inline-block',
    marginRight: '20px',
  },
  closeIcon:{
    display: 'inline-block',
    paddingBottom: '1px',
  }, 
}));

export default function AddComponentsBody(props) {
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
        {`Adicionar ${props.title} - ${props.name}`}
        <LinearProgress variant="determinate" value={props.completed} className={classes.divider}/>
      </DialogTitle>

      <DialogContent>
      <div>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder={`Buscar ${props.placeholder}`}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
            variant="outlined"
            name= "searchInput"
            onChange={props.handleChange}
            value= {props.searchInput } 
            disabled= {props.loadingComponent}
          />
          </div>
        </div>
        {(props.tempSearchStore.length > 0) && props.tempSearchStore.map((doc, index) => (
          <div key={index} className={classes.addComponentDiv}>
            <Button color="primary" onClick={() => props.handleAddComponent(doc.name)} id={doc.name} className={classes.addComponentButton} endIcon={<AddIcon fontSize={'small'} color={"secondary"}/>}>
              {doc.name}
            </Button>
          </div>
        ))}
        <Divider className={classes.divider}/>
        <DialogContentText id="patients-symptoms-description">
          {props.title}s adicionados:
        </DialogContentText>
        {props.loadingComponent && (
            <CircularProgress size={30} style={{position: 'absolute', color: '#0096cd'}}/>
        )}
        {(props.listOfAddedComponents.length > 0) && props.listOfAddedComponents.map((doc, index) => (
          <div key={index} className={classes.addedComponentDiv}>
            {doc}
            <IconButton onClick={() => props.handleDeleteComponent(index)} size={'small'}>
              <CloseIcon className={classes.closeIcon} fontSize={'small'}/>
            </IconButton>
          </div>
        ))}
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