import React, { Component } from "react";
import { Card, Heading, Text, Box, EthAddress, Table } from "rimble-ui";

class ParticipantData extends Component {
    render() {
    const participantRatings = this.props.ratings.map((ratings) =>
      <tr>
        <td>
          {ratings.reviewed_name === "" &&
            <EthAddress
              address={ratings.reviewed_addr}
              truncate={true}
            />
          }
          {ratings.reviewed_name !== "" &&
            <Text>{ratings.reviewed_name}</Text>
          }
        </td>
        <td>
          <Text>{ratings.points}</Text>
        </td>
      </tr>
    );
    return (
      <Card>
        {this.props.name === "" &&
          <Heading.h4>{this.props.address}</Heading.h4>
        }
        {this.props.name !== "" &&
          <Heading.h4>{this.props.name}'s ratings</Heading.h4>
        }
        <Table>
          <thead>
            <tr>
              <th>Reviewed</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {participantRatings}
          </tbody>
        </Table>
      </Card>
    );
  }
}

export default ParticipantData;
