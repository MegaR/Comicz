import React from "react";
import api from "../../../services/api";
import {IssuesList} from "../../lists/issueslist";
import {Card, FlatButton} from "material-ui";
import {LoadingIndicator} from "../../loadingindicator/loadingindicator";
import "./detailpage.scss";
import {CharactersList} from "../../lists/characterslist";

export class VolumePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        api.volume(this.props.match.params.id)
            .then(volume => {
                this.setState({volume: volume});
            })
            .catch(error => {
                //todo error handling
                console.warn(error);
            });
    }

    toggleFollow() {
        const volume = this.state.volume;
        api.markTracked(this.props.match.params.id, !volume.tracked)
            .then(()=>{
                volume.tracked = !volume.tracked;
                this.setState({volume: volume});
            })
            .catch(error => {
                //todo error handling
                console.error(error);
            })
    }

    render() {
        if (!this.state.volume) return <LoadingIndicator/>;
        const volume = this.state.volume;

        return <div className="detailpage">
            <div className="description">
                <Card>
                    <h1>{volume.name} ({volume.startYear})</h1>
                    <img src={volume.thumbnail}/>
                    <p>{volume.description}</p>
                    <div className="buttons">
                        <FlatButton primary={true} onClick={()=>{this.toggleFollow()}}>{volume.tracked?'Unfollow':'Follow'}</FlatButton>
                        <FlatButton secondary={true} href={volume.detailsUrl} target="_blank">Comic Vine</FlatButton>
                    </div>
                    <div className="clearfix"/>
                </Card>
            </div>
            <IssuesList items={volume.issues}/>
            {/*<CharactersList items={volume.characters}/>*/}
        </div>
    }
}