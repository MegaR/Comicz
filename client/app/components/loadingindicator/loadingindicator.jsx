import React from "react";
import {CircularProgress} from "material-ui";
import "./loadingindicator.scss";

export class LoadingIndicator extends React.Component {
    get size() {
        return 70;
    }

    get thickness() {
        return 5;
    }

    render() {
        return <div className="loading-indicator"><CircularProgress size={this.size} thickness={this.thickness} /></div>;
    }
}

export class LoadingIndicatorSmall extends LoadingIndicator {
    get size() {
        return 35;
    }

    get thickness() {
        return 3;
    }
}