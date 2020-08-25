import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import axios from 'axios'

//Components
import AddPatientBody from './AddPatientBody';
import AddComponentsBody from './AddComponentsBody';

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
      phone: "",
      gender: "Masculino",
      completed:33,
      page: 1,
      searchInput:"",
      errors: {},
      queryResultSet: [],
      tempSearchStore: [],
      listOfAddedComponents: [],
      patientUrl: "",
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
      phone: "",
      gender: "Masculino",
      errors: {},
      searchInput:"",
      queryResultSet: [],
      tempSearchStore: [],
      listOfAddedComponents: [],
      patientUrl: "",
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
      phone           : this.state.phone,
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
  

  sendMedicationInformation = () => {
    const medicationObj = {
      medication: this.state.listOfAddedComponents,
    }
    this.setState({
      loading: true,
    })

    axios.post(`/patients/addMedication/${this.state.patientUrl}`, medicationObj, {headers: {Authorization: localStorage.FBIdToken}})
      .then(res => {
        this.setState({
          loading: false,
          completed: this.state.completed + 25,
          page: 1,
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
        this.sendMedicationInformation();
        this.handleClose();
        break;
      default:
        this.handleClose();
    } 
  }

  handleAddComponent = (value) =>
  {
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
            title                 = {"Medicamento"}
            placeholder           = {"medicamento"}
            titleButton           = {"Próximo"}
          />   
        </div>
      )
    }
  }
}


export default AddPatient;