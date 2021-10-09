import React, { Component } from 'react';
import { View, StyleSheet} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends Component {
  constructor() {
    super();
    this.state = { messages: [] }
  }

  componentDidMount() {
    this.setState({
      messages: [{
        _id: 1,
        text: 'Hello developer',
        createdAt = new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any'
        }
      }]
    })
  }

  onSend(messages = []) {
    this.setState(previousState => {
      messages: GiftedChat.append(previousState.messages, messages)
    })
  }

  render() {
    let { name, backgroundColor } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    return (
      <View style={[styles.container, {backgroundColor: backgroundColor}]}>
        <GiftedChat messages={this.state.messages} onSend={messages => this.onSend(messages)} user={{_id: 1}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});