import { Button, FormGroup, Icon, InputGroup } from '@blueprintjs/core';
import React from 'react';

interface LoginFormProps {
    onLogin: (username: string, password: string) => void;
}

interface LoginFormState {
    username: string;
    password: string;
}

export default class LoginForm extends React.Component<
    LoginFormProps,
    LoginFormState
> {
    constructor(props: LoginFormProps) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    render() {
        return (
            <>
                <FormGroup label={'Username'} labelFor={'username-input'}>
                    <InputGroup
                        id={'username-input'}
                        large={true}
                        leftIcon={<Icon icon={'person'} />}
                        onChange={event =>
                            this.setState({ username: event.target.value })
                        }
                        value={this.state.username}
                    />
                </FormGroup>
                <FormGroup label={'Password'} labelFor={'password-input'}>
                    <InputGroup
                        id={'password-input'}
                        type={'password'}
                        large={true}
                        leftIcon={<Icon icon={'lock'} />}
                        onChange={event =>
                            this.setState({ password: event.target.value })
                        }
                        value={this.state.password}
                    />
                </FormGroup>
                <Button
                    text={'Login'}
                    onClick={() =>
                        this.props.onLogin(
                            this.state.username,
                            this.state.password,
                        )
                    }
                />
            </>
        );
    }
}
