import React from "react";
import api from "../../../services/api";
import {Card, FlatButton, List, ListItem, Subheader} from "material-ui";
import {LoadingIndicator} from "../../loadingindicator/loadingindicator";
import "./detailpage.scss";
import Link from "react-router-dom/es/Link";
import {ComicSearch} from "../../comicsearch/comicsearch";
import {ReadChip} from "../../readchip/readchip";

export class IssuePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        api.issue(this.props.match.params.id)
            .then(issue => {
                this.setState({issue: issue});
            })
            .catch(error => {
                //todo error handling
                console.warn(error);
            });
    }

    toggleRead() {
        const issue = this.state.issue;
        api.markFinished(this.props.match.params.id, !issue.finished)
            .then(() => {
                issue.finished = !issue.finished;
                this.setState({issue: issue});
            }).catch(error => {
            console.error(error);
            //todo errorhandling
        });
    }

    render() {
        if (!this.state.issue) return <LoadingIndicator/>;
        const issue = this.state.issue;

        return <div className="detailpage">
            <div className="description">
                <Card>
                    <div className="header">
                        <h1>
                            {issue.name} #{issue.issueNumber}&nbsp;
                            <ReadChip read={issue.finished} progress={issue.progress} onClick={() => {
                                this.toggleRead()
                            }}/>
                        </h1>
                    </div>
                    <img src={issue.thumbnail}/>
                    <FlatButton containerElement={<Link to={'/volume/' + issue.volume.id}/>}
                                secondary={true}>{issue.volume.name}</FlatButton>
                    <p>{issue.description}</p>
                    <div className="buttons">
                        <FlatButton secondary={true} href={issue.detailsUrl} target="_blank">Comic Vine</FlatButton>
                    </div>
                    <div className="clearfix"/>
                </Card>
            </div>
            <div>
                <Card>
                    <List>
                        <Subheader>Story arcs</Subheader>
                        {issue.storyArcs.map(arc =>
                            <ListItem key={arc.id} containerElement={<Link to={`/arc/${arc.id}`}/>}>
                                {arc.name}
                                </ListItem>
                        )}
                    </List>
                </Card>
            </div>
            <ComicSearch issue={issue}/>
            {/*<CharactersList items={issue.characters}/>*/}
        </div>
    }
}