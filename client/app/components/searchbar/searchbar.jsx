import React from 'react';
import {Redirect} from "react-router-dom";
import {FontIcon, TextField, Toolbar, ToolbarGroup} from "material-ui";

export class Searchbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {query: ''};
        const location = window.location.href.split('/');
        if(location.length > 2 && location[location.length-2] === 'search') {
            this.state = {query: decodeURIComponent(location[location.length-1])};
        }
        this.redirect = false;

        this.searchChange = this.searchChange.bind(this);
        this.search = this.search.bind(this);
    }

    render() {
        const redirect = this.redirect;
        this.redirect = false;

        return <form onSubmit={this.search} style={{margin: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%'}}>
            <FontIcon className="material-icons">search</FontIcon>
            <TextField name="search" value={this.state.query} onChange={this.searchChange} hintText="Search" fullWidth={true}/>
            {redirect && <Redirect to={"/search/"+this.state.query}/>}
        </form>;
    }

    searchChange(event) {
        this.setState({query: event.target.value});
    }

    search(event) {
        event.preventDefault();

        this.redirect = true;
        this.setState({});
    }
}