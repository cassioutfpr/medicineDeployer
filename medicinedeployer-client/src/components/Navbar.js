import React, {Component} from 'react';
import PropTypes from 'prop-types'

//MUI
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import AppIcon from '../images/iconPill.png'

//Redux
import { connect } from 'react-redux'
import { logoutUser } from '../redux/actions/userActions'

const styles = {
  grow: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: '#00d1be',
  },
  selectedList:{
    display: 'inline-block',
  },
  doctorName: {
    marginLeft: '10px',
    paddingTop: '5px',
    display: 'inline-block',
    color: 'black',
  },
  inputRoot: {
    color: 'inherit',
    border: '1px solid #a6a8ad', 
    margin: '10px 0px 10px 0px',
  },
  inputInput: {
    width: '100%',
    color: '#5c5c5e',
    paddingLeft: '10px',
  },
  powerIconButton:{
    float: 'right',
    marginTop: '3px',
  },
  powerIcon:{
    float: 'right',
    fill: "black"
  },
  searchIconButton:{
    marginTop: '-15px',
    marginLeft: '8px',
    float: 'left',
    backgroundColor: '#00d1be',
    position: 'absolute',
  },
  searchIcon:{
    float: 'right',
    fill: "white",
  },
  image:{
    float: 'left',
    marginTop: '4px',
    marginLeft: '60px',
    width:'20%', 
    height:'20%',
  },
}

class Navbar extends Component {
  
  handleProfileMenuOpen = () => {

  }

  handleSignOut = () => {
    this.props.logoutUser()
  }

  handleInputChange = (event) => {
    console.log(event.target.value)
  }

  handleSearchPatient = () => {
    console.log('search')
    this.props.getPatients();
  }
  
  render(){
    const { classes } = this.props;
    var profession;

    if(localStorage.profession === 'doctor')
      profession = 'Dr.'
    if(localStorage.profession === 'pharmaceutical')
      profession = 'Farmaceutico'
    if(localStorage.profession === 'admin')
      profession = 'Administrador'

    return(
      <div className={classes.grow}>
        <AppBar className={classes.appBar} position="static">
          <Toolbar>
          <Grid container alignItems="center">
            <Grid className={classes.selectedList} item xs={2}>
              <Typography className={classes.doctorName} noWrap>
                {profession}
                <br/>
                {localStorage.credentials} 
              </Typography>
            </Grid>
            <Grid className={classes.selectedList} item xs={1}>
              <Typography className={classes.doctorName} noWrap>
                Hospital
                <br/>
                {localStorage.hospital} 
              </Typography>
            </Grid>
            
            <Grid className={classes.selectedList} item xs={2}/>
            <Grid className={classes.selectedList} item xs={3}>
           		<img src={AppIcon} alt="visitorhealthicon" className={classes.image}/>
            </Grid>
            <Grid className={classes.selectedList} item xs={1}>
          
            </Grid>
            <Grid className={classes.selectedList} item xs={2}>
              
            </Grid>
            <Grid className={classes.selectedList} item xs={1}>
              <IconButton
                edge="end"
                color="inherit"
                onClick={this.handleSignOut.bind(this)}
                className={classes.powerIconButton}  
              >
                <PowerSettingsNewIcon className={classes.powerIcon}/>
              </IconButton>
            </Grid>
          </Grid>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = { logoutUser };

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Navbar))