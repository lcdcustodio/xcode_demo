import React, { Component } from "react"
import { View, Text, StyleSheet, Modal, Button, TextInput } from "react-native"
import PropTypes from 'prop-types'

export default class ModalInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      crm: this.props.crm
    }
  }

  save = () => {
    this.props.action(this.state.crm)
  }

  render(){
    return (
      <Modal
					animationType="fade"
					transparent={true}
					visible={this.props.visible} >

					<View style={styles.overlay}>
						<View style={styles.container}>
            <Text >CRM: </Text>
            <TextInput editable = {true} value={this.state.crm}
              onChangeText={(crm) => this.setState({crm})}
              style={{marginBottom: '5%', width: '50%', height: '25%', color:'#000000', borderColor: 'gray', borderWidth: 1}} />
            <Button style={{marginTop: '5%'}} onPress={ this.save } title="Salvar" color="#005cd1" />
						</View>
					</View>
      </Modal>
    )
  }
}

ModalInput.propTypes = {
  visible: PropTypes.bool.isRequired,
  crm: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: "row",
    paddingTop:'50%',
    paddingLeft:'5%', 
    paddingRight:'5%'
  },
  container: {
    padding: '5%',
    margin:'0%', 
    width:'100%', 
    height:'40%',
    backgroundColor: 'white', 
    borderRadius: 4, 
    borderColor:'#000000', 
    borderStyle:'solid', 
    borderWidth:1
  },
})