import React from "react";
import api from "../../services/api";
import {Card, List, ListItem, Subheader, IconButton, Menu, MenuItem} from "material-ui";
import {LoadingIndicator, LoadingIndicatorSmall} from "../loadingindicator/loadingindicator";
import Link from "react-router-dom/es/Link";
import './comicsearch.scss';

export class ComicSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {results: null};
        this.search(this.props.issue).catch((error) => {
            //todo error handling
            console.error(error);
        });
    }

    async search(issue) {
        const sources = await api.comicSources();
        let results = sources.map(item => ({source: item}));
        this.setState({results: results});

        sources.forEach(x => {
            const source = x;
            api.searchComic(source, issue.volume.name)
                .then(issues => {
                    for (let i = 0; i < results.length; i++) {
                        if (results[i].source == source) {
                            results[i].results = issues;
                            results[i].bestResult = this.getBestResult(issue.volume, issues);
                            this.setState({results: results});
                        }
                    }
                })
                .catch(error => {
                    console.error(error);

                    for (let i = 0; i < results.length; i++) {
                        if (results[i].source == source) {
                            results[i].results = issues;
                            this.setState({results: results});
                        }
                    }
                });
        })
    }

    getBestResult(volume, results) {
        let filtered = results.filter(item => item.name.includes(volume.name) && item.name.includes(volume.startYear));
        if (filtered.length === 0) {
            filtered = results.filter(item => item.name.includes(volume.name));
        }

        return filtered.sort((a, b) => a.name.length - b.name.length)[0];
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

        return <div className="comicsearch">
            <Card>
                <List>{this.results()}</List>
            </Card>
        </div>
    }

    results() {
        const issue = this.props.issue;

        return this.state.results.map(source => {
            let items = [<Subheader key={source.source}>{source.source}</Subheader>];

            if (!source.results) {
                items.push(<LoadingIndicatorSmall key={source.source + '/loading'}/>);
                return items;
            }

            if (source.bestResult) {
                items.push(this.getListItem(issue, source, source.bestResult, 0));
            }

            items.push(<ListItem key={source.source + '/more'}
                                 secondaryText={'More...'}
                                 primaryTogglesNestedList={true}
                                 nestedItems={source.results.map(result => this.getListItem(issue, source, result, 1))}/>);

            return items;
        });
    }

    getListItem(issue, source, result, nestedLevel) {
        return <div key={source.source + '/' + result.id} className="list-item">
            <ListItem primaryText={result.name}
                      nestedLevel={nestedLevel}
                      containerElement={
                          <Link to={`/read/${issue.id}/${source.source}/${result.id}/${issue.issueNumber}`}/>
                      }
            />
            <IconButton className="zoom-in"
                        iconClassName="material-icons"
                        href={`/api/downloader/download/${issue.id}/${source.source}/${result.id}/${issue.issueNumber}`}
            >cloud_download</IconButton>
        </div>;
    }
}