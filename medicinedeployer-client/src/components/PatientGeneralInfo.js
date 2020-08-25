import React from 'react';
import PropTypes from 'prop-types'

//MUI
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
        backgroundColor: '#0096cd',
    },
    pos: {
        marginBottom: 12,
    },
}));


class PatientGeneralInfo extends React.Component{
    render(){
        const { classes, patientInfo } = this.props;
        //let nombre = patientInfo.map(patientInfo => patientInfo.name);
        return(
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {patientInfo.name}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        {patientInfo.gender}
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {patientInfo.email}
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {patientInfo.score}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {patientInfo.phone}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Botao</Button>
                </CardActions>
            </Card>
        )
    }
}

PatientGeneralInfo.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(PatientGeneralInfo);


/*
  <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {nombre}
                    </Typography>
                    <Typography variant="h5" component="h2">
                        Ola
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                        adjective
                    </Typography>
                    <Typography variant="body2" component="p">
                        well meaning and kindly.
                        <br />
                        {'"a benevolent smile"'}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Learn More</Button>
                </CardActions>
            </Card>
*/