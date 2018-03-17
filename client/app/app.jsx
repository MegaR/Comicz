import React from 'react';
import {render} from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link
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

const muiTheme = getMuiTheme(darkBaseTheme);

class App extends React.Component {
    render() {
        return <MuiThemeProvider muiTheme={muiTheme}>
            <Router ref={router => {this.router = router;}}>
                <div>
                    <Toolbar>
                        <ToolbarTitle text='Comicz'/>
                        <ToolbarGroup style={{flexGrow: 1}}>
                            <Searchbar/>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <MenuItem primaryText="Dashboard"  onClick={()=>{this.router.history.push('/');}}/>
                        </ToolbarGroup>
                    </Toolbar>
                    <Switch>
                        <Route exact path="/" component={Dashboard}/>
                        <Route exact path="/search/:query" component={SearchPage}/>
                        <Route exact path="/volume/:id" component={VolumePage}/>
                        <Route exact path="/issue/:id" component={IssuePage}/>
                        <Route exact path="/character/:id" component={CharacterPage}/>
                        <Route exact path="/read/:issueId/:source/:volume/:issue" component={ReaderPage}/>
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