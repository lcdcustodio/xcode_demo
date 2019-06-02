import React, { Component } from "react";
import { View, StyleSheet, Modal, Button } from "react-native";
import PropTypes from 'prop-types';
import NumericInput from 'react-native-numeric-input'
import Slider from '@react-native-community/slider';
import TextValue from '../components/TextValue'


export default class ModalWheelPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: this.props.initValueHeight,
      weight: this.props.initValueWeight
    }
  }

  save = () => {
    this.props.actionClose(this.state.height, this.state.weight)
  }

  render(){
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.visible} >

        <View style={styles.overlay}>
          <View style={styles.container}>
            <TextValue marginTop="5" marginLeft="5" value={ `Altura: ${this.state.height.toFixed(2)}`} />
            <Slider
              value={this.state.height}
              minimumValue={0}
              maximumValue={3}
              step={0.01}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="#000000"
              onValueChange={ height => this.setState({height}) }/>

            <TextValue marginTop="5" marginLeft="5" value={ `Peso: ${this.state.weight.toFixed(3)}`} />
            <View style={{marginTop: '3%', marginBottom: '5%'}}>
              <NumericInput
                containerStyle={{marginLeft: '5%'}}
                value={this.state.weight}
                step={0.100}
                maxValue={500}
                valueType={'real'}
                rounded={true}
                editable={false}
                rightButtonBackgroundColor={'#20B2AA'}
                leftButtonBackgroundColor={'#20B2AA	'}
                onChange={ weight => this.setState({weight}) }/>
            </View>
            
            <Button style={{marginTop: '5%'}} onPress={ this.save } title="Salvar" color="#005cd1" />
          </View>
        </View>
      </Modal>
    )
  }
}

ModalWheelPicker.propTypes = {
  visible: PropTypes.bool.isRequired,
  initValueHeight: PropTypes.number.isRequired,
  initValueWeight: PropTypes.number.isRequired,
  actionClose: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: "row",
    paddingTop:'30%', 
    paddingLeft:'5%', 
    paddingRight:'5%'
  },
  container: {
    padding: '5%',
    margin:'0%', 
    width:'100%', 
    height:'60%', 
    backgroundColor: 'white', 
    borderRadius: 4, 
    borderColor:'#000000', 
    borderStyle:'solid', 
    borderWidth:1
  },
  text: {
    color: "rgb(61, 61, 61)", 
    fontFamily: "Gotham Rounded-Book",
    fontWeight: "normal", 
    fontStyle: "normal", 
    fontSize: 18,
    lineHeight: 22, 
    letterSpacing: 0,
    marginLeft: '5%',
    marginTop: '5%',
  }
})