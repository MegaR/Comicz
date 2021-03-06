import React from "react";
import api from "../../../services/api";
import "./searchpage.scss";
import {VolumesList} from "../../lists/volumeslist";
import {IssuesList} from "../../lists/issueslist";
import {LoadingIndicator} from "../../loadingindicator/loadingindicator";
import {ArcList} from "../../lists/arclist";

export class SearchPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillReceiveProps(newProps) {
        if (this.props.match.params.query !== newProps.match.params.query) {
            this.search(newProps.match.params.query);
        }
    }

    componentDidMount() {
        this.search(this.props.match.params.query);
    }

    search(query) {
        this.setState({result: null});

        api.search(query)
            .then(result => {
                console.log(result);
                this.setState({results: result});
            })
            .catch(error => {
                //todo error handling
                console.warn(error);
            });
    }

    render() {
        return <div className="searchpage">
            {!this.state.results && <LoadingIndicator/>}
            {this.state.results && this.results()}
        </div>;
    }

    results() {
        return <div className="results">
            <div><VolumesList items={this.state.results.volumes}/></div>
            <div><IssuesList items={this.state.results.issues}/></div>
            <div><ArcList items={this.state.results.arcs}/></div>
        </div>
    }
}