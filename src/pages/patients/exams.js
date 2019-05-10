import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { H1 } from 'native-base';

export default class Exams extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.welcome}>Welcome to Exams</Text>
			</View>
		);
	}
}

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
});