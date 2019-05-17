import React, { Component } from "react";
import { View } from "react-native";
import PropTypes from 'prop-types';

export default class Line extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={{ marginTop: `${this.props.marginTop}%`, marginBottom: `${this.props.marginBottom}%`, marginRight: `${this.props.marginRight}%`, marginLeft: `${this.props.marginLeft}%`, width: `${this.props.width}%`, borderBottomColor: `${this.props.color}`, borderBottomWidth: this.props.size }} />
    )
  }
}

Line.defaultProps = {
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  size: 1,
  width: 100,
  color: 'rgb(194, 194, 194)'
}