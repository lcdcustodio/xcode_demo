import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default class recommedation extends Component {
	
	constructor(props) {
		const WELCOME_HOME = "welcome home"
		const INDICACAO_AMBULATORIO = "INDICAÇÃO AMBULATÓRIO"
		const RECOMENDACAO_MEDICAMENTOSA = "REC. MEDICAMENTOSA"
		super(props);
		this.state = {	
			recommendation: '',
			observation: '',
			modalVisible: false,
			recommendationClinicalIndication: null,
			recommendationWelcomeHomeIndication: null,
			recommendationMedicineReintegration: null
		}
	}
	
	updateRecommendation = (recommendation) => {
		this.setState({ recommendation })
	}

	addObservation = observation => {
		this.setState({	observation })
	}

	picker = _ => {
	    this.setState({modalVisible: !this.state.visible})
		console.log("exibindo modal")
	}

	itemSelected = item =>{
		if(item === WELCOME_HOME){
				
		} else 
		if(item === INDICACAO_AMBULATORIO){

		} if (item === RECOMENDACAO_MEDICAMENTOSA){

		}
	}

	render() {
		return (
			<View style={ styles.container }>
				<View style={styles.row}>
					<Text style={styles.title}>Recomendação</Text>
						<TouchableOpacity style={styles.styleButton} onPress={this.picker} underlayColor='#fff'>
							<Text style={styles.textButton}>Escolher</Text>
						</TouchableOpacity>
					 <View>
				</View>
					<Text style={styles.text}>{this.state.recommendation}</Text>
					<Text style={styles.label }>Observation</Text>
					<TextInput multiline={true} numberOfLines={5} style={styles.textArea} 
					value={this.state.observation} onChangeText = {observation => this.addObservation(observation)} />
				</View>
				<View>
	 		</View>

			</View>);
	}
}

const styles = StyleSheet.create({
	container: {
		display: 'flex'
	},
	row: {
		marginTop: '5%',
		width: '100%'
	},
	title:{
		fontSize: 20,
		paddingLeft: 2,
		color: '#000',
		fontWeight: "bold",
		width: '100%'
	}, 
	text: {
		fontSize: 20,
      	color:  "#19769F", 
		paddingLeft: 2,
		paddingBottom: 8,
	},
	textButton: {
		fontSize: 18,
      	color:  "#19769F", 
		paddingLeft: 2
	}, 
	label: {
		fontSize: 16,
		color:  "#A9A9A9", 
		paddingLeft: 2
	},
	textArea: {
		width: "100%",
		height: "45%",
		borderColor: '#000',
		borderWidth: 1, 
		padding: 1,
	},
	styleButton:{
		paddingTop:8,
		paddingBottom:5,
		backgroundColor:'#FFF',
		borderColor: '#fff'
	  }
});