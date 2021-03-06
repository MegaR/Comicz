import React from "react";
import {Card, GridList, GridTile, Subheader} from "material-ui";
import {LoadingIndicator} from "../../loadingindicator/loadingindicator";
import api from "../../../services/api";
import "./dashboard.scss";
import {Link} from "react-router-dom";
import {ReadChip} from "../../readchip/readchip";

export class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        api.getTrackedVolumes()
            .then(volumes => {
                this.setState({volumes: volumes});
                return api.getHistory();
            })
            .then(issues => {
                this.setState({issues: issues});
            })
            .catch(error => {
                //todo error handling
                console.warn(error);
            });
    }

    render() {
        if (!this.state.volumes || !this.state.issues) return <LoadingIndicator/>;

        return <div className="dashboardpage">
            <Card className="volume-card">
                <GridList className="volume-grid" padding={16}>
                    <Subheader>Followed volumes</Subheader>
                    {this.items(this.state.volumes)}
                </GridList>
            </Card>
            <Card className="issue-card">
                <GridList className="issue-grid" padding={16}>
                    <Subheader>History</Subheader>
                    {this.historyItems(this.state.issues)}
                </GridList>
            </Card>
        </div>
    }

    items(volumes) {
        if (!volumes) return [];

        return volumes.map((volume) =>
            <GridTile
                key={volume.id}
                title={volume.name}
                className="volume"
                containerElement={<Link to={"/volume/" + volume.id}/>}>
                {volume.thumbnail ? <img src={volume.thumbnail}/> : null}
            </GridTile>
        )
    }

    historyItems(issues) {
        if (!issues) return [];
        return issues.map((issue) =>
            <GridTile
                key={issue.id}
                title={issue.name + ' #' + issue.issueNumber}
                className={'issue ' + (issue.finished?'finished':issue.progress?'reading':'')}
                containerElement={<Link to={"/issue/" + issue.id}/>}>
                {issue.thumbnail ? <img src={issue.thumbnail}/> : null}
            </GridTile>
        )
    }
}