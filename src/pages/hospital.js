import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

export default class Hospital extends Component {
  
  render() {

  	const { navigation } = this.props;

    const hospital = navigation.getParam('hospital');

    console.log(hospital);

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to {hospital.title}!</Text>
      </View>
    );
  }
}

Hospital.navigationOptions = ({ navigation }) => ({
	title: navigation.state.params.hospital.title
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
