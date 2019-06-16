import React, {Component} from "react";
import {Segment, Comment} from "semantic-ui-react";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";
import Message from "./Message";

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    messagesLoading: true,
    channel: this.props.currentChannel,
    currentUser: this.props.currentUser
  };

  componentDidMount() {
    const {channel, currentUser} = this.state;

    if (channel && currentUser) {
      this.addListeners(channel.id);
    }
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    this.state.messagesRef.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      console.log("loadedMessages", loadedMessages);
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
    });
  };

  displayMessages = messages => {
    return (
      messages.length > 0 &&
      messages.map(message => {
        return (
          <Message
            key={message.timestamp}
            message={message}
            user={this.state.currentUser}
          />
        );
      })
    );
  };

  render() {
    const {messagesRef, messages, channel, currentUser} = this.state;

    return (
      <>
        <MessagesHeader />
        <Segment>
          <Comment.Group className="messages">
            {this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessagesForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={currentUser}
        />
      </>
    );
  }
}

export default Messages;
