import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
import PropTypes from 'prop-types';

export default class TextLabel extends Component {
  constructor(props) {
    super(props)   
  }

  render(){
    return (
      <Text style={[styles.label, {"fontSize": this.props.size, "marginTop": `${this.props.marginTop}%`, "marginBottom": `${this.props.marginBottom}%`, "marginLeft": `${this.props.marginLeft}%`,} ]}> { this.props.label } </Text>
    )
  }
}

/* TextLabel.propTypes = {
  label: PropTypes.string.isRequired,
  marginTop: PropTypes.string.isRequired,
  marginBottom: PropTypes.string.isRequired,
  marginLeft: PropTypes.string.isRequired,
}; */

TextLabel.defaultProps = {
  label: "Label",
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  size: 15,
};

const styles = StyleSheet.create({
  label: {
    color: "rgb(194, 194, 194)", 
    fontFamily: "Gotham Rounded-Medium", 
    fontSize: 15, 
    fontWeight: "normal", 
    fontStyle: "normal", 
    lineHeight: 22, 
    letterSpacing: 0,
  }
})