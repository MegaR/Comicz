import React from 'react';
import {render} from 'react-dom';
import {
    BrowserRouter as Router, Redirect,
    Route
} from 'react-router-dom';
import './app.scss';
import {Searchbar} from "./components/searchbar/searchbar.jsx";
import {SearchPage} from "./components/pages/searchpage/searchpage.jsx";
import {VolumePage} from "./components/pages/detailpages/volumepage.jsx";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import {Card, MenuItem, Toolbar, ToolbarGroup, ToolbarTitle} from "material-ui";
import {IssuePage} from "./components/pages/detailpages/issuepage";
import {CharacterPage} from "./components/pages/detailpages/characterpage";
import {ReaderPage} from "./components/pages/readerpage/readerpage";
import {Dashboard} from "./components/pages/dashboard/dashboard";
import Switch from "react-router-dom/es/Switch";
import PrivateRoute from "./components/privateroute";
import auth from "./services/auth";
import LoginPage from "./components/pages/login/loginpage";
import SettingsPage from "./components/pages/settings/settingspage";

const muiTheme = getMuiTheme(darkBaseTheme);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {authenticated: auth.isAuthenticated()};
        auth.setCallback((state)=>{
            this.setState({authenticated: state});
        });
    }

    logout() {
        auth.logout();
        this.redirectTo = '/login';
        this.setState({authenticated: false});
    }

    render() {
        let to = null;
        if(this.redirectTo) {
            to = this.redirectTo;
            this.redirectTo = null;
        }


        return <MuiThemeProvider muiTheme={muiTheme}>
            <Router ref={router => {this.router = router;}}>
                <div>
                    {this.state.authenticated && <Toolbar>
                        <ToolbarTitle text='Comicz'/>
                        <ToolbarGroup style={{flexGrow: 1}}>
                            <Searchbar/>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <MenuItem primaryText="Dashboard"  onClick={()=>this.router.history.push('/')}/>
                            <MenuItem primaryText="Settings"  onClick={()=>this.router.history.push('/settings')}/>
                            <MenuItem primaryText="Logout"  onClick={()=>this.logout()}/>
                        </ToolbarGroup>
                    </Toolbar>}
                    {to && <Redirect to={to}/>}
                    <Switch>
                        <PrivateRoute exact path="/" component={Dashboard}/>
                        <PrivateRoute exact path="/search/:query" component={SearchPage}/>
                        <PrivateRoute exact path="/volume/:id" component={VolumePage}/>
                        <PrivateRoute exact path="/issue/:id" component={IssuePage}/>
                        <PrivateRoute exact path="/character/:id" component={CharacterPage}/>
                        <PrivateRoute exact path="/read/:issueId/:source/:volume/:issue" component={ReaderPage}/>
                        <Route exact path="/login" component={LoginPage}/>
                        <Route exact path="/settings" component={SettingsPage}/>
                        <Route component={ErrorPage}/>
                    </Switch>
                </div>
            </Router>
        </MuiThemeProvider>;
    }
}

class ErrorPage extends React.Component {
    render() {
        return <Card><p>Page not found</p></Card>;
    }
}

render(<App/>, document.getElementById('app'));