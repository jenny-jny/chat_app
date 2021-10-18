import React, { Component } from 'react';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default class CustomActions extends Component{
  constructor(props){
    super(props);
  }

  pickImage = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    try{
      if(status === 'granted'){
        let result = await ImagePicker.launchImageLibraryAsync({
          // mediaTypes: ImagePicker.MediaTypeOptions.Images
          mediaTypes: 'Images'
        }).catch(error => console.log(error));
        if(!result.cancelled){
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({image: imageUrl});
        }
      }
    }catch(error){
      console.log(error.message);
    }
  };

  takePhoto = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
    try{
      if(status === 'granted'){
        let result = await ImagePicker.launchCameraAsync({
          // mediaTypes: ImagePicker.MediaTypeOptions.Images
          mediaTypes: 'Images'
        }).catch(error => console.log(error));
        if(!result.cancelled){
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({image: imageUrl});        
        }
      }
    }catch(error){
      console.log(error.message);
    }
  };

  getLocation = async () => {
    try{
      const {status} = await Permissions.askAsync(Permissions.LOCATION);
      if(status === 'granted'){
        let result = await Location.getCurrentPositionAsync({}).catch((error) => console.log(error));
        const longitude = JSON.stringify(result.coords.longitude);
        const latitude = JSON.stringify(result.coords.latitude);
        if(result){
          this.props.onSend({
            location: {
              longitude: longitude,
              latitude: latitude
            }
          });
        }
      }
    }catch(error){
      console.log(error.message);
    }
  }

  uploadImageFetch = async (uri) => {
    // fetch content from the given uri
    // const response = await fetch(uri);
    // convert content into blob
    // const blob = await response.blob();

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function(){
        resolve(xhr.response);
      };
      xhr.onerror = function(e){
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    const ref = firebase.storage().ref().child(`images/${imageName}`);

    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  onActionPress = () => {
    const options = ['Choose from Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {options, cancelButtonIndex},
      async (buttonIndex) => {
        switch(buttonIndex){
          case 0: 
            console.log('user wants to pick an image');
            return ;
          case 1:
            console.log('user wants to take a photo');
            return ;
          case 2: 
            console.log('use wants to get their location');
            return ;
          default:
        }
      }
    );
  }
    
  render(){
    return (
      <TouchableOpacity accessible={true} accessibilityLabel="More options" accessibilityHint="Let’s you choose to send an image or your geolocation." style={styles.container} onPress={this.onActionPress}>
        <View style={styles.wrapper, this.props.wrapperStyle}>
          <Text style={styles.iconText, this.props.iconTextStyle}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center'
  }
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func
};