import React, {Component} from "react";
import {connect} from "react-redux";
import {setCurrentChannel} from "../../actions";
import firebase from "../../firebase";
import {Menu, Icon, Modal, Form, Input, Button} from "semantic-ui-react"; // Menu.Menu -> Sub Menu

class Channels extends Component {
  state = {
    user: this.props.currentUser,
    channels: [],
    modal: false,
    channelName: "",
    channelDetails: "",
    channelsRef: firebase.database().ref("channels"),
    firstLoad: true
  };

  componentDidMount() {
    this.addListeners();
  }

  addListeners = () => {
    let loadedChannels = [];

    // listens for every new child added
    this.state.channelsRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      this.setState({channels: loadedChannels}, () => this.setFirstChannel());
    });
  };

  setFirstChannel = () => {
    // takes the first channel in the channel array and put it on global state
    if (this.state.firstLoad && this.state.channels.length > 0) {
      const firstChannel = this.state.channels[0];
      this.props.setCurrentChannel(firstChannel);
    }
    this.setState({firstLoad: false});
  };

  closeModal = () => this.setState({modal: false});

  openModal = () => this.setState({modal: true});

  addChannel = () => {
    const {channelsRef, channelName, channelDetails, user} = this.state;

    // creates a unique identifier for every channel created
    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({channelName: "", channelDetails: ""});
        this.closeModal();
        console.log("channel added");
      });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    }
  };

  displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{opacity: 0.7}}
      >
        # {channel.name}
      </Menu.Item>
    ));

  changeChannel = channel => {
    this.props.setCurrentChannel(channel);
  };

  isFormValid = ({channelName, channelDetails}) =>
    channelName && channelDetails;

  handleChange = e => this.setState({[e.target.name]: e.target.value});

  render() {
    const {channels, modal} = this.state;
    console.log(this.state.channels);
    return (
      <>
        <Menu.Menu style={{paddingBottom: "2em"}}>
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>{" "}
            ({channels.length}) <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>

        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.addChannel}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" inverted onClick={this.addChannel}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default connect(
  null,
  {setCurrentChannel}
)(Channels);
