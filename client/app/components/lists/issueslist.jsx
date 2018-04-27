import React from "react";
import {Link} from "react-router-dom";
import {Card, Chip, List, ListItem, Subheader} from "material-ui";
import {ReadChip} from "../readchip/readchip";

export class IssuesList extends React.Component {
    render() {
        return <div>
            <Card>
                <List className="list issues">
                    <Subheader>Issues</Subheader>
                    {this.items()}
                </List>
            </Card>
        </div>;
    }

    items() {
        if (!this.props.items) return [];

        return this.props.items.map(
            (issue) =>
                <ListItem
                    key={issue.id}
                    primaryText={<span>{issue.name} #{issue.issueNumber} <ReadChip read={issue.finished} progress={issue.progress}/></span>}
                    leftAvatar={issue.thumbnail ? <img src={issue.thumbnail}/> : null}
                    secondaryText={<span><i>{issue.date} </i>{issue.description}</span>}
                    secondaryTextLines={2}
                    containerElement={<Link to={"/issue/" + issue.id}/>}
                />
        )
    }
}