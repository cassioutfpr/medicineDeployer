import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch} from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import jwtDecode from 'jwt-decode'
import AuthRoute from './util/AuthRoute'
import AuthRouteHome from './util/AuthRouteHome'
//Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser } from './redux/actions/userActions';
//Pages
import home from './pages/home'
import login from './pages/login'
import signup from './pages/signup'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#33abd7',
      main: '#0096cd',
      dark: '#00698f',
      contrastText: '#fff'
    },
    secondary: {
      light: '#33dacb',
      main: '#00d1be',
      dark: '#b22a00',
      contrastText: '#fff'
    }
  },
  typography:{
    useNextVariants: true
  }
})

const token = localStorage.FBIdToken; 
if(token){
    const decodedToken = jwtDecode(token);
    if(decodedToken.exp * 1000 < Date.now()){
        store.dispatch(logoutUser);
        //window.location.href = '/login'
    }else{
        store.dispatch({ type: SET_AUTHENTICATED });
        //axios.defaults.headers.common['Authorization'] = token;
        //store.dispatch(getUserData());
    }
}

class App extends React.Component{
  render(){
    return(
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <div className="App">
            <Router>
              <div>
                <Switch>
                  <AuthRouteHome exact path="/" component={home}/>
                  <AuthRoute exact path="/login" component={login}/>
                  <AuthRoute exact path="/signup" component={signup}/>
                </Switch>
              </div>
            </Router>
          </div>
        </Provider>
      </MuiThemeProvider>
    )
  }
}

export default App;