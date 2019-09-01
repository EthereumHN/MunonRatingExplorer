import React, { Component } from "react";
import HackathonMunonContract from "./contracts/HackathonMunon.json";
import getWeb3 from "./utils/getWeb3";
import {
  Heading, Text, Card, Icon, Box
} from 'rimble-ui';
import NetworkIndicator from '@rimble/network-indicator';
import ConnectionBanner from '@rimble/connection-banner';
import Header from "./components/Header.js";
import ParticipantData from "./ParticipantData";
import ThreeBox from './3box'
import queryString from 'query-string'

//import "./App.css";

class App extends Component {
  state = { hackathon_id: 1, //Hadcoded preset
            participants_data: [],
            network_id: 0,
            web3: null, accounts: null, contract: null }
  componentDidMount = async () => {
    try {
      const values = queryString.parse(this.props.location.search);
      if(values.hackathon_id)
        this.setState({hackathon_id: values.hackathon_id});
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const network_id = await web3.eth.net.getId();
      const deployedNetwork = HackathonMunonContract.networks[network_id];
      const instance = new web3.eth.Contract(
        HackathonMunonContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, network_id: network_id }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  async get3BoxNames() {
    var participants_data = this.state.participants_data;
    for(var i=0; i<participants_data.length; i++)
    {
      const reviewer_profile = await ThreeBox.getProfile(participants_data[i].address);
      if(reviewer_profile && reviewer_profile.name)
      {
        participants_data[i].name = reviewer_profile.name;
        for(var j=0; j<participants_data.length; j++)
        {
          for(var k=0; k<participants_data[j].ratings.length; k++)
          {
            if(participants_data[j].ratings[k].reviewed_addr == participants_data[i].address)
            {
              participants_data[j].ratings[k].reviewed_name = reviewer_profile.name
            }
          }
        }
      }
    }
    this.setState(participants_data);
  }

  updateData(_this)
  {
    const { contract } = this.state;
    var that = _this

    contract.getPastEvents('Registration', {
      fromBlock: 0,
      toBlock: 'latest'
    }, function(error, events){
      var i = 0;
      for (i=0; i<events.length; i++) {
        var eventObj = events[i];
        if(that.state.hackathon_id == eventObj.returnValues.hackathon_id)
        {
          var participants_data = that.state.participants_data;
          participants_data.push({address: eventObj.returnValues.participant_addr, name: "", ratings: []})
          that.setState(participants_data)
        }
      }
      
      contract.getPastEvents('RatingSubmited', {
        fromBlock: 0,
        toBlock: 'latest'
      }, function(error, events){
        var i = 0;
        for (i=0; i<events.length; i++) {
          var eventObj = events[i];
          if(that.state.hackathon_id == eventObj.returnValues.hackathon_id)
          {
            for(var j=0; j<that.state.participants_data.length; j++)
            {
              var participant_data = that.state.participants_data[j];
              if(participant_data.address == eventObj.returnValues.reviewer_addr)
              {
                var participants_data = that.state.participants_data;
                participants_data[j].ratings.push({reviewed_addr: eventObj.returnValues.reviewed_addr, reviewed_name: "", points: eventObj.returnValues.points})
                that.setState(participants_data)
              }
            }
          }
        }


        that.get3BoxNames();
      });
    });
  }

  runExample = async () => {
    if(this.state.network_id === 1)
      this.updateData(this);
  };

  render() {
    const participantData = this.state.participants_data.map((participant_data) =>
      <ParticipantData address={participant_data.address} name={participant_data.name} ratings={participant_data.ratings}/>
    );
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Header/>
        <Box maxWidth={'640px'} mx={'auto'} p={3}>
          <NetworkIndicator currentNetwork={this.state.network_id} requiredNetwork={1} />
          <ConnectionBanner
            currentNetwork={this.state.network_id}
            requiredNetwork={1}
            onWeb3Fallback={window.ethereum == null}
          />
          {participantData}
        </Box>
      </div>
    );
  }
}

export default App;