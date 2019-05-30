import React, { Component } from "react";

import AsyncStorage from '@react-native-community/async-storage';

import { Text } from "react-native";

import PropTypes from 'prop-types';

import moment from 'moment';

export default class Timer extends Component {
    render() {
        return (
            <Text style={{marginTop: 10, marginBottom: 10, alignItems: 'center', alignSelf: 'center'}}> Atualizado em: {this.props.dateSync} </Text>
        )
    }
}