import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
import PropTypes from 'prop-types';

export default class TextValue extends Component {
  constructor(props) {
    super(props)   
  }

  render(){
    return (
      <Text style={[styles.value, {"fontSize": this.props.size, "marginTop": `${this.props.marginTop}%`, "marginLeft": `${this.props.marginLeft}%` } ]} onPress={ this.props.press}> { this.props.value } </Text>
    )
  }
}

TextValue.defaultProps = {
  value: "Value",
  marginLeft: 0,
  marginTop: 0,
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