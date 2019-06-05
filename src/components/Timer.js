import React, { Component } from "react";

import AsyncStorage from '@react-native-community/async-storage';

import { Text } from "react-native";

import PropTypes from 'prop-types';

import moment from 'moment';

export default class Timer extends Component {

	constructor(props) {
		
		super(props);

		this.state = {
			timerTextColor: "#005cd1",
		}
	}

    render() {
        return (
            <Text style={{marginTop: 10, marginBottom: 10, alignItems: 'center', alignSelf: 'center', color: this.state.timerTextColor}}> Atualizado em: {this.props.dateSync} </Text>
        )
    }
}