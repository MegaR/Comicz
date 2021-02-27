import { Card, Classes } from '@blueprintjs/core';
import React from 'react';
import LoginForm from './login.form';

export default class LoginPage extends React.Component {
    onLogin(username: string, password: string) {
        console.log('enter');
    }

    render() {
        return (
            <Card className={Classes.ELEVATION_4}>
                <LoginForm
                    onLogin={(username, password) =>
                        this.onLogin(username, password)
                    }
                />
            </Card>
        );
    }
}
