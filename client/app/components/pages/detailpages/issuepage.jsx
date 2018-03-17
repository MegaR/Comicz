import React from "react";
import api from "../../../services/api";
import {Card, Chip, FlatButton} from "material-ui";
import {LoadingIndicator} from "../../loadingindicator/loadingindicator";
import "./detailpage.scss";
import {CharactersList} from "../../lists/characterslist";
import Link from "react-router-dom/es/Link";
import {ComicSearch} from "../../comicsearch/comicsearch";

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
                            <Chip onClick={()=>{this.toggleRead()}} style={{display: 'inline-block'}}>{issue.finished?'Read':'Unread'}</Chip>
                        </h1>
                    </div>
                    <img src={issue.thumbnail}/>
                    <FlatButton containerElement={<Link to={'/volume/'+issue.volume.id} />} secondary={true}>{issue.volume.name}</FlatButton>
                    <p>{issue.description}</p>
                    <div className="buttons">
                        <FlatButton secondary={true} href={issue.detailsUrl} target="_blank">Comic Vine</FlatButton>
                    </div>
                    <div className="clearfix"/>
                </Card>
            </div>
            <ComicSearch issue={issue}/>
            <CharactersList items={issue.characters}/>
        </div>
    }
}