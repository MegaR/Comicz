import React from "react";
import api from "../../../services/api";
import {IssuesList} from "../../lists/issueslist";
import {Card, FlatButton} from "material-ui";
import {LoadingIndicator} from "../../loadingindicator/loadingindicator";
import "./detailpage.scss";
import {CharactersList} from "../../lists/characterslist";

export class ArcPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        api.arc(this.props.match.params.id)
            .then(arc => {
                this.setState({arc: arc});
            })
            .catch(error => {
                //todo error handling
                console.warn(error);
            });
    }

    render() {
        if (!this.state.arc) return <LoadingIndicator/>;
        const arc = this.state.arc;

        return <div className="detailpage">
            <div className="description">
                <Card>
                    <h1>{arc.name}</h1>
                    <img src={arc.thumbnail}/>
                    <div className="buttons">
                        <FlatButton secondary={true} href={arc.detailsUrl} target="_blank">Comic Vine</FlatButton>
                    </div>
                    <div className="clearfix"/>
                </Card>
            </div>
            <IssuesList items={arc.issues}/>
        </div>
    }
}