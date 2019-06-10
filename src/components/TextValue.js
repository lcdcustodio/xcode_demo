import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
import PropTypes from 'prop-types';

export default class TextValue extends Component {
  constructor(props) {
    super(props)   
  }


  render(){
    return (
      <Text style={[styles.value, {"color": this.props.color, "fontSize": this.props.size, "marginTop": `${this.props.marginTop}%`, "marginLeft": `${this.props.marginLeft}%` } ]} 
        onPress={ item => this.props.press ? this.props.press(this.props.value) : ''}> { this.props.value } </Text>
    )
  }
}

TextValue.defaultProps = {
  value: "Value",
  marginLeft: 0,
  marginTop: 0,
  size: 18,
  color: "#3D3D3D"
};

const styles = StyleSheet.create({
  value: {
    fontFamily: "Gotham Rounded",
    fontWeight: "normal", 
    fontStyle: "normal", 
    lineHeight: 22, 
    letterSpacing: 0,
  }
})