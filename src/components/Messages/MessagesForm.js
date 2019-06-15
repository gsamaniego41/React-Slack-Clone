import React from "react";
import firebase from "../../firebase";
import {Segment, Button, Input} from "semantic-ui-react";

class MessagesForm extends React.Component {
  state = {
    message: "",
    channel: this.props.currentChannel,
    loading: false,
    currentUser: this.props.currentUser,
    errors: []
  };

  handleChange = e => this.setState({[e.target.name]: e.target.value});

  createMessage = () => {
    // message schema
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.currentUser.uid,
        name: this.state.currentUser.displayName,
        avatar: this.state.currentUser.photoURL
      },
      content: this.state.message
    };

    return message;
  };

  sendMessage = () => {
    const {messagesRef} = this.props;
    const {message, channel} = this.state;

    if (message) {
      this.setState({loading: true});

      messagesRef
        .child(channel.id)
        .push.set(this.createMessage())
        .then(() => {
          this.setState({loading: false, message: "", errors: []});
        })
        .catch(err => {
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({message: "Add a message"})
      });
    }
  };

  render() {
    const {errors} = this.state;

    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          onChange={this.handleChange}
          style={{marginBottom: "0.7em"}}
          label={<Button icon={"add"} />}
          labelPosition="left"
          placeholder="Write your message"
          className={
            errors.some(error => error.message.includes("message"))
              ? "error"
              : ""
          }
        />
        <Button.Group>
          <Button
            onClick={this.sendMessage}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
      </Segment>
    );
  }
}

export default MessagesForm;
