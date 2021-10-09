import React, { Component } from 'react';
import { View, StyleSheet} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends Component {
  constructor() {
    super();
    this.state = { messages: [] }
  }
  render() {
    let { name, backgroundColor } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    return (
      <View style={[styles.container, {backgroundColor: backgroundColor}]}>
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