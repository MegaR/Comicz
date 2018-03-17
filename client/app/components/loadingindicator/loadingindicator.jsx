import React from "react";
import {CircularProgress} from "material-ui";
import "./loadingindicator.scss";

export class LoadingIndicator extends React.Component {
    render() {
        return <div className="loading-indicator"><CircularProgress size={70} thickness={5} /></div>;
    }
}