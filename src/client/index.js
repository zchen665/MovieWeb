import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './app.css';
import { HashRouter } from 'react-router-dom';

ReactDOM.render((
    <HashRouter>
        <App />
    </HashRouter>
), document.getElementById('root'));

{/* <PrivateRoute path='/user' component={UserPage} isAuthed={true} loading={true} /> */ }
