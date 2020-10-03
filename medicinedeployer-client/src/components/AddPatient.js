import React from 'react';
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import axios from 'axios'

//Components
import AddPatientBody from './AddPatientBody';
import AddComponentsBody from './AddComponentsBody';
import AddMedicationBody from './AddMedicationBody';

//redux
import { connect } from 'react-redux';
import { getPatients } from '../redux/actions/dataActions';

class AddPatient extends React.Component{
  constructor(){
    super()
    this.state = {
      open: false,
      loading: false,
      loadingComponent: false,
      name: "",
      birthDate: "",
      cpf: "",
      email: "",
      city: "",
      state: 'AC',
      aisle: "",
      bed: "",
      gender: "Masculino",
      completed:33,
      page: 1,
      searchInput:"",
      errors: {},
      queryResultSet: [],
      tempSearchStore: [],
      listOfAddedComponents: [],
      patientUrl: "",
      selectedInitialDate: new Date(),
      selectedEndDate: new Date(),
      periodicity: "01:00",
      quantity: "",
      unity: ""
    }

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddComponent = this.handleAddComponent.bind(this);
    this.handleDeleteComponent = this.handleDeleteComponent.bind(this);
    this.sendPatientInformation = this.sendPatientInformation.bind(this);
    this.sendDiagnosisInformation = this.sendDiagnosisInformation.bind(this);
    this.sendMedicationInformation = this.sendMedicationInformation.bind(this);
    this.initiateSearch = this.initiateSearch.bind(this);
    this.handleInitialDateChange = this.handleInitialDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleAddMedication = this.handleAddMedication.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
  }

  initiateSearch = (value) => {

    if (value.length === 0) {
      this.setState({
        queryResultSet: [],
        tempSearchStore: [],
      });
      return;
    }

    var capitalizedValue =
        value.substring(0, 1).toUpperCase() + value.substring(1).toLowerCase();

    var arrayQueryResult = []
    var array = [];
    var route = "";
    
    switch(this.state.page){
      case 2:
        route = '/getDiagnosisSearch';
        break;
      case 3:
        route = '/getMedicationSearch';
        break;
      default:
        route = '/'
    }
    
    if (this.state.queryResultSet.length === 0 && value.length === 1) {
      const seachKey = {searchKey: value}
      this.setState({
        loadingComponent: true,
      })
      axios.post(route, seachKey)
        .then(res => {
          arrayQueryResult = res.data;
          this.setState({
            queryResultSet: arrayQueryResult,
            loadingComponent: false
          })
        })
        .catch(err =>{
          console.log(err)
          this.setState({
            loadingComponent: false,
          })
        });
    }else{
      this.setState({
        tempSearchStore: [],
      })
      this.state.queryResultSet.forEach(doc => {
        if(doc.name.startsWith(capitalizedValue)){
          array.push(doc);
        }
      })
      this.setState({
        tempSearchStore: array,
      })
    }
  }
  
  handleChange = (event) =>{
    this.setState({
      [event.target.name]: event.target.value
    })
    if(event.target.name === 'searchInput'){
      this.initiateSearch(event.target.value);
    }
  }

  handleInitialDateChange = (event, value) =>{
    this.setState({
      selectedInitialDate: value
    })
  }


  handleEndDateChange = (event, value) =>{
    this.setState({
      selectedEndDate: value
    })
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    })
  };

  handleClose = () => {
    this.setState({
      open: false,
      completed: 33,
      loadingComponent: false,
      loading: false,
      page: 1,
      name: "",
      birthDate: "",
      cpf: "",
      email: "",
      city: "",
      state: 'AC',
      aisle: "",
      bed: "",
      gender: "Masculino",
      errors: {},
      searchInput:"",
      queryResultSet: [],
      tempSearchStore: [],
      listOfAddedComponents: [],
      patientUrl: "",
      selectedInitialDate: new Date(),
      selectedEndDate: new Date(),
      periodicity: "01:00",
      quantity: "",
      unity: ""
    })
  };

  handleListItemClickFromAddPatient = (event, index) => {
    this.handleClickOpen();
    this.props.handleListItemClick(event, index);
  };

  sendPatientInformation = () => {
    this.setState({
      loading: true,
      queryResultSet: [],
      tempSearchStore: [],
      searchInput:"",
    })
    
    const patientData = {
      name            : this.state.name,
      date_of_birth   : this.state.birthDate,
      cpf             : this.state.cpf,
      email           : this.state.email,
      city            : this.state.city,
      state           : this.state.state,
      aisle           : this.state.aisle,
      bed             : this.state.bed,
      gender          : this.state.gender,
      associated_admin: 'admin',
      score           : 100,
    };

    axios.post('/patients', patientData, {headers: {Authorization: localStorage.FBIdToken}})
      .then(res => {
        this.setState({
          loading: false,
          completed: this.state.completed + 34,
          page: this.state.page + 1,
          patientUrl: res.data.message,
        })
      })
      .catch(err =>{
        console.log(err.response.data);
        this.setState({
          errors: err.response.data,
          loading: false,
        })
      })

  }

  sendDiagnosisInformation = () => {
    const diagnosisObj = {
      diagnosis: this.state.listOfAddedComponents,
    }
    this.setState({
      loading: true,
    })

    axios.post(`/patients/addDiagnosis/${this.state.patientUrl}`, diagnosisObj, {headers: {Authorization: localStorage.FBIdToken}})
      .then(res => {
        this.setState({
          loading: false,
          completed: this.state.completed + 25,
          page: this.state.page + 1,
          queryResultSet: [],
          tempSearchStore: [],
          listOfAddedComponents: [],
          searchInput:"",
        })
      })
      .catch(err =>{
        console.log(err.response.data);
        this.setState({
          errors: err.response.data,
          loading: false,
        })
      })
  }
  

  sendMedicationInformation = (array) => {
    const medicationObj = {
      medication: array,
    }
    this.setState({
      loading: true,
    })

    console.log(medicationObj)

    axios.post(`/patients/addMedication/${this.state.patientUrl}`, medicationObj, {headers: {Authorization: localStorage.FBIdToken}})
      .then(res => {
        this.setState({
          queryResultSet: [],
          tempSearchStore: [],
          listOfAddedComponents: [],
          searchInput:"",
          selectedInitialDate: new Date(),
          selectedEndDate: new Date(),
          periodicity: "01:00",
          quantity: "",
          unity: "",
          loading: false
        })
        this.props.getPatients()
      })
      .catch(err =>{
        console.log(err.response.data);
        this.setState({
          errors: err.response.data,
          loading: false,
        })
      })
  }

  handleSubmit = () =>
  {
    switch(this.state.page){
      case 1:
        this.sendPatientInformation();
        break;
      case 2:
        this.sendDiagnosisInformation();
        break;
      case 3:
        this.sendMedicationInformation(this.state.listOfAddedComponents);
        this.handleClose();
        break;
      default:
        this.handleClose();
    } 
  }

  handleAddComponent = (value) =>
  {
    if(this.state.page === 3 && this.state.listOfAddedComponents.length > 0)
      return

    if(this.state.listOfAddedComponents.indexOf(value) < 0){
      var array = [...this.state.listOfAddedComponents]; // make a separate copy of the array
      array.push(value)
      this.setState({ 
        listOfAddedComponents: array
      })
    }
  }

  handleDeleteComponent = (index) =>
  {
    var array = [...this.state.listOfAddedComponents]; // make a separate copy of the array
    array.splice(index, 1);
     this.setState({
      listOfAddedComponents: array
    })
  }

  handleAddMedication = () =>
  {
    var array = [...this.state.listOfAddedComponents]; // make a separate copy of the array
    var name = array[0].name
    var initial_date;
    var initial_date_utm = false
    var end_date_utm = false
    var end_date


    array.splice(0, 1);

    if(this.state.selectedInitialDate.toString().includes('GMT') === false)
    {
      initial_date = new Date(this.state.selectedInitialDate.toString().slice(0,4), 
                              this.state.selectedInitialDate.toString().slice(5,7),
                              this.state.selectedInitialDate.toString().slice(8,10),
                              this.state.selectedInitialDate.toString().slice(11,13),
                              this.state.selectedInitialDate.toString().slice(14,16))
      initial_date_utm = true
    }

    if(!this.state.selectedEndDate.toString().includes('GMT'))
    {
      end_date = new Date(this.state.selectedEndDate.toString().slice(0,4), 
                              this.state.selectedEndDate.toString().slice(5,7),
                              this.state.selectedEndDate.toString().slice(8,10),
                              this.state.selectedEndDate.toString().slice(11,13),
                              this.state.selectedEndDate.toString().slice(14,16))
      end_date_utm = true
    }

    var array_item = {
      name: name,
      selectedInitialDate: initial_date_utm ? initial_date : this.state.selectedInitialDate,
      selectedEndDate: end_date_utm ? end_date : this.state.selectedEndDate,
      periodicity: this.state.periodicity,
      quantity: this.state.quantity,
      unity: this.state.unity
    }
    array.push(array_item)
    this.setState({ 
      listOfAddedComponents: array,
    })
    this.sendMedicationInformation(array);
  }

  handleDeleteMedication = (index) =>
  {
    var array = [...this.state.listOfAddedComponents]; // make a separate copy of the array
    array.splice(index, 1);
     this.setState({
      listOfAddedComponents: array
    })
  }

  handleFinish = () =>
  {
    this.handleClose();
  }

  render(){

    if(this.state.page === 1)
    {
      return (
        <div>
          <ListItem
            button
            selected={this.props.selectedIndex === 0}
            onClick={(event) => this.handleListItemClickFromAddPatient(event, 0)}
          >
           <ListItemIcon>
             <PersonAddIcon style={{fill: 'white'}}/>
            </ListItemIcon>
            <ListItemText primary="Adicionar paciente" />
          </ListItem>

          <AddPatientBody 
            handleChange  = {this.handleChange}
            handleClose   = {this.handleClose} 
            handleSubmit  = {this.handleSubmit} 
            state         = {this.state.state} 
            errors        = {this.state.errors}
            open          = {this.state.open}
            loading       = {this.state.loading}
            completed     = {this.state.completed}
            titleButton   = {"Próximo"}
          />
        </div>
      );
    }

    else if(this.state.page === 2){
      return (
        <div>
          <ListItem
            button
            selected={this.props.selectedIndex === 0}
            onClick={(event) => this.handleListItemClickFromAddPatient(event, 0)}
          >
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary="Adicionar paciente" />
          </ListItem>

          <AddComponentsBody 
            handleChange          = {this.handleChange}
            handleClose           = {this.handleClose} 
            handleSubmit          = {this.handleSubmit}
            handleAddComponent    = {this.handleAddComponent} 
            handleDeleteComponent = {this.handleDeleteComponent}
            state                 = {this.state.state} 
            errors                = {this.state.errors}
            open                  = {this.state.open}
            loading               = {this.state.loading}
            loadingComponent      = {this.state.loadingComponent}
            completed             = {this.state.completed}
            name                  = {this.state.name}
            tempSearchStore       = {this.state.tempSearchStore}
            searchInput           = {this.state.searchInput}
            listOfAddedComponents = {this.state.listOfAddedComponents}
            title                 = {"Diagnóstico"}
            placeholder           = {"diagnóstico"}
            titleButton           = {"Próximo"}
          />
        </div>
      )
    }

    else if(this.state.page === 3){
      return (
        <div>
          <ListItem
            button
            selected={this.props.selectedIndex === 0}
            onClick={(event) => this.handleListItemClickFromAddPatient(event, 0)}
          >
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary="Adicionar paciente" />
          </ListItem>

          <AddMedicationBody 
            handleChange          = {this.handleChange}
            handleClose           = {this.handleClose} 
            handleSubmit          = {this.handleSubmit}
            handleAddComponent    = {this.handleAddComponent} 
            handleDeleteComponent = {this.handleDeleteComponent}
            handleInitialDateChange = {this.handleInitialDateChange}
            handleEndDateChange = {this.handleEndDateChange}
            handleAddMedication = {this.handleAddMedication}
            handleFinish          = {this.handleFinish}
            state                 = {this.state.state} 
            errors                = {this.state.errors}
            open                  = {this.state.open}
            loading               = {this.state.loading}
            loadingComponent      = {this.state.loadingComponent}
            completed             = {this.state.completed}
            name                  = {this.state.name}
            tempSearchStore       = {this.state.tempSearchStore}
            searchInput           = {this.state.searchInput}
            listOfAddedComponents = {this.state.listOfAddedComponents}
            selectedInitialDate   = {this.state.selectedInitialDate}
            selectedEndDate       = {this.state.selectedEndDate}
            periodicity           = {this.state.periodicity}
            quantity              = {this.state.quantity}
            unity                 = {this.state.unity}
            title                 = {"Medicamento"}
            placeholder           = {"medicamento"}
            titleButton           = {"Próximo"}
          />   
        </div>
      )
    }
  }
}


AddPatient.propTypes = {
  getPatients: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  data: state.data,
});

const mapActionsToProps = {
  getPatients
}

export default connect(mapStateToProps, mapActionsToProps)(AddPatient)