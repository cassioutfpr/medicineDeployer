import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types'
import AppIcon from '../images/icon.png'
import { Link } from 'react-router-dom'
//MUI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
//Redux
import { connect } from 'react-redux'
import { signupUser } from '../redux/actions/userActions'

const styles = {
	form:{
		textAlign:'center'
	},
	image:{
		margin: '0px auto 20px'
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
	},
    professionForm:{
      margin: '10px auto 10px'
    },
}

class signup extends React.Component{	
	constructor(){
		super();
		this.state = {
			email:"",
			password:"",
			confirmPassword: "",
			crm: "",
			login: "",
			cpf: "",
			profession: "doctor",
			hospital: "",
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
		this.setState({
			loading:true
		});
		const newUserData = {
			email: this.state.email,
			password: this.state.password,
			confirmPassword: this.state.confirmPassword,
			login: this.state.login,
			crm: this.state.crm,
			cpf: this.state.cpf,
			profession: "admin",
			hospital: this.state.hospital,
		}
		this.props.signupUser(newUserData, this.props.history)
	}

	handleChange = (event) =>{
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	render(){
		const { classes, loading } = this.props;
		const { errors } = this.state;
		return(
		  <Grid container className={classes.form}>
		  	<Grid item sm/>
		  	<Grid item sm>
		  		<img src={AppIcon} alt="visitorhealthicon" className={classes.image}/>
		  		<form noValidate onSubmit={this.handleSubmit}>
		  			<TextField id="login" name="login" type="text" label="Nome" 
		  			className={classes.textField} value={this.state.login} onChange={this.handleChange} 
		  			helperText = {errors.login} error = {errors.login ? true : false} variant="outlined" fullWidth/>

		  			<TextField id="email" name="email" type="email" label="Email" 
		  			className={classes.textField} value={this.state.email} onChange={this.handleChange} 
		  			helperText = {errors.email} error = {errors.email ? true : false} variant="outlined" fullWidth/>
		  			
		  			<TextField id="password" name="password" type="password" label="Senha" 
		  			className={classes.textField} value={this.state.password} onChange={this.handleChange} 
		  			helperText = {errors.password} error = {errors.password ? true : false} variant="outlined" fullWidth/>
		  			
		  			<TextField id="confirmPassword" name="confirmPassword" type="password" label="Confirmar senha" 
		  			className={classes.textField} value={this.state.confirmPassword} onChange={this.handleChange} 
		  			helperText = {errors.confirmPassword} error = {errors.confirmPassword ? true : false} variant="outlined" fullWidth/>

		  			<TextField id="cpf" name="cpf" type="text" label="CPF" 
		  			className={classes.textField} value={this.state.cpf} onChange={this.handleChange} 
		  			helperText = {errors.cpf} error = {errors.cpf ? true : false} variant="outlined" fullWidth/>

					<TextField id="hospital" name="hospital" type="text" label="Hospital" 
		  			className={classes.textField} value={this.state.hospital} onChange={this.handleChange} 
		  			helperText = {errors.hospital} error = {errors.hospital ? true : false} variant="outlined" fullWidth/>

		  			{errors.general && (
		  				<Typography variant = "body2" className={classes.customError}>
		  					{errors.general}
		  				</Typography>
		  			)}

		  			<Button type="submit" disabled={loading} variant="contained" className={classes.button}>
		  				Cadastrar
		  				{loading && (
		  					<CircularProgress size={30} className={classes.progress}/>
		  				)}
		  			</Button>
		  			<br />
		  			<br />
		  			<small className={classes.smallText}>Já tem um cadastro? <Link to='/login' className={classes.linkText}>Login.</Link></small>
		  		</form>
		  	</Grid>
		  	<Grid item sm/>
		  </Grid>
		)
	}
}

signup.propTypes = {
	classes: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	UI: PropTypes.object.isRequired,
	signupUser: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
	user: state.user,
	UI: state.UI
})



export default connect(mapStateToProps, { signupUser })(withStyles(styles)(signup))