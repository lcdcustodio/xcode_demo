import React, { Component } from "react"
import { View, Text, StyleSheet, Modal, Button, TextInput } from "react-native"
import PropTypes from 'prop-types'

export default class ModalWeightAndHeight extends Component {
  constructor(props) {
    super(props)
    this.state = {
      patientHeight: this.props.patientHeight,
      patientWeight: this.props.patientWeight
    }
  }

  save = () => {
    this.props.action(this.state.patientHeight, this.state.patientWeight)
  }

  render(){
    return (
      <Modal
					animationType="fade"
					transparent={true}
					visible={this.props.visible} >

          <View style={[styles.overlay, {paddingTop: `${this.props.paddingTop}%`} ]}>
            <View style={[styles.container, {height: `${this.props.height}%`} ]}>

              <View  style={{marginBottom: '5%', marginTop: '5%'}}>
                <Text> Altura: </Text>
                <TextInput editable = {true} value={`${this.state.patientHeight}`}
                  onChangeText={(patientHeight) => this.setState({patientHeight})}
                  keyboardType={'numeric'}
                  style={styles.inputText} />

                <Text> Peso: </Text>
                <TextInput editable = {true} value={`${this.state.patientWeight}`}
                  onChangeText={(patientWeight) => this.setState({patientWeight})}
                  keyboardType={'numeric'}
                  style={styles.inputText} />
              </View>
              <Button onPress={ this.save } title="Salvar" color="#005cd1" />
            </View>    
					</View>
      </Modal>
    )
  }
}

ModalWeightAndHeight.propTypes = {
  patientHeight: PropTypes.any.isRequired,
  patientWeight: PropTypes.any.isRequired,
  visible: PropTypes.bool.isRequired,
  action: PropTypes.func.isRequired
}

ModalWeightAndHeight.defaultProps = {
  paddingTop: '20',
  height:'100',
};

const styles = StyleSheet.create({
  overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: "row",
    paddingLeft:'5%', 
    paddingRight:'5%'
  },
  container: {
    padding: '5%',
    margin:'0%', 
    width:'100%', 
    backgroundColor: 'white', 
    borderRadius: 4, 
    borderColor:'#000000', 
    borderStyle:'solid', 
    borderWidth:1
  },
  inputText: {
    marginBottom: '5%', 
    width: '70%', 
    height: 35, 
    color:'#000000', 
    borderColor: 'gray', 
    borderWidth: 1
  }
})
