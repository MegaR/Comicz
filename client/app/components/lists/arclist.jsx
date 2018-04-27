import React from "react";
import {Link} from "react-router-dom";
import {Avatar, Card, List, ListItem, Subheader} from "material-ui";
import './lists.scss';

export class ArcList extends React.Component {
    render() {
        return <div>
            <Card>
                <List className="list volumes">
                    <Subheader>Story Arcs</Subheader>
                    {this.items()}
                </List>
            </Card>
        </div>;
    }

    items() {
        if (!this.props.items) return [];

        return this.props.items.map(
            (arc) =>
                <ListItem
                    key={arc.id}
                    primaryText={arc.name}
                    leftAvatar={arc.thumbnail ? <img src={arc.thumbnail}/> : null}
                    containerElement={<Link to={"/arc/" + arc.id}/>}
                />
        )
    }
}