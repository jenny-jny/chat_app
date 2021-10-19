import React, { Component } from 'react';
import firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
import { View, Text, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';

import CustomActions from './CustomActions';

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
    this.state = { 
      isConnected: false,
      loggedInText: 'Please wait. You are being logged in.', 
      messages: [], 
      user: {_id: '', name: ''} 
    }

    // if(!firebase.apps.length){
    //   firebase.initializeApp(firebaseConfig);
    // }

    // //create a promise to messages collection
    // this.referenceChatMessages = firebase.firestore().collection('messages');
  }

  async getMessages(){
    let messages = '';
    try{
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    }catch(error){
      console.log(error.message);
    }
  }

  checkNullUndefined(array){
    let result = false;
    array.forEach((element) => {
      if(element === null || element === undefined){
        result = true;
      }
    })
    return result;
  }

  onCollectionUpdate = querySnapshot => {
    const messages = [];
    //go through each document
    querySnapshot.forEach((doc) => {
      //get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || '',
        createdAt: data.createdAt.toDate(),
        user: data.user,
        system: data.system,
        image: data.image || null,
        location: data.location || null
      });
      this.setState({messages});
      this.saveMessages();
    });
  };

  async saveMessages(){
    try{
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    }catch(error){
      console.log(error.message);
    }
  }

  async deleteMessages(){
    try{
      await AsyncStorage.removeItem('messages');
      this.setState({messages: []})
    }catch(error){
      console.log(error.message);
    }
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
    //     },
    //     // Add image data to the message object
    //     {
    //       _id: 3,
    //       text: 'My message',
    //       createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
    //       user: {
    //         _id: 2,
    //         name: 'React Native',
    //         avatar: 'https://facebook.github.io/react-native/img/header_logo.png',
    //       },
    //       image: 'https://facebook.github.io/react-native/img/header_logo.png',
    //     },
    //     // Add location data to the message object
    //     {
    //       _id: 4,
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: 'React Native',
    //         avatar: 'https://placeimg.com/140/140/any',
    //       },
    //       location: {
    //         latitude: 48.864601,
    //         longitude: 2.398704,
    //       },
    //     }
    //   ]
    // })

    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    NetInfo.fetch().then(connection => {
      if(connection.isConnected){
        this.setState({isConnected: true});
        console.log('online');

        if(!firebase.apps.length){
          firebase.initializeApp(firebaseConfig);
        }
    
        //create a promise to messages collection
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
            });
          
          //create a promise to the active user's documents (messages)
          this.referenceChatMessagesUser = firebase.firestore().collection('messages').where('user._id', '==', this.state.user._id);

          this.referenceChatMessagesUser.get().then((querySnapshot) => {
            if(this.checkNullUndefined(querySnapshot)){
              alert('The messages contain undefined or null values');
            }else{
              // listen for collection changes for current user
              this.unsubscribe = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
            }
          }).catch((error) => {
            console.log("Error getting documents: ", error);
          });
        });
      }else{
        console.log('offline');
        this.setState({
          loggedInText: 'You are in offline mode.'
        });
        this.getMessages();
      }
    });
  }

  componentWillUnmount(){
    //stop listening to authentication
    this.authUnsubscribe();
    //stop listening for changes
    this.unsubscribe();
  }

  //add a new messages to the collection
  addMessages(){
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }), () => {
      if(this.state.isConnected === false){
        this.saveMessages();
      }else{
        this.addMessages();
      }
    });
  }

  renderBubble(props){
    return (
      <Bubble {...props} wrapperStyle={{right: {backgroundColor: '#000'}}}/>
    );
  }

  renderInputToolbar(props){
    if(this.state.isConnected === false){
    }else{
      return (
        <InputToolbar {...props}/>
      );
    }
  }

  renderCustomActions(props){
    return <CustomActions {...props}/>;
  }

  renderCustomView(props){
    const { currentMessage } = props;
    if(currentMessage.location){
      return (
        <MapView style={{width: 150, height: 100, borderRadius: 13, margin: 3}} region={{latitude: currentMessage.location.latitude, longitude: currentMessage.location.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421}}/>
      );
    }
    return null;
  }

  render() {
    let { backgroundColor } = this.props.route.params;
    return (
      <View style={[styles.container, {backgroundColor: backgroundColor}]}>
        <Text>{this.state.loggedInText}</Text>
        <GiftedChat messages={this.state.messages} onSend={messages => this.onSend(messages)} user={this.state.user} renderBubble={this.renderBubble.bind(this)} renderInputToolbar={this.renderInputToolbar.bind(this)} renderActions={this.renderCustomActions} renderCustomView={this.renderCustomView}/>
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