import React, { Component } from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import firebase from 'firebase';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

const firebaseConfig = {
  apiKey: "AIzaSyCqZ-iB_h3D8w_CkM8H5i5hmAh2dVvt4z4",
  authDomain: "chat-app-b5390.firebaseapp.com",
  projectId: "chat-app-b5390",
  storageBucket: "chat-app-b5390.appspot.com",
  messagingSenderId: "299401357206"
}

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default class Chat extends Component {
  constructor() {
    super();
    this.state = { messages: [] }
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'You have entered the chat room',
          createdAt: new Date(),
          system: true
        },
        {
          _id: 2,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any'
          }
        }
      ]
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }))
  }

  renderBubble(props){
    return (
      <Bubble {...props} wrapperStyle={{right: {backgroundColor: '#000'}}}/>
    );
  }

  render() {
    let { name, backgroundColor } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    return (
      <View style={[styles.container, {backgroundColor: backgroundColor}]}>
        <GiftedChat messages={this.state.messages} onSend={messages => this.onSend(messages)} user={{_id: 1}} renderBubble={this.renderBubble.bind(this)}/>
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height"/> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center'
  }
});