import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux'

const AuthRouteHome = ({ component: Component, authenticated, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            authenticated === true ?  <Component {...props} /> : <Redirect to='/login' />
        }
    />
);

const mapStateToProps = (state) => ({
	authenticated: state.user.authenticated,
})

export default connect(mapStateToProps)(AuthRouteHome)