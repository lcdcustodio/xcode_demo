import React from 'react';
import { Text, View, StyleSheet, TextInput, Alert} from 'react-native';
import { Button, Container } from 'native-base';
import TextValue from '../../../../components/TextValue'
import ModalList from '../../../../components/ModalList'
import ModalListSearchable from '../../../../components/ModalListSearchable'
import moment from 'moment';
import uuid from 'uuid/v4';

import Events from "../index"

export default class Recommendation extends React.Component {

	constructor(props) {
		super(props);
		this.state = {	
			recommendationType: 'Selecione',
			modalRecommendationTypeVisible: false,
			modalSpecialtyVisible: false,
			listRecommendationType: [
				{key: 1, value: 'WELCOME_HOME', label: 'WELCOME HOME'},
				{key: 2, value: 'INDICACAO_AMBULATORIO', label: 'INDICAÇÃO AMBULATORIO'},
				{key: 3, value: 'RECOMENDACAO_MEDICAMENTOSA', label: 'RECOMENDAÇÃO MEDICAMENTOSA'}
			],
			recommendation: {
				uuid: null,
				performedAt: null,
				observation: ''
			}
		}
	}
	
	save = () => {
	
		if(this.state.recommendationType === 'Selecione'){
			this.showAlertMsg("Selecione uma recomendação")
		} else {
			if(this.selectedRecommendationMedicineReintegration() || this.selectedRecommendationWelcomeHomeIndication() || this.selectedrecommendationClinicalIndication()){
				this.props.navigation.navigate("Events", { 	exames: this.props.navigation.state.params.patient.examRequestList});
			} 
		} 
	}

	toggleModalRecommendationType = () => {
		this.setState({
			modalRecommendationTypeVisible: !this.state.modalRecommendationTypeVisible
		})
	}

	toggleModalSpecialty = () => {
		this.setState({
			modalSpecialtyVisible: !this.state.modalSpecialtyVisible 
		})
	}

	addRecommendation = recommendationType => {
		this.setState({
			recommendationType: recommendationType.item.label,
			recommendation: {
				...this.state.recommendation, 
				uuid: uuid(), 
				performedAt: moment() 
			}
		})
		this.toggleModalRecommendationType()
	}

	addObservation = observation => {
		this.setState({ 
			recommendation :  {
				...this.state.recommendation,
				observation
			}
		})
	}

	showAlertMsg= item =>{Alert.alert('Atenção', item,[{text: 'OK', onPress: () => {}}],{cancelable: false});}

	selectedRecommendationWelcomeHomeIndication=_=>{
		const indicationItem = this.state.listRecommendationType[0]
		if (this.state.recommendationType === indicationItem.label ) {
			if(this.props.patient.recommendationWelcomeHomeIndication){
				this.showAlertMsg(indicationItem.label + " já cadastrado!")
			} else {
				this.props.patient.recommendationWelcomeHomeIndication = this.state.recommendation
			}	
		}
	}

	selectedrecommendationClinicalIndication =_=>{
		const clinicalIndicationItem = this.state.listRecommendationType[1]
		if (this.state.recommendationType === clinicalIndicationItem.label) {
			if(this.props.patient.recommendationClinicalIndication){
				this.showAlertMsg(clinicalIndicationItem.label + " já cadastrado!")
			} else{
				if(!this.state.recommendation.specialtyId){
					this.showAlertMsg("Selecione uma especialidade")
				} else {
					return this.props.patient.recommendationClinicalIndication = this.state.recommendation
				}
			} 

		}
	}

	selectedRecommendationMedicineReintegration=_=>{
		const reintegrationItem = this.state.listRecommendationType[2]
		if (this.state.recommendationType === reintegrationItem.label ) {
			if(this.props.patient.recommendationMedicineReintegration){
				this.showAlertMsg(reintegrationItem.label + " já cadastrado!")
			} else {
				return this.props.patient.recommendationMedicineReintegration = this.state.recommendation
			}
		} 
	}

	recommendationType (item) {
		const recommendation = this.state.listRecommendationType
		if (item == recommendation[0].label){
			return recommendation[0].label;
		} else if(item == recommendation[1].label){
			return recommendation[1].label;
		} else if (item == recommendation[2].label){
			return recommendation[2].label;
		} else {
			return item
		}
	}

	showViewSpecialty =_=>{
		if(this.state.recommendationType === this.state.listRecommendationType[1].label){
			return 	<View style={ [styles.column100] }>
						<TextValue 	marginLeft="5" marginTop="2" marginBottom="2" press={ this.toggleModalSpecialty } color={'#0000FF'} value={ this.state.recommendation.specialtyDisplayName ? this.state.recommendation.specialtyDisplayName : 'Selecione' }  />
					</View>
		}
	}

	handlePrimaryspecialtyId = (specialty) => {

		this.setState({
			recommendation: {
				...this.state.recommendation,
				specialtyId: specialty.item.id,
				specialtyDisplayName: specialty.item.normalizedName
			}
		})

		this.toggleModalSpecialty()
	}

	render() {
		return (<Container>
					<View style={ styles.container }>
						<ModalList paddingTop={50} height={50} visible={this.state.modalRecommendationTypeVisible} 	list={this.state.listRecommendationType} action={this.addRecommendation} />
						<ModalListSearchable paddingTop={30} height={100} visible={this.state.modalSpecialtyVisible} list={this.props.baseDataSync.specialty} action={this.handlePrimaryspecialtyId} />
						<View style={styles.row}>
							<Text style={styles.title}>Recomendação</Text>
							<View style={ styles.column100 }>
								<TextValue 	marginLeft="2" marginTop="2" marginBottom="2" press={ this.toggleModalRecommendationType } color={'#0000FF'} value={ this.state.recommendationType }  />
							</View>
						</View>
						
						{ this.showViewSpecialty() }

						<View>
							<Text style={styles.label }>Observação</Text>
							<TextInput multiline={true} numberOfLines={5} style={styles.textArea} 
							value={this.state.recommendation.observation} onChangeText = {observation => this.addObservation(observation)} />
						</View>
						<View>
							<Button style={styles.styleButton} onPress={ () => this.save() }>
								<Text style={styles.textButton}>Salvar</Text>
							</Button>
						</View>
					</View>
				</Container>
			)}
}

const styles = StyleSheet.create({
	headerMenu: {
		backgroundColor: "#005cd1"
	},
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
		color: '#FFF',
		fontSize: 20
	}, 
	label: {
		fontSize: 17,
		color:  "#A9A9A9", 
		paddingLeft: 2,
		marginTop: 8
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
		paddingBottom:8,
		backgroundColor:'#19769F',
		borderColor: '#fff',
		padding: 2, 
		marginTop: '1%', 
		width: '100%', 
		justifyContent: 'center',
		borderRadius: 4
	  },
	  column100: {
		justifyContent: 'flex-start', 
		width: '100%',
		padding: 2
	}
});