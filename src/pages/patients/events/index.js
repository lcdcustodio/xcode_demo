import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, FlatList } from 'react-native';
import { Card, CardItem, Body, Right, Left } from 'native-base';
import { Button} from 'react-native-paper';
import baseStyles from '../../../styles';
import TimelineEvent, { TimelineEventEnum, TimelineEventEvaluation, timelineEventSorter } from '../../../util/TimelineEvent'
import moment from 'moment';
import { RdIf } from '../../../components/rededor-base'
import Patient, { StatusVisitEnum } from '../../../model/Patient'

export default class Events extends Component {
	
	constructor(props) {
		super(props);
		const { patient } = this.props;
		this.state = {
			patient: patient,
			eventos: this._loadEvents(patient),
			isEditable: this.props.isEditable
		};
	}
		
	willFocus = this.props.navigation.addListener('willFocus', (payload) => {
		const patient = this.props.navigation.getParam('patient');
		this.setState({
			patient: patient,
			eventos: this._loadEvents(patient),
		});
	});

	render() {
		return (
			<View style={ styles.container }>
				<FlatList 
					contentContainerStyle={ baseStyles.container }
					data={this.state.eventos}
					keyExtractor={ (event) => { return event.data.uuid; } }
					renderItem={ this._renderEvent } />
				<RdIf condition={ this.state.isEditable }> 
					<View style={{ marginTop:10, marginBottom: 10, marginLeft: 10, marginRight: 10 }}>
						<Button mode="contained" onPress={this._create}>APONTAR</Button>
					</View>
				</RdIf>
			</View>
		);
	}

	_loadEvents = (patient) => {
		let events = [];
		this._pushRecommendation(events, patient.recommendationWelcomeHomeIndication, 'WELCOME HOME');
		this._pushRecommendation(events, patient.recommendationMedicineReintegration, 'REC. MEDICAMENTOSA');
		this._pushRecommendation(events, patient.recommendationClinicalIndication, 'INDICAÇÃO AMBULATÓRIO');
		this._pushEvents(events, patient.examRequestList, this._createExamRequest);
		this._pushEvents(events, patient.furtherOpinionList, this._createFurtherOpinion);
		this._pushEvents(events, patient.medicalProceduresList, this._createMedicalProcedure);
		this._pushEvents(events, patient.medicineUsageList, this._createMedicineUsage);
		events.sort(timelineEventSorter);
		return events;
	}

	_pushEvents = (destination, source, formatter) => {
		source.forEach((jsonItem) => { destination.push(formatter(jsonItem)) });
	}

	_pushRecommendation = (destination, source, name) => {
		if (source) {
			destination.push(new TimelineEvent(
				TimelineEventEnum.Recommendation,
				source,
				moment(source.performedAt).toDate(),
				'Recomendação para alta',
				name + (source.specialtyDisplayName ? (': ' + source.specialtyDisplayName) : ''),
				source.observation,
				null,
				null,
			));
		}
	}

	_createExamRequest = (json) => new TimelineEvent(
		TimelineEventEnum.ExamRequest,
		json,
		moment(json.performedAt).toDate(),
		'Exame',
		json.examDisplayName,
		(json.examHighCost ? 'Alto Custo' : null),
		this._createEvaluation(json.costEvaluation),
		this._createEvaluation(json.qualityEvaluation),
	);

	_createFurtherOpinion = (json) => new TimelineEvent(
		TimelineEventEnum.FurtherOpinion,
		json,
		moment(json.performedAt).toDate(),
		'Parecer',
		json.specialtyDisplayName,
		null,
		this._createEvaluation(json.costEvaluation),
		this._createEvaluation(json.qualityEvaluation),
	);
	
	_createMedicalProcedure = (json) => new TimelineEvent(
		TimelineEventEnum.MedicalProcedure,
		json,
		moment(json.performedAt).toDate(),
		'Procedimento',
		json.tussDisplayName,
		null,
		this._createEvaluation(json.costEvaluation),
		this._createEvaluation(json.qualityEvaluation),
	);

	_createMedicineUsage = (json) => new TimelineEvent(
		TimelineEventEnum.MedicineUsage,
		json,
		moment(json.performedAt).toDate(),
		'Medicamento',
		json.medicineDisplayName,
		null,
		this._createEvaluation(json.costEvaluation),
		this._createEvaluation(json.qualityEvaluation),
	);
	
	_createEvaluation = (json) => (json 
		? new TimelineEventEvaluation(json.satisfactory, json.observation)
		: null);

	_create = () => {
		this.props.navigation.navigate('Recommendation', {
			patient: this.state.patient,
			update: false,
			handleUpdatePatient: this.props.handleUpdatePatient,
		});
	}

	isaRecommendation = typeEnum => typeEnum === 4;
	
	_read = (event) => {
		if (this.isaRecommendation(event.typeEnum)) {
			const patientEntity = new Patient(this.state.patient);
			const status = patientEntity.getStatusVisitEnum()
			if (status === StatusVisitEnum.VisitedDischarged || status === StatusVisitEnum.NotVisitedDischarged) {
				Alert.alert('Atenção', "Paciente já está de alta", [{text:'OK',onPress:()=>{}}],{cancelable: false});
			} else {
				this.recommendationSelected(event, this.state.patient);
				this.props.navigation.navigate('Recommendation', {
					patient: this.state.patient,
					event: event,
					update: true,
					handleUpdatePatient: this.props.handleUpdatePatient,
				});
			}
		}
	}

	_delete = (event) => {
		if (this.isaRecommendation(event.typeEnum)) {
			const patientEntity = new Patient(this.state.patient);
			const status = patientEntity.getStatusVisitEnum()
			if (status === StatusVisitEnum.VisitedDischarged || status === StatusVisitEnum.NotVisitedDischarged) {
				Alert.alert('Atenção', "Não é permitido excluir a recomendação selecionada!",[{text: 'OK', onPress: () => {}}],{cancelable: false});
			} else {
				const { handleUpdatePatient } = this.props;
				const { patient } = this.state;
				function deleteRecommendation(itemName) {
					if (patient[itemName] && patient[itemName].uuid === event.data.uuid)	{
						patient[itemName] = null;
						handleUpdatePatient(itemName, null);
					}
				}
				deleteRecommendation('recommendationClinicalIndication');
				deleteRecommendation('recommendationMedicineReintegration');
				deleteRecommendation('recommendationWelcomeHomeIndication');
				this.setState({
					patient: patient,
					eventos: this._loadEvents(patient),
				});
			}
		} else {
			this._read(event); 
		}
		
	}

	_renderEvent = (event, index) => {
		const eventInfo = event.item;
		return (
		<View key={index} style={{ paddingTop: 10, paddingLeft: 10, paddingRight: 10, backgroundColor: baseStyles.container.backgroundColor}}>
		<Card>
			<CardItem header bordered style={{ flex: 1, backgroundColor: ITEM_COLOR[eventInfo.typeEnum], height: 60}}>
				<Left>
					<Text style={{ fontSize: 16, fontWeight: 'bold'}}>{eventInfo.type}</Text>
				</Left>
				<Right>
					<Text>{moment(eventInfo.time).format('DD/MM/YYYY')}</Text>
				</Right>
			</CardItem>
			<CardItem bordered>
				<Body>
					<Text>
						{eventInfo.name}
					</Text>
					{ eventInfo.comments !== null &&
						<Text>
							{eventInfo.comments}
						</Text>
					}
				</Body>
			</CardItem>
			<RdIf condition={this.state.isEditable && eventInfo.typeEnum === TimelineEventEnum.Recommendation}>
				<CardItem footer bordered style={{ alignItems: 'center', justifyContent: 'center', height: 40}}>							
					<View>
						<Text style={{color: '#00dda2', paddingRight: 20}} onPress={ () => this._read(eventInfo) }>Editar</Text>
					</View>
					<View  style={{borderRightColor: '#ffffff', borderWidth: 1, height: '80%', borderBottomColor: '#ffffff', borderTopColor: '#ffffff', borderLeftColor: '#ebeff2'}}></View>
					<View>
						<Text style={{color: '#f73655', paddingLeft: 20}} onPress={ () => this._delete(eventInfo) }>Excluir</Text>
					</View>
				</CardItem>
			</RdIf>
		</Card>
		</View>
		);
	}

	recommendationSelected(event, patient) {
		let uuid = event.data.uuid;
		if (patient.recommendationClinicalIndication && uuid === patient.recommendationClinicalIndication.uuid) {
			patient.recommendationType = 'INDICACAO_AMBULATORIO';
			patient.recommendation = patient.recommendationClinicalIndication;
		}
		else if (patient.recommendationMedicineReintegration && uuid === patient.recommendationMedicineReintegration.uuid) {
			patient.recommendationType = 'RECOMENDACAO_MEDICAMENTOSA';
			patient.recommendation = patient.recommendationMedicineReintegration;
		}
		else if (patient.recommendationWelcomeHomeIndication && uuid === patient.recommendationWelcomeHomeIndication.uuid) {
			patient.recommendationType = 'WELCOME_HOME';
			patient.recommendation = patient.recommendationWelcomeHomeIndication;
		}
	}
}

const ITEM_COLOR = {};
ITEM_COLOR[TimelineEventEnum.ExamRequest] = '#CCE5FF';
ITEM_COLOR[TimelineEventEnum.FurtherOpinion] = '#89CBE8';
ITEM_COLOR[TimelineEventEnum.MedicalProcedure] = '#A3F6FF';
ITEM_COLOR[TimelineEventEnum.MedicineUsage] = '#89E8DD';
ITEM_COLOR[TimelineEventEnum.Recommendation] = '#96FFDB';

const styles = StyleSheet.create({
	container: {
		...baseStyles.container,
		flex: 1,
	},
	date: {
		fontFamily:'Segoe UI', 
		fontWeight:'400', 
		fontStyle:'normal', 
		color:'#9d9d9d',
	},
	description: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	title: {
		fontFamily:'Segoe UI', 
		fontSize:18, 
		fontWeight:'300', 
		fontStyle:'normal', 
		lineHeight:19, 
		letterSpacing:0, 
		color:'#000000',
	},
	highlight: {
		width: '35%',
		height: '140%',
		padding: '3%',
		paddingLeft: '5%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		fontFamily:'Segoe UI', 
		fontWeight:'400', 
		fontSize:13, 
		fontStyle:'normal', 
		lineHeight:13,
		color: '#bfcc4d',
		backgroundColor: '#cf175c',
	},
	rowButtonCircle: {
		marginTop: '5%',
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	circle: {
		paddingTop: '4%',
		width: 80,
		height: 80,
		borderRadius: 80/2,
		flexDirection: 'column',
		alignItems: 'center'
	},
	borderCircle: {
		borderColor: '#707070',
		borderStyle: 'solid',
		borderWidth: 1,
	},
	iconCircle: {
		color: 'white'
	},
	textCircle: {
		fontFamily: 'Gotham Rounded', 
		fontSize:12, 
		fontWeight: 'normal', 
		fontStyle: 'normal', 
		letterSpacing: 0, 
		color: 'white' 
	}
});
