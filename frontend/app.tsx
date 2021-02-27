import React from 'react';
import { Classes, FocusStyleManager } from '@blueprintjs/core';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import LoginPage from './pages/login.page';

FocusStyleManager.onlyShowFocusOnTabs();

export default function App() {
    return (
        <div className={Classes.DARK}>
            {/* <Router>
           <Switch></Switch>
        </Router> */}
            <LoginPage />
        </div>
    );
}
