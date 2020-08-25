import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import AppIcon from '../images/icon.png'
//MUI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress';
//Redux stuff
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';


const styles = {
	form:{
		textAlign:'center'
	},
	image:{
		margin: '100px auto 20px'
	},
	pageTitle:{
		margin: '20px auto 20px'
	},
	textField:{
		margin: '10px auto 10px'
	},
	button:{
		marginTop: '20px',
		backgroundColor: '#00d1be',
		color: 'white',
		fontSize: 14,
		padding: '6px 24px',
		position: 'relative'
	},
	customError:{
		color:'red',
		fontSize: '0.8rem',
		marginTop: '10px'
	},
	progress:{
		position: 'absolute',
		color: '#0096cd'
	},
	linkText:{
		textDecoration: 'none',
		color: '#0096cd'
	}
}

class login extends React.Component{	
	constructor(){
		super();
		this.state = {
			email:"",
			password:"",
			errors: {}
		}
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.UI.errors){
			this.setState({
				errors: nextProps.UI.errors
			});
		}
	}

	handleSubmit = (event) => {
		event.preventDefault();
		const userData = {
			email: this.state.email,
			password: this.state.password
		}
		this.props.loginUser(userData, this.props.history);
	}

	handleChange = (event) =>{
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	render(){
		const { classes, UI: { loading } } = this.props;
		const { errors } = this.state;
		return(
		  <Grid container className={classes.form}>
		  	<Grid item sm/>
		  	<Grid item sm>
		  		<img src={AppIcon} alt="visitorhealthicon" className={classes.image}/>
		  		<form noValidate onSubmit={this.handleSubmit}>
		  			<TextField id="email" name="email" type="email" label="Email" 
		  			className={classes.textField} value={this.state.email} onChange={this.handleChange} 
		  			helperText = {errors.email} error = {errors.email ? true : false} variant="outlined" fullWidth/>
		  			
		  			<TextField id="password" name="password" type="password" label="Senha" 
		  			className={classes.textField} value={this.state.password} onChange={this.handleChange} 
		  			helperText = {errors.password} error = {errors.password ? true : false} variant="outlined" fullWidth/>
		  			
		  			{errors.general && (
		  				<Typography variant = "body2" className={classes.customError}>
		  					{errors.general}
		  				</Typography>
		  			)}

		  			<Button type="submit" disabled={loading} variant="contained" className={classes.button}>
		  				Iniciar
		  				{loading && (
		  					<CircularProgress size={30} className={classes.progress}/>
		  				)}
		  			</Button>
		  			<br />
		  			<br />
		  			<small className={classes.smallText}>Não tem cadastro? <Link to='/signup' className={classes.linkText}>Clique aqui.</Link></small>
		  		</form>
		  	</Grid>
		  	<Grid item sm/>
		  </Grid>
		)
	}
}

login.propTypes = {
	classes: PropTypes.object.isRequired,
	loginUser: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	UI: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
	user: state.user,
	UI: state.UI,
});

const mapActionsToProps = {
	loginUser
}


export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(login))