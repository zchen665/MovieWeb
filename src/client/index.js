import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './components/Login';
import './app.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {exact, Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import Header from './components/Header';
import {PrivateRoute} from './components/PrivateRoute.js';
import { UserPage } from './components/UserPage.js';


ReactDOM.render((
    <BrowserRouter>
        <Header/>
        <Switch>
            <Route exact path='/login' component={Login} />
            <Route exact path='/' component={App} />
            <PrivateRoute path='/user' component={UserPage} isAuthenticated ={true} loading={false}/>
        </Switch>
    </BrowserRouter>
), document.getElementById('root'));
