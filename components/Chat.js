import React, { Component } from 'react';
import { View, Text, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import firebase from 'firebase';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

const firebaseConfig = {
  apiKey: "AIzaSyCqZ-iB_h3D8w_CkM8H5i5hmAh2dVvt4z4",
  authDomain: "chat-app-b5390.firebaseapp.com",
  projectId: "chat-app-b5390",
  storageBucket: "chat-app-b5390.appspot.com",
  messagingSenderId: "299401357206"
}

export default class Chat extends Component {
  constructor() {
    super();
    this.state = { loggedInText: 'Please wait. You are being logged in.', messages: [], user: {_id: '', name: ''} }

    if(!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection('messages');
  }

  onCollectionUpdate = querySnapshot => {
    const messages = [];
    //go through each document
    querySnapshot.forEach((doc) => {
      //get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
        system: data.system
      });
      this.setState({messages});
    });
  };

  checkNullUndefined(array){
    let result = false;
    array.forEach((element) => {
      if(element == null || element == undefined){
        result = true;
      }
    })
    return result;
  }

  componentDidMount() {
    // this.setState({
    //   messages: [
    //     {
    //       _id: 1,
    //       text: 'You have entered the chat room',
    //       createdAt: new Date(),
    //       system: true
    //     },
    //     {
    //       _id: 2,
    //       text: 'Hello developer',
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: 'React Native',
    //         avatar: 'https://placeimg.com/140/140/any'
    //       }
    //     }
    //   ]
    // })

    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    //create a promise to shoppinglists collection
    this.referenceChatMessages = firebase.firestore().collection('messages');

    //listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(
      async (user) => {
        if(!user){
          await firebase.auth().signInAnonymously();
        }

        //update user state with currently active user data
        this.setState({
          loggedInText: '',
          messages: [],
          user: {
            _id: user.uid,
            name: name
          }
          // messages: []
        })
      
      //create a promise to the active user's documents (messages)
      this.referenceChatMessagesUser = firebase.firestore().collection('messages').where('user._id', '==', this.state.user._id);

      this.referenceChatMessagesUser.get().then((querySnapshot) => {
        if(this.checkNullUndefined(querySnapshot)){
          alert('The messages contain undefined or null values');
        }else{
          //listen for collection changes for current user
          this.unsubscribe = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
        }
      }).catch((error) => {
        console.log("Error getting documents: ", error);
      });
    });
  }

  componentWillUnmount(){
    //stop listening to authentication
    this.authUnsubscribe();
    //stop listening for changes
    this.unsubscribe();
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }), () => {
      this.addMessages();
    })
  }

  //add a new list to the collection
  addMessages(){
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user
    });
  }

  renderBubble(props){
    return (
      <Bubble {...props} wrapperStyle={{right: {backgroundColor: '#000'}}}/>
    );
  }

  render() {
    let { backgroundColor } = this.props.route.params;
    return (
      <View style={[styles.container, {backgroundColor: backgroundColor}]}>
        <Text>{this.state.loggedInText}</Text>
        <GiftedChat messages={this.state.messages} onSend={messages => this.onSend(messages)} user={this.state.user} renderBubble={this.renderBubble.bind(this)}/>
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