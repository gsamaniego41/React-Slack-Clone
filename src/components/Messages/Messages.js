import React, {Component} from "react";
import {Segment, Comment} from "semantic-ui-react";
import firebase from "../../firebase";

import MessagesHeader from "./MessagesHeader";
import MessagesForm from "./MessagesForm";

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    channel: this.props.currentChannel,
    currentUser: this.props.currentUser
  };

  render() {
    const {messagesRef, channel, currentUser} = this.state;

    return (
      <>
        <MessagesHeader />
        <Segment>
          <Comment.Group className="messages">{/* Messages */}</Comment.Group>
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
