import React from "react";
import {Card} from "material-ui";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    componentDidCatch(error, info) {
        this.setState({hasError: true, error: error, info: info});
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <div>
                <Card>
                    <h1>Something went wrong.</h1>
                    <pre>{'' + this.state.error}</pre>
                </Card>
            </div>;
        }
        return this.props.children;
    }
}