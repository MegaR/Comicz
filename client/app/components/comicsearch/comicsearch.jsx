import React from "react";
import api from "../../services/api";
import {Card, List, ListItem, Subheader} from "material-ui";
import {LoadingIndicator} from "../loadingindicator/loadingindicator";
import Link from "react-router-dom/es/Link";

export class ComicSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {results: null};
        this.search(this.props.issue);
    }

    search(issue) {
        api.searchComic(issue.volume.name)
            .then(results => {
                for (let source of results) {
                    source.bestResult = this.getBestResult(issue.volume, source.results);
                }
                this.setState({results: results});
            })
            .catch(error => {
                //todo errorhandling
                console.error(error);
            });
    }

    getBestResult(volume, results) {
        let filtered = results.filter(item => item.name.includes(volume.name) && item.name.includes(volume.startYear));
        if(filtered.length === 0) {
            filtered = results.filter(item => item.name.includes(volume.name));
        }

        return filtered.sort((a,b) => a.name.length - b.name.length)[0];
        // const search = volume.name;
        // const sorted = results.sort((a,b) => levenshtein(a.name, search) - levenshtein(b.name, search));
        // return sorted[0];
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
            let items = [<Subheader key={source.source}>{source.source}</Subheader>];
            if (source.bestResult) {
                items.push(this.getListItem(issue, source, source.bestResult));
            }
            items.push(<ListItem key={source.source + '/more'}
                                 secondaryText={'More...'}
                                 primaryTogglesNestedList={true}
                                 nestedItems={source.results.map(result => this.getListItem(issue, source, result))} />);

            return items;
        });
    }

    getListItem(issue, source, result) {
        return <ListItem key={source.source + '/' + result.id} primaryText={result.name} containerElement={
            <Link to={`/read/${issue.id}/${source.source}/${result.id}/${issue.issueNumber}`}/>
        }/>
    }
}