import React, { Component } from "react";

import AsyncStorage from '@react-native-community/async-storage';

import { Text, View } from "react-native";

import PropTypes from 'prop-types';

import moment from 'moment';

export default class Timer extends Component {

	constructor(props) {
		
		super(props);

		this.state = {
			timerTextColor: "#005cd1",
			timerBackgroundColor: "#fff",
		}

		let today =  moment().format('YYYY-MM-DD');

		AsyncStorage.getItem('require_sync_at', (err, res) => {

			let require_sync_at = JSON.parse(res);

			console.log('today', today);
			console.log('require_sync_at', require_sync_at);
			console.log('state', this.state);

			if (require_sync_at == today) {
				this.setState({ timerTextColor: "#856404", timerBackgroundColor: "#fff3cd" });
			}

			if (require_sync_at < today) {
				this.setState({ timerTextColor: "#721c24", timerBackgroundColor: "#f8d7da" });
			}

		});
	}

    render() {
        return (
        	<View style={{backgroundColor: this.state.timerBackgroundColor}}>
            	<Text style={{marginTop: 10, marginBottom: 10, alignItems: 'center', alignSelf: 'center', fontWeight: "bold", color: this.state.timerTextColor}}> Atualizado em: {this.props.dateSync} </Text>
        	</View>
        )
    }
}