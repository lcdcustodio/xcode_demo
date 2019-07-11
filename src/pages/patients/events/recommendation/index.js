import React from 'react';
import { View, StyleSheet, Alert, ScrollView, Keyboard } from 'react-native';
import { Container, Content, Text } from 'native-base';
import { RdHeader } from '../../../../components/rededor-base';
import TextValue from '../../../../components/TextValue'
import moment from 'moment';
import Uuid from 'uuid/v4';
import { toJsonDate } from '../../../../components/rededor-base';
import data from '../../../../../data.json';
import Modal from '../../../../components/Modal';

import { Button, Dialog, Portal, RadioButton, Divider, TextInput } from 'react-native-paper';

export default class Recommendation extends React.Component {

	constructor(props) {
		super(props);
		this.state = {	
			specialty: data.specialty, 
			auxSpecialty: data.specialty, 
			recommendationType: 'Selecione',
			modalRecommendationTypeVisible: false,
			modalSpecialtyVisible: false,
			listRecommendationType: [
				{key: 1, value: 'WELCOME_HOME', label: 'WELCOME HOME'},
				{key: 2, value: 'INDICACAO_AMBULATORIO', label: 'INDICAÇÃO AMBULATÓRIO'},
				{key: 3, value: 'RECOMENDACAO_MEDICAMENTOSA', label: 'RECOMENDAÇÃO MEDICAMENTOSA'}
			],
			recommendation: {
				uuid: null,
				performedAt: null,
				observation: ''
			},
			update: false,
			specialtyQuery: null,
			keyboardSpace: 0,
		}
		Keyboard.addListener('keyboardDidShow',(frames)=>{
            if (!frames.endCoordinates) return;
            this.setState({
				keyboardSpace: frames.endCoordinates.height
			});
		});
        Keyboard.addListener('keyboardDidHide',(frames)=>{
            this.setState({keyboardSpace:0});
		});
	}
	
	didFocus = this.props.navigation.addListener('didFocus', (payload) => {
		const { params } = this.props.navigation.state;
		const update = params.update;

		if (update) {
			let {patient} = params;
	
			if(this.isaRecommendationWelcomeHome(patient.recommendationType)){
				recommendationType = this.state.listRecommendationType[0].label;
			} else 
			if (this.isaRecommendationClinicalIndication(patient.recommendationType)){
				recommendationType = this.state.listRecommendationType[1].label
			} else 
			if(this.isaRecommendationMedicineReintegration(patient.recommendationType)){
				recommendationType = this.state.listRecommendationType[2].label;
			}
			
			this.setState({
				recommendationType: recommendationType,
				recommendation: params.event.data,
				performedAt: toJsonDate(),
				update: update
			});
		} else {
			this.setState({
				recommendationType: 'Selecione',
				recommendation: {
					uuid: Uuid(), 
					performedAt: toJsonDate(), 
				},
				update: update
			});
		}
	});

	save = async _ => {
		let patient = this.props.navigation.state.params.patient;
		let update = this.state.update;

		if(!update && this.state.recommendationType === 'Selecione'){
			this.showAlertMsg("Selecione uma recomendação.");
		} else {
			if (await this.saveRecommendation(patient)) {
				this.props.navigation.navigate("PatientDetail", { patient, selectedTab: 'events' });
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
		const recommendationSelected = this.getRecommendationTypeLabel(recommendationType);
		this.setState({
			recommendationType: recommendationSelected,
			recommendation: {
				...this.state.recommendation, 
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

	selectedRecommendationWelcomeHomeIndication = async patient =>{
		const indicationItem = this.state.listRecommendationType[0].label;
		if (this.state.recommendationType === indicationItem ) {
			if(patient.recommendationWelcomeHomeIndication && !this.state.update){
				this.showAlertMsg(indicationItem + " já cadastrado!")
			} else {
				const { handleUpdatePatient } = this.props.navigation.state.params;
				const { recommendation } = this.state;
				await handleUpdatePatient('recommendationWelcomeHomeIndication', recommendation);
				patient.recommendationWelcomeHomeIndication = recommendation;
				return true;
			}	
		}
	}

	selectedRecommendationClinicalIndication = async patient =>{
		const clinicalIndicationItem = this.state.listRecommendationType[1].label;
		if (this.state.recommendationType === clinicalIndicationItem) {
			if(patient.recommendationClinicalIndication && !this.state.update){
				this.showAlertMsg(clinicalIndicationItem + " já cadastrado!")
			} else{
				if(!this.state.recommendation.specialtyId){
					this.showAlertMsg("Selecione uma especialidade")
				} else {
					const { handleUpdatePatient } = this.props.navigation.state.params;
					const { recommendation } = this.state;
					await handleUpdatePatient('recommendationClinicalIndication', recommendation);
					patient.recommendationClinicalIndication = recommendation;
					return true;
				}
			} 

		}
	}

	selectedRecommendationMedicineReintegration = async patient =>{
		const reintegrationItem = this.state.listRecommendationType[2].label;
		if (this.state.recommendationType === reintegrationItem ) {
			if(patient.recommendationMedicineReintegration && !this.state.update){
				this.showAlertMsg(reintegrationItem + " já cadastrado!")
			} else {
				const { handleUpdatePatient } = this.props.navigation.state.params;
				const { recommendation } = this.state;
				await handleUpdatePatient('recommendationMedicineReintegration', recommendation);
				patient.recommendationMedicineReintegration =  recommendation;
				return true;
			}
		} 
	}

	saveRecommendation = async patient => {
		return await this.selectedRecommendationMedicineReintegration(patient)
			|| await this.selectedRecommendationWelcomeHomeIndication(patient)
			|| await this.selectedRecommendationClinicalIndication(patient);
	}

	getRecommendationTypeLabel = item => {
		const recommendations = this.state.listRecommendationType
		if (this.isaRecommendationWelcomeHome(item)){
			return recommendations[0].label;
		} else if(this.isaRecommendationClinicalIndication(item)){
			return recommendations[1].label;
		} else if (this.isaRecommendationMedicineReintegration(item)){
			return recommendations[2].label;
		} else {
			return item
		}
	}

	showViewSpecialty =_=> {
/*		const update = this.props.navigation.state.params.update;
		if (update) {
			let patient = this.props.navigation.state.params.patient;
			if( this.getRecommendationTypeLabel(patient.recommendationType) === this.state.listRecommendationType[1].label){
				return 	<View style={ [styles.column100] }>
							<Text sytle={styles.textDisable}>{patient.recommendationClinicalIndication.specialtyDisplayName}</Text>
						</View>
			}
		} else { */
		if (this.state.recommendationType === this.state.listRecommendationType[1].label) {	
			return 	(
				<View style={ [styles.column100] }>
					<TextValue 	marginLeft="5" marginTop="2" marginBottom="2" press={ this.toggleModalSpecialty } color={'#0000FF'} value={ this.state.recommendation.specialtyDisplayName ? this.state.recommendation.specialtyDisplayName : 'Selecione' }  />
				</View>
			);
		}
//		}
	}
	
	showRecommendationType = _ => {
		const update = this.props.navigation.state.params.update;
		
		if(update){
			let patient = this.props.navigation.state.params.patient;
			return <Text sytle={styles.textDisable}>{this.getRecommendationTypeLabel(patient.recommendationType)}</Text>
		} else {
			return <TextValue 	marginLeft="2" marginTop="2" marginBottom="2" press={ this.toggleModalRecommendationType } color={'#0000FF'} value={ this.state.recommendationType  }  />
		}
	}

	handleSpecialtyId = (specialty) => {
		this.setState({
			recommendation: {
				...this.state.recommendation,
				specialtyId: specialty.item.id,
				specialtyDisplayName: specialty.item.normalizedName,
			},
			auxSpecialty: data.specialty,
			specialtyQuery: null
		})

		this.toggleModalSpecialty()
	}

	isaRecommendationClinicalIndication = (recommendationType) => {
		return recommendationType === this.state.listRecommendationType[1].value;
	}

	isaRecommendationMedicineReintegration = (recommendationType) =>{
		return recommendationType === this.state.listRecommendationType[2].value;
	}

	isaRecommendationWelcomeHome = (recommendationType) =>{
		return recommendationType === this.state.listRecommendationType[0].value;
	}

	render() {
		return (<Container>
				<RdHeader title='Recomendação para Alta' goBack={() =>this.props.navigation.navigate("PatientDetail", { selectedTab: 'events'})} />
				<Content>
				<View style={ styles.container }>

					<Portal>
						<Dialog style={{top: this.state.keyboardSpace ? -(this.state.keyboardSpace * .47) : 0}}  visible={this.state.modalRecommendationTypeVisible} onDismiss={ () => { this.toggleModalRecommendationType() } }>
							<Dialog.Title>Recomendação</Dialog.Title>
							
							<Divider />
							
							<Dialog.Content>
								<RadioButton.Group onValueChange={ value => { this.addRecommendation(value) } } value={() => this.getRecommendationTypeLabel(this.props.navigation.state.params.patient.recommendationType)}>
									<View style={styles.recommendationItem}>
										<RadioButton value="WELCOME_HOME" />
										<Text onPress={ _ => { this.addRecommendation(this.state.listRecommendationType[0].value)}}>{this.state.listRecommendationType[0].label}</Text>
									</View>
									<View style={styles.recommendationItem}>
										<RadioButton value="INDICACAO_AMBULATORIO" />
										<Text onPress={ _ => { this.addRecommendation(this.state.listRecommendationType[1].value)}}>{this.state.listRecommendationType[1].label}</Text>
									</View>
									<View style={styles.recommendationItem}>
										<RadioButton value="RECOMENDACAO_MEDICAMENTOSA" />
										<Text onPress={ _ => { this.addRecommendation(this.state.listRecommendationType[2].value)}}>{this.state.listRecommendationType[2].label}</Text>
									</View>
								</RadioButton.Group>
							</Dialog.Content>

							<Divider />

{/* 							<Dialog.Actions>
								<Button onPress={ () => { this.toggleModalRecommendationType() } }>Fechar</Button>
							</Dialog.Actions> */}
						</Dialog>
					</Portal> 

					<Modal title="Especialidade" visible={this.state.modalSpecialtyVisible} list={this.state.auxSpecialty} onSelect={ (item) => { this.handleSpecialtyId(item) }} close={() => { this.toggleModalSpecialty() }} />

					<View style={styles.row}>
						<Text style={styles.title}>Recomendação</Text>
						<View style={ styles.column100 }>
							{ this.showRecommendationType() }
						</View>
					</View>
					
					{ this.showViewSpecialty() }

					<View style={styles.row}>
						<Dialog.ScrollArea>
							<ScrollView style={ styles.dialogScrollView } keyboardShouldPersistTaps='always'>
								<TextInput  style={styles.textObservation} multiline={true} numberOfLines={6} label='Observação' value={this.state.recommendation.observation} onChangeText = {observation => this.addObservation(observation)} />
							</ScrollView>
						</Dialog.ScrollArea>
					</View>

					<View style={styles.button}>
						<Button  mode="contained" onPress={ () => this.save() }>Salvar</Button>
					</View>

				</View>
				<View >
				</View>
				</Content>
				</Container>
			)}
}

const styles = StyleSheet.create({
	header: {
		backgroundColor: "#005cd1"
	},
	container: {
		marginLeft: 20, 
		marginRight: 20 
	},
	row: {
		marginTop: '5%',
		width: '100%'
	},
	button: {
		width: '100%',
		marginTop: 10
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
	textDisable: {
		fontSize: 20,
      	color:  "#A9A9A9", 
		marginLeft: 5,
		marginTop: 2
	},
	label: {
		fontSize: 17,
		color:  "#A9A9A9", 
		paddingLeft: 2,
		marginTop: 8
	},
	textArea: {
		width: "100%",
		height: 100,
		borderColor: '#ccc',
		borderWidth: 1, 
		padding: 1,
		textAlign: 'justify',
    	lineHeight: 30,
		padding: 10,
	},
	column100: {
		justifyContent: 'flex-start', 
		width: '100%',
		padding: 2
	},
	recommendationItem: {
		flexDirection: 'row', 
		alignItems: 'center',
		flexWrap: 'wrap', 
		padding: 3,
		fontSize: 14
	},
	textObservation: {
		backgroundColor: 'white',
		width: '100%',
	},
	dialogScrollView: {
        marginTop: 20, 
        marginLeft: -18, 
		marginRight: -18,
		height: 160 
    }
});