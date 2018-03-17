import React from "react";
import {Link} from "react-router-dom";
import {Avatar, Card, List, ListItem, Subheader} from "material-ui";
import './lists.scss';

export class VolumesList extends React.Component {
    render() {
        return <div>
            <Card>
                <List className="list volumes">
                    <Subheader>Volumes</Subheader>
                    {this.items()}
                </List>
            </Card>
        </div>;
    }

    items() {
        if (!this.props.items) return [];

        return this.props.items.map(
            (volume) =>
                <ListItem
                    key={volume.id}
                    primaryText={volume.name + ' (' + volume.startYear + ')'}
                    leftAvatar={volume.thumbnail ? <img src={volume.thumbnail}/> : null}
                    secondaryText={volume.description}
                    secondaryTextLines={2}
                    containerElement={<Link to={"/volume/" + volume.id}/>}
                />
            // <p>
            //     <img src={volume.thumbnail}/>
            //     <strong>{volume.name} ({volume.startYear})</strong><br/>
            //     <span>{volume.description}</span>
            // </p>
            // <Link to={"/volume/"+volume.id}>Open</Link>
            // <a href={volume.detailsUrl} target="_blank" className="button">ComicVine</a>
            // <div className="clear"/>
        )
    }
}