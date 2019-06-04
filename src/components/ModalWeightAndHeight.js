import React, { Component } from "react"
import { View, Text, StyleSheet, Modal, Button, TextInput } from "react-native"
import PropTypes from 'prop-types'

export default class ModalWeightAndHeight extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: this.props.height,
      weight: this.props.weight
    }
  }

  save = () => {
    this.props.action(this.state.height, this.state.weight)
  }

  render(){
    return (
      <Modal
					animationType="fade"
					transparent={true}
					visible={this.props.visible} >

					<View style={styles.overlay}>
						<View style={styles.container}>

              <View  style={{marginTop: '5%', width: '70%'}}>
                <Text> Altura: </Text>
                <TextInput editable = {true} value={`${this.state.height}`}
                  onChangeText={(height) => this.setState({height})}
                  keyboardType={'numeric'}
                  style={{marginBottom: '5%', width: '70%', height: '25%', color:'#000000', borderColor: 'gray', borderWidth: 1}} />

                <Text> Peso: </Text>
                <TextInput editable = {true} value={`${this.state.weight}`}
                  onChangeText={(weight) => this.setState({weight})}
                  keyboardType={'numeric'}
                  style={{marginBottom: '5%', width: '70%', height: '25%', color:'#000000', borderColor: 'gray', borderWidth: 1}} />
              </View>
              <Button style={{marginTop: '5%'}} onPress={ this.save } title="Salvar" color="#005cd1" />
            </View>    
					</View>
      </Modal>
    )
  }
}

ModalWeightAndHeight.propTypes = {
  height: PropTypes.any.isRequired,
  weight: PropTypes.any.isRequired,
  visible: PropTypes.bool.isRequired,
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
    height:'70%',
    backgroundColor: 'white', 
    borderRadius: 4, 
    borderColor:'#000000', 
    borderStyle:'solid', 
    borderWidth:1
  },
})
