import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import NotificationSendMedication from './NotificationSendMedication';
import Button from '@material-ui/core/Button';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import axios from 'axios'


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Nome' },
  { id: 'orderId', numeric: true, disablePadding: false, label: 'ID Pedido' },
  { id: 'aisle', numeric: true, disablePadding: false, label: 'Ala' },
  { id: 'bed', numeric: true, disablePadding: false, label: 'Cama' },
];

const ordersSelected = [];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
};
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    borderLeft: '1px solid gray',
    borderRight: '1px solid gray',
    borderBottom: '1px solid gray',
    borderRightRadius: '5px',
    borderLeftRadius: '5px',
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
    textAlign:'left'
  },
  footer: {
    backgroundColor: "grey",
    height: 30
  },
  deleteButton:{
    marginLeft: '10px',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;
  
  const isEmpty = (obj) => {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
  }

  const handleClickOpen = () => {
    /*let ids = ordersSelected[0].patientId
    axios.delete(`/patients/${ids}`, {headers: {Authorization: localStorage.FBIdToken}})
      .then(res => {
        props.removeDeletedPatient(ordersSelected[0].patientId)
        props.getPatients()
      })
      .catch((err) => {
        console.log('Could not delete patient.')
      });*/
  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
      variant='dense'
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selecionado(s)
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          {props.title}
        </Typography>
      )}
      <NotificationSendMedication ordersSelected={ordersSelected} getOrders = {props.getOrders} clearSelectedOrders = {props.clearSelectedOrders}/>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '20px',
    width: '100%',
    borderTop: '1px solid gray',
    borderLeft: '1px solid gray',
    borderRight: '1px solid gray',
    borderRadius: '5px'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    height: 300,
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  tableRow:{
    borderLeft: '5px solid red'
  },
  customizeToolbar:{
    minHeight: 30,
  },
}));


export default function EnhancedTableDeliveredOrders(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  let ordersInfo = props.orders;
  
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = ordersInfo.map((n) => n.name);
      setSelected(newSelecteds);
      
      while(ordersSelected.length > 0) {ordersSelected.pop();} 
      ordersInfo.forEach(eachOrder => {
        ordersSelected.push(eachOrder);
      });
      return;
    }
    while(ordersSelected.length > 0) {ordersSelected.pop();}
    setSelected([]);
  };

  const handleClick = (event, row, isItemSelected) => {
    const selectedIndex = selected.indexOf(row.orderId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row.orderId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    if(!isItemSelected){
      if(selected.length > 0)
        return;
      ordersSelected.push(row)  
    }
    else{
      ordersSelected.splice(0, 1);
    }

    setSelected(newSelected);
  };

  const clearSelectedOrders = (patientName) => {
    ordersSelected.splice(0, 1)
    setSelected([]);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const isEmpty = (obj)  => {
      for(var prop in obj) {
          if(obj.hasOwnProperty(prop))
              return false;
      }
      return true;
  };

  if(isEmpty(ordersInfo))
  {
    return(<div></div>) 
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, ordersInfo.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} title={props.title} getOrders={props.getOrders} clearSelectedOrders={clearSelectedOrders}/>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'small'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={ordersInfo.length}
              ordersInfo={ordersInfo}
            />
            <TableBody>
              {stableSort(ordersInfo, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.orderId);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row, isItemSelected)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.orderId}
                      selected={isItemSelected}
                      className={classes.tableRow}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.orderId}</TableCell>
                      <TableCell align="right">{row.aisle}</TableCell>
                      <TableCell align="right">{row.bed}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (33) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
          </TableContainer>
            <TablePagination
            rowsPerPageOptions={[5,10]}
            component="div"
            count={ordersInfo.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            labelRowsPerPage = {'Linhas por página: '}
            variant='dense'
          />
      </Paper>
    </div>
  );
}