import React from "react";
import {Chip} from "material-ui";
import {pinkA200, pinkA400} from "material-ui/styles/colors";

export class ReadChip extends React.Component {
    render() {
        let status = 'Unread';
        let color = null;
        if(this.props.read) {
            color = pinkA400;
            status = 'Read';
        } else if(this.props.progress) {
            color = pinkA200;
            status = 'Reading';
        }

        return <Chip backgroundColor={color} onClick={this.props.onClick} style={{display: 'inline-block'}}>{status}</Chip>
    }
}