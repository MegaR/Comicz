import "./loginpage.scss"
import React from "react";
import {Card, RaisedButton, TextField} from "material-ui";
import {Redirect} from "react-router-dom";
import auth from "../../../services/auth";

export default class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {redirectToReferrer: false};
    }

    login() {
        auth.login(this.text)
            .then(() => {
                this.setState({error: null, redirectToReferrer: true});
            })
            .catch(error => {
                console.error(error);
                this.setState({error: 'Login failed', redirectToReferrer: false});
            });
    }

    render() {
        if (this.state.redirectToReferrer) {
            const {from} = this.props.location.state || {from: {pathname: "/"}};
            return <Redirect to={from}/>;
        }

        return <div className="login-page">
            <Card className="card">
                <h1>Login</h1>
                <TextField floatingLabelText={'Password'} type="password" errorText={this.state.error} onChange={(event, text) => this.text = text}/>
                <RaisedButton primary={true} fullWidth={true} onClick={() => this.login()}
                              style={{marginTop: '16px'}}>Login</RaisedButton>
            </Card>
        </div>;
    }
}