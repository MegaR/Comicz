import "./settingspage.scss"
import React from "react";
import {Card, RaisedButton, TextField} from "material-ui";
import api from "../../../services/api";

export default class SettingsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {error: null};
    }

    changePassword() {
        api.setPassword(this.text)
            .then(response => console.log(response))
            .catch(error => console.error(error));
    }

    render() {
        return <div className="settings-page">
            <Card className="card">
                <h1>Change password</h1>
                <TextField floatingLabelText={'New Password'} type="password" errorText={this.state.error}
                           onChange={(event, text) => this.text = text}/>
                <RaisedButton primary={true} fullWidth={true} onClick={() => this.changePassword()}
                              style={{marginTop: '16px'}}>Change</RaisedButton>
            </Card>
        </div>;
    }
}