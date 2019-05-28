import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
import PropTypes from 'prop-types';

export default class TextValue extends Component {
  constructor(props) {
    super(props)   
  }

  render(){
    return (
      <Text style={[styles.value, {"fontSize": this.props.size, "marginLeft": `${this.props.marginLeft}%`} ]}> { this.props.value } </Text>
    )
  }
}

TextValue.defaultProps = {
  value: "Value",
  marginLeft: 0,
  size: 18,
};

const styles = StyleSheet.create({
  value: {
    color: "rgb(61, 61, 61)", 
    fontFamily: "Gotham Rounded-Book",
    fontWeight: "normal", 
    fontStyle: "normal", 
    lineHeight: 22, 
    letterSpacing: 0,
  }
})