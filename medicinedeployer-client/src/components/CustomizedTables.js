import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        maxWidth: 1200,
        marginTop: '10px'
    },
});

export default function CustomizedTables(props) {
    const classes = useStyles();
    let title = props.title;
    let bck_color = props.bck_color;
    let patientsInfo = props.patients;//.map(patientInfo => patientInfo.name); dia-a-dia -> recursos

    const StyledTableCell = withStyles((theme) => ({
        head: {
            backgroundColor: bck_color,
            color: theme.palette.common.white,
        },
        body: {
          fontSize: 14,
        },
    }))(TableCell);
  
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>{title}</StyledTableCell>
                        <StyledTableCell align="right"></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {patientsInfo.map((patientsInfo) => (
                        <StyledTableRow key={patientsInfo.name}>
                            <StyledTableCell component="th" scope="row">
                                {patientsInfo.name}
                            </StyledTableCell>
                            <StyledTableCell align="right">{patientsInfo.score}%</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}