import React from "react";
import {Link} from "react-router-dom";
import {Avatar, Card, List, ListItem, Subheader} from "material-ui";

export class CharactersList extends React.Component {
    render() {
        return <div>
            <Card>
                <List className="list characters">
                    <Subheader>Characters</Subheader>
                    {this.items()}
                </List>
            </Card>
        </div>;
    }

    items() {
        if (!this.props.items) return [];

        return this.props.items.map(
            (character) =>
                <ListItem
                    key={character.id}
                    primaryText={character.name}
                    leftAvatar={character.thumbnail ? <img src={character.thumbnail}/> : null}
                    secondaryText={character.description}
                    secondaryTextLines={2}
                    containerElement={<Link to={"/character/" + character.id}/>}
                />
        )
    }
}