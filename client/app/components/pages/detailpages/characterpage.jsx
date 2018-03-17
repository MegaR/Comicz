import React from "react";
import api from "../../../services/api";
import {Card, FlatButton} from "material-ui";
import {LoadingIndicator} from "../../loadingindicator/loadingindicator";
import "./detailpage.scss";

export class CharacterPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        api.character(this.props.match.params.id)
            .then(character => {
                this.setState({character: character});
            })
            .catch(error => {
                //todo error handling
                console.warn(error);
            });
    }

    render() {
        if (!this.state.character) return <LoadingIndicator/>;
        const character = this.state.character;

        return <div className="detailpage">
            <div className="description">
                <Card>
                    <h1>{character.name}</h1>
                    <img src={character.thumbnail}/>
                    <p>{character.description}</p>
                    <div className="buttons">
                        <FlatButton secondary={true} href={character.detailsUrl} target="_blank">Comic Vine</FlatButton>
                    </div>
                    <div className="clearfix"/>
                </Card>
            </div>
        </div>
    }
}