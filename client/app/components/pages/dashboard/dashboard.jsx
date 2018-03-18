import React from "react";
import {Card, GridList, GridTile, List, ListItem, Subheader} from "material-ui";
import {LoadingIndicator} from "../../loadingindicator/loadingindicator";
import api from "../../../services/api";
import "./dashboard.scss"
import {Link} from "react-router-dom";

export class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        api.getTrackedVolumes()
            .then(volumes => {
                this.setState({volumes: volumes});
            })
            .catch(error => {
                //todo error handling
                console.warn(error);
            });
    }

    render() {
        if (!this.state.volumes) return <LoadingIndicator/>;

        return <div className="dashboardpage">
            <Card className="volume-card">
                <GridList className="volume-grid" padding={8}>
                    <Subheader>Followed volumes</Subheader>
                    {this.items(this.state.volumes)}
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
}