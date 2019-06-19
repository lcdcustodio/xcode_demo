import React, { Component } from "react";

import AsyncStorage from '@react-native-community/async-storage';

import { Text, View } from "react-native";

import moment from 'moment';

export default class Timer extends Component {

    render() {
        return (
        	<View style={{backgroundColor: this.props.timerBackgroundColor}}>
            	<Text style={{marginTop: 10, fontSize: 16, marginBottom: 10, alignItems: 'center', alignSelf: 'center', fontWeight: "bold", color: this.props.timerTextColor}}> Atualizado em: {this.props.dateSync} </Text>
        	</View>
        )
    }
}