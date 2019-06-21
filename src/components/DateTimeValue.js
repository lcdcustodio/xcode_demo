import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import moment from 'moment';
import TextValue from './TextValue';

export default class DateTimeValue extends Component {

	static defaultProps = {
		format: 'DD/MM/YYYY HH:mm:ss',
	};

	constructor(props) {
		super(props);
	}

	render () {
		const textProps = {...this.props};
		textProps.value = moment(textProps.value).format(textProps.format);
		return <TextValue {...textProps}/>
	}
}
