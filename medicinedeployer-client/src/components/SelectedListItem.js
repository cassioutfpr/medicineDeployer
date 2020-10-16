import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListIcon from '@material-ui/icons/List';
import AddPatient from './AddPatient'
import AddStaff from './AddStaff'
import AddMedicationToDataBase from './AddMedicationToDataBase'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 270,
    color: 'white',
  },
  divider: {
    backgroundColor: 'white',
  },
}));

export default function SelectedListItem(props) {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    if(index === 1)
      props.onChange('list_of_patients');
    else if(index === 0)
      props.onChange('add_patient');
  };

  if(localStorage.profession === 'doctor')
  {
    return (
      <div className={classes.root}>
        <List component="nav">        
          <AddPatient handleListItemClick={handleListItemClick} selectedIndex={selectedIndex}/>
        </List>
      </div>
    );
  }

  if(localStorage.profession === 'admin')
  {
    return (
      <div className={classes.root}>
        <List component="nav">        
          <AddStaff handleListItemClick={handleListItemClick} selectedIndex={selectedIndex}/>
          <AddMedicationToDataBase handleListItemClick={handleListItemClick} selectedIndex={selectedIndex}/>
        </List>
      </div>
    );
  }
}