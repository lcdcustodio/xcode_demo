import React, { Component } from "react"
import { View, Text, StyleSheet, Modal, Button, TextInput } from "react-native"
import PropTypes from 'prop-types'

export default class ModalInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value
    }
  }

  save = () => {
    this.props.action(this.state.value ? this.state.value : 'INFORMAR')
  }

  render(){
    return (
      <Modal
					animationType="fade"
					transparent={true}
					visible={this.props.visible} >
          
          <View style={[styles.overlay, {paddingTop: `${this.props.paddingTop}%`} ]}>
            <View style={[styles.container, {height: `${this.props.height}%`} ]}>
            <Text> {`${this.props.label}:`} </Text>
            <TextInput editable = {true} value={this.state.value} onChangeText={(value) => this.setState({value})}
              style={styles.inputText} />
            <Button onPress={ this.save } title="Salvar" color="#005cd1" />
						</View>
					</View>
      </Modal>
    )
  }
}

ModalInput.propTypes = {
  visible: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired
}

ModalInput.defaultProps = {
  paddingTop: '20',
  height:'100',
}

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
    width: '50%', 
    height: 35, 
    color:'#000000', 
    borderColor: 'gray', 
    borderWidth: 1
  }
})
