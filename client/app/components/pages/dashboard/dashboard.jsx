import React from "react";
import {Card, List, ListItem, Subheader} from "material-ui";
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
            <Card>
                <List className="list volumes">
                    <Subheader>Followed volumes</Subheader>
                    {this.items(this.state.volumes)}
                </List>
            </Card>
        </div>
    }

    items(volumes) {
        if (!volumes) return [];

        return volumes.map(
            (volume) =>
                <ListItem
                    key={volume.id}
                    primaryText={volume.name + ' (' + volume.startYear + ')'}
                    leftAvatar={volume.thumbnail ? <img src={volume.thumbnail}/> : null}
                    secondaryText={volume.description}
                    secondaryTextLines={2}
                    containerElement={<Link to={"/volume/" + volume.id}/>}
                />
        )
    }
}