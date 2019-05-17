import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
import PropTypes from 'prop-types';

export default class Title extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Text style={{ marginTop: `${this.props.marginTop}%`, marginLeft: `${this.props.marginLeft}%`, fontFamily: "Gotham Rounded-Medium", fontSize: this.props.size, fontWeight: "400", 
        fontStyle: "normal", lineHeight: 24, letterSpacing: 0, textAlign: "left", color: `${this.props.color}` }} > {this.props.title} </Text>
    )
  }
}

Title.defaultProps = {
  marginTop: 0,
  marginLeft: 0,
  size: 20,
  color: 'rgb(25, 118, 159)',
  title: 'Title'
}