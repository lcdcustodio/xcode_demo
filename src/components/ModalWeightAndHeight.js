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

    removerLettersAndSpecialCharacters(str) {
      return str.replace(/ [a-z] | [A-Z] | [&\/\\#,+()$~%.'":*?<>{}]/g, "")
    }

	formartHeight(str) {
		return str.toString().replace(/(\d{1})(?=(\d{2}))/, '$1,')
	}

	formartWeight(str) {
		if(str.length <= 3) {
			return str;
		} else if(str.length > 3 && str.length <= 4) {
			if(str.slice(3) === ',') {
				return `${str.slice(0,3)}`
			} else {
				return `${str.slice(0,3)},${str.slice(3)}`
			}
		} else if(str.length > 4 && str.length <= 5) {
			return `${str.slice(0,3)},${str.slice(4,5)}`
		} else {
			return str
		}
	}

    validateHeight = (height) => {
		height = this.removerLettersAndSpecialCharacters(height)
		height = this.formartHeight(height)
		//let isValid = height.match(/[0-9,]+/)
		this.setState({patientHeight: height})
    }

    validateWeight = (weight) => {
		weight = this.removerLettersAndSpecialCharacters(weight)
		weight = this.formartWeight(weight)
		let isValid = weight.match(/^[0-9,]+$/)
		this.setState({patientWeight: weight})
        /* if(isValid) {
            this.setState({patientWeight: weight})
        } */
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
								onChangeText={(patientHeight) => this.validateHeight(patientHeight) }
								keyboardType={'numeric'} maxLength={4}
								style={styles.inputText} />

							<Text> Peso: </Text>
							<TextInput editable = {true} value={`${this.state.patientWeight}`}
								onChangeText={(patientWeight) => this.validateWeight(patientWeight) }
								keyboardType={'numeric'} maxLength={7}
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
