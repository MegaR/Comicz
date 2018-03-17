import React from "react";
import api from "../../services/api";
import {Card, List, ListItem, Subheader} from "material-ui";
import {LoadingIndicator} from "../loadingindicator/loadingindicator";
import Link from "react-router-dom/es/Link";

export class ComicSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {results: null};
        this.search();
    }

    search() {
        api.searchComic(this.props.issue)
            .then(results => {
                this.setState({results: results});
            })
            .catch(error => {
                //todo errorhandling
                console.error(error);
            });
    }

    render() {
        if (this.state.results === null) {
            return <Card><LoadingIndicator/></Card>;
        }

        if (this.state.results.length === 0) {
            return <div>
                <Card>
                    <p>No issues found :(</p>
                </Card>
            </div>
        }

        return <div>
            <Card>
                <List>{this.results()}</List>
            </Card>
        </div>
    }

    results() {
        const issue = this.props.issue;

        return this.state.results.map(source => {
            const header = <Subheader key={source.source}>{source.source}</Subheader>;
            const items = source.results.map(result =>
                <ListItem key={source.source + '/' + result.id} primaryText={result.name} containerElement={
                    <Link to={`/read/${issue.id}/${source.source}/${result.id}/${this.props.issue.issueNumber}`}/>
                }/>
            );
            return [header].concat(items);
        });
    }
}