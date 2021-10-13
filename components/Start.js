import React, { Component } from 'react';
import { View, ImageBackground, TextInput, Text, Button, StyleSheet, Pressable } from 'react-native';

export default class Start extends Component{
  constructor(props){
    super(props);
    this.state = {name: ''}; 
    this.state = {backgroundColor: ''};
  }
    
  render(){
    return (
      <ImageBackground style={styles.backgroundImage} source={require('../assets/background_image.png')} resizeMode="cover">
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <TextInput style={styles.textBox} onChangeText={(name) => {this.setState({name})}} value={this.state.name || ''} placeholder='Your Name'/>
            <Text style={styles.backgroundColorText}>Choose Background Color:</Text>
            <View style={styles.backgroundColorContainer}>
              <Pressable onPress={() => {this.setState({backgroundColor: '#090C08'})}}>
                <View style={styles.blackBackgroundColor}></View>
              </Pressable>
              <Pressable onPress={() => {this.setState({backgroundColor: '#474056'})}}>
                <View style={styles.darkGrayBackgroundColor}></View>
              </Pressable>
              <Pressable onPress={() => {this.setState({backgroundColor: '#8A95A5'})}}>
                <View style={styles.lightGrayBackgroundColor}></View>
              </Pressable>
              <Pressable onPress={() => {this.setState({backgroundColor: '#B9C6AE'})}}>
                <View style={styles.khakiBackgroundColor}></View>
              </Pressable>
            </View>
            <Button style={styles.button} color='#757083' title="Start Chatting" onPress={() => this.props.navigation.navigate('Chat', {name: this.state.name, backgroundColor: this.state.backgroundColor})}/>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  wrapper: {
    backgroundColor: 'white'
  },
  textBox: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1, 
    fontSize: 16, 
    fontWeight: "600", 
    color: '#757083',
    opacity: 0.5
  },
  backgroundColorText: {
    fontSize: 16, 
    fontWeight: "300", 
    color: '#757083', 
    opacity: 1
  },
  backgroundColorContainer: {
    flexDirection: 'row'
  },
  blackBackgroundColor: {
    backgroundColor: '#090C08',
    width: 50,
    height: 50,
    borderRadius: 50/2
  },
  darkGrayBackgroundColor: {
    backgroundColor: '#474056',
    width: 50,
    height: 50,
    borderRadius: 50/2
  },
  lightGrayBackgroundColor: {
    backgroundColor: '#8A95A5',
    width: 50,
    height: 50,
    borderRadius: 50/2
  },
  khakiBackgroundColor: {
    backgroundColor: '#B9C6AE',
    width: 50,
    height: 50,
    borderRadius: 50/2
  },
  button: {
    fontSize: 16, 
    fontWeight: "600"
  }
});